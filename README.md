# MCP Server Tester

A modern web application for testing and verifying MCP server connections.

![MCP Server Tester](https://via.placeholder.com/800x400?text=MCP+Server+Tester)

## Features

- Test connectivity to MCP servers
- Verify server functionality
- Beautiful UI with dark and light mode
- Interactive JSON configuration

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/mcp-tester.git
cd mcp-tester
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## How to Use

1. **Enter MCP Server Configuration**:
   - In the main text area, enter your MCP server configuration in JSON format
   - Example format:
   ```json
   {
     "mcpServers": {
       "server-name": {
         "command": "cmd",
         "args": ["arg1", "arg2"]
       }
     }
   }
   ```

2. **Verify Connection**:
   - Click the "Verify Connection" button to check connectivity to the configured server(s)
   - Results will be displayed below the buttons

3. **Run Test**:
   - Click the "Run Test" button to perform a full functionality test
   - Test results will be displayed in the results area

4. **Toggle Dark/Light Mode**:
   - Use the sun/moon toggle in the top-right corner to switch between dark and light mode
   - Your preference will be saved for future visits

## API Routes

The application connects to a local backend server running on port 8000:

- `/verify` - POST endpoint for verifying server connectivity
- `/test` - POST endpoint for running functionality tests

## Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory and can be served using any static file server.

## License

MIT

## Acknowledgements

- Built with React and Vite
- Styled with Tailwind CSS
