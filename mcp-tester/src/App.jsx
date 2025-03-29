import { useState, useEffect } from 'react'
import axios from 'axios'
import { DarkModeSwitch } from 'react-toggle-dark-mode'

function App() {
  const [mcpConfig, setMcpConfig] = useState('')
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode')
    return savedMode ? JSON.parse(savedMode) : true
  })

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

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
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 
      'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800' : 
      'bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100'}`}>
      
      {/* Theme toggle button */}
      <div className="absolute top-4 right-4 z-10">
        <DarkModeSwitch
          checked={isDarkMode}
          onChange={toggleDarkMode}
          size={28}
          sunColor="#f59e0b"
          moonColor="#f3f4f6"
          className="hover-lift animate-glow"
        />
      </div>
      
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <div className={`w-full max-w-3xl ${isDarkMode ? 
          'glass-dark shadow-2xl shadow-purple-900/20' : 
          'glass-light shadow-xl shadow-indigo-200/50'} 
          rounded-xl overflow-hidden transition-all duration-300`}>
          
          {/* Card Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-20">
              <div className="shimmer h-full w-full"></div>
            </div>
            <div className="px-6 py-10 text-center relative z-10">
              <div className="w-16 h-16 mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-pink-500 to-blue-500 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                  className={`w-full h-full ${isDarkMode ? 'text-white' : 'text-white'}`}
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"></path>
                  <path d="M8 13V7m4 6V7m4 6V7"></path>
                </svg>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-2">
                <span className={`${isDarkMode ? 
                  'bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-500' : 
                  'bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600'}`}>
                  MCP Server Tester
                </span>
              </h1>
              <p className={`mt-2 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Verify connectivity and test functionality of your MCP servers
              </p>
            </div>
          </div>
          
          {/* Card Body */}
          <div className="px-6 py-6 sm:px-10">
            <div className="space-y-6">
              <div className={`px-4 py-5 sm:p-6 rounded-lg ${isDarkMode ? 
                'bg-black/20 border border-white/10' : 
                'bg-white/80 border border-gray-200'} shadow-inner`}>
                <label htmlFor="mcpConfig" className={`block text-sm font-medium ${isDarkMode ? 
                  'text-gray-200' : 'text-gray-700'} mb-2 text-center`}>
                  MCP Configuration (JSON)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <textarea
                    id="mcpConfig"
                    value={mcpConfig}
                    onChange={(e) => setMcpConfig(e.target.value)}
                    rows="8"
                    className={`block w-full rounded-md text-center ${isDarkMode ? 
                      'bg-black/30 border-gray-700 text-gray-100 focus:ring-pink-500 focus:border-pink-500' : 
                      'bg-white border-gray-300 text-gray-800 focus:ring-indigo-500 focus:border-indigo-500'} 
                      shadow-sm sm:text-sm font-mono p-4 resize-none custom-scrollbar transition-colors duration-300`}
                    placeholder='{"mcpServers": {"server-name": {"command": "cmd", "args": [...]}}}'
                  />
                </div>
                <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>
                  Paste your MCP server configuration in JSON format
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 justify-center">
                <button
                  onClick={handleVerifyConnection}
                  disabled={status === 'loading' || !mcpConfig.trim()}
                  className={`${isDarkMode ? 
                    'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 border-blue-700/50' : 
                    'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 border-blue-500/50'} 
                    flex-1 px-4 py-3 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500 
                    disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium border hover-lift
                    max-w-[180px] mx-auto`}
                >
                  {status === 'loading' ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : 'Verify Connection'}
                </button>
                <button
                  onClick={handleRunTest}
                  disabled={status === 'loading' || !mcpConfig.trim()}
                  className={`${isDarkMode ? 
                    'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700 border-pink-700/50' : 
                    'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 border-pink-500/50'} 
                    flex-1 px-4 py-3 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-pink-500 
                    disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium border hover-lift
                    max-w-[180px] mx-auto`}
                >
                  {status === 'loading' ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Testing...
                    </span>
                  ) : 'Run Test'}
                </button>
              </div>

              {status === 'loading' && (
                <div className={`mt-4 text-center p-6 rounded-lg ${isDarkMode ? 
                  'bg-black/20 border border-white/10' : 
                  'bg-white/80 border border-gray-200'}`}>
                  <div className="flex justify-center">
                    <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDarkMode ? 
                      'border-pink-500' : 'border-indigo-600'}`}></div>
                  </div>
                  <p className={`mt-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Processing your request...
                  </p>
                </div>
              )}

              {error && (
                <div className={`rounded-md p-4 ${isDarkMode ? 
                  'bg-red-900/30 border border-red-500/30' : 
                  'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center justify-center">
                    <div className="flex-shrink-0 mr-3">
                      <svg className={`h-5 w-5 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} 
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1 text-center">
                      <h3 className={`text-sm font-medium ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>Error</h3>
                      <div className={`mt-2 text-sm ${isDarkMode ? 'text-red-200' : 'text-red-700'}`}>
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {result && status === 'success' && (
                <div className={`rounded-md p-4 ${isDarkMode ? 
                  'bg-green-900/30 border border-green-500/30' : 
                  'bg-green-50 border border-green-200'}`}>
                  <div className="flex items-center justify-center">
                    <div className="flex-shrink-0 mr-3">
                      <svg className={`h-5 w-5 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} 
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1 text-center">
                      <h3 className={`text-sm font-medium ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>Success</h3>
                    </div>
                  </div>
                  <div className={`mt-4 text-sm ${isDarkMode ? 'text-green-200' : 'text-green-700'} overflow-auto text-center`}>
                    <pre className={`whitespace-pre-wrap ${isDarkMode ? 
                      'bg-black/20 border border-white/10' : 
                      'bg-white/90 border border-gray-200'} p-3 rounded-md shadow-inner overflow-auto max-h-96 text-xs sm:text-sm custom-scrollbar mx-auto`}>
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Card Footer */}
          <div className={`px-6 py-4 sm:px-10 border-t ${isDarkMode ? 
            'bg-black/30 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
            <p className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              MCP Server Tester &copy; {new Date().getFullYear()} | All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
