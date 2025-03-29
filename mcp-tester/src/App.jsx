import { useState } from 'react'
import axios from 'axios'

function App() {
  const [mcpConfig, setMcpConfig] = useState('')
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleVerifyConnection = async () => {
    try {
      setStatus('loading')
      setError(null)
      setResult(null)
      
      let config
      try {
        config = JSON.parse(mcpConfig)
      } catch (err) {
        throw new Error('Invalid JSON configuration. Please check your JSON format.')
      }

      console.log('Sending verify request with config:', config)
      const response = await axios.post('http://localhost:8000/verify', {
        config
      })
      console.log('Verify response:', response.data)
      
      setResult(response.data)
      setStatus('success')
    } catch (err) {
      console.error('Verification error:', err)
      setError(err.response?.data?.message || err.message || 'Failed to verify connection')
      setStatus('error')
    }
  }

  const handleRunTest = async () => {
    try {
      setStatus('loading')
      setError(null)
      setResult(null)
      
      let config
      try {
        config = JSON.parse(mcpConfig)
      } catch (err) {
        throw new Error('Invalid JSON configuration. Please check your JSON format.')
      }

      console.log('Sending test request with config:', config)
      const response = await axios.post('http://localhost:8000/test', {
        config
      })
      console.log('Test response:', response.data)
      
      setResult(response.data)
      setStatus('success')
    } catch (err) {
      console.error('Test error:', err)
      setError(err.response?.data?.message || err.message || 'Failed to run test')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold text-center mb-8">MCP Server Tester</h1>
                
                <div className="mb-6">
                  <label htmlFor="mcpConfig" className="block text-sm font-medium text-gray-700">
                    MCP Configuration (JSON)
                  </label>
                  <textarea
                    id="mcpConfig"
                    value={mcpConfig}
                    onChange={(e) => setMcpConfig(e.target.value)}
                    className="mt-1 block w-full h-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono p-2"
                    placeholder='{"mcpServers": {"server-name": {"command": "cmd", "args": [...]}}}'
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Paste your MCP server configuration in JSON format
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleVerifyConnection}
                    disabled={status === 'loading' || !mcpConfig.trim()}
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'Verifying...' : 'Verify Connection'}
                  </button>
                  <button
                    onClick={handleRunTest}
                    disabled={status === 'loading' || !mcpConfig.trim()}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'Testing...' : 'Run Test'}
                  </button>
                </div>

                {status === 'loading' && (
                  <div className="mt-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Processing request...</p>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                    <p className="font-medium">Error:</p>
                    <p className="mt-1">{error}</p>
                  </div>
                )}

                {result && status === 'success' && (
                  <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
                    <p className="font-medium">Result:</p>
                    <pre className="mt-2 whitespace-pre-wrap overflow-auto max-h-96 text-sm">{JSON.stringify(result, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
