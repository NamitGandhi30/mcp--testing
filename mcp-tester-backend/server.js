const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { spawn } = require('child_process');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Helper function to validate MCP configuration format
const validateMCPConfig = (config) => {
  if (!config || !config.mcpServers) {
    throw new Error('Invalid configuration: missing mcpServers object');
  }

  // Check if at least one server is configured
  if (Object.keys(config.mcpServers).length === 0) {
    throw new Error('Invalid configuration: no servers defined');
  }

  // Validate each server configuration
  for (const [serverName, serverConfig] of Object.entries(config.mcpServers)) {
    if (!serverConfig.command || !Array.isArray(serverConfig.args)) {
      throw new Error(`Invalid configuration for server ${serverName}: missing command or args`);
    }
  }

  return true;
};

// Helper function to start MCP server process with timeout
const startMCPServer = (serverConfig, timeoutMs = 120000) => {
  return new Promise((resolve, reject) => {
    console.log('Starting MCP server with config:', serverConfig);
    
    const process = spawn(serverConfig.command, serverConfig.args, {
      shell: true,
      windowsHide: true
    });
    
    let output = '';
    let errorOutput = '';
    let isWebSocketConnected = false;
    
    process.stdout.on('data', (data) => {
      const chunk = data.toString();
      console.log('Server output:', chunk);
      output += chunk;
      
      // Check for successful WebSocket connection
      if (chunk.includes('WebSocket connection established successfully')) {
        isWebSocketConnected = true;
        resolve({
          success: true,
          output,
          errorOutput: errorOutput || undefined,
          status: 'connected'
        });
      }
    });
    
    process.stderr.on('data', (data) => {
      const chunk = data.toString();
      console.log('Server error:', chunk);
      errorOutput += chunk;
      
      // Also check stderr for WebSocket connection success
      if (chunk.includes('WebSocket connection established successfully')) {
        isWebSocketConnected = true;
        resolve({
          success: true,
          output,
          errorOutput: errorOutput || undefined,
          status: 'connected'
        });
      }
    });
    
    const timeout = setTimeout(() => {
      if (!isWebSocketConnected) {
        process.kill();
        reject(new Error(`Process timed out after ${timeoutMs}ms. Last output: ${output}\nError output: ${errorOutput}`));
      }
    }, timeoutMs);
    
    process.on('close', (code) => {
      clearTimeout(timeout);
      console.log(`Process exited with code ${code}`);
      
      if (!isWebSocketConnected) {
        reject(new Error(`Process exited with code ${code} before WebSocket connection was established. Error: ${errorOutput || 'No error output'}`));
      }
    });
    
    process.on('error', (err) => {
      clearTimeout(timeout);
      console.error('Process error:', err);
      reject(new Error(`Failed to start process: ${err.message}`));
    });
  });
};

// Verify connection endpoint
app.post('/verify', async (req, res) => {
  try {
    console.log('Received verify request:', req.body);
    const { config } = req.body;

    // Validate configuration
    validateMCPConfig(config);

    // For verification, we'll just try to start the first server
    const serverName = Object.keys(config.mcpServers)[0];
    const serverConfig = config.mcpServers[serverName];

    console.log(`Verifying server "${serverName}"...`);
    const result = await startMCPServer(serverConfig);
    
    res.json({
      status: 'success',
      message: 'Connection verified successfully',
      serverName,
      ...result
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      details: error.stack
    });
  }
});

// Run test endpoint
app.post('/test', async (req, res) => {
  try {
    console.log('Received test request:', req.body);
    const { config } = req.body;

    // Validate configuration
    validateMCPConfig(config);

    // For testing, we'll start all configured servers
    const results = {};
    for (const [serverName, serverConfig] of Object.entries(config.mcpServers)) {
      console.log(`Testing server "${serverName}"...`);
      try {
        const result = await startMCPServer(serverConfig);
        results[serverName] = {
          status: 'success',
          ...result
        };
      } catch (err) {
        console.error(`Error testing server "${serverName}":`, err);
        results[serverName] = {
          status: 'error',
          error: err.message,
          details: err.stack
        };
      }
    }

    res.json({
      status: 'success',
      message: 'Test completed',
      results
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      details: error.stack
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 