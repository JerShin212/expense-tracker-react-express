import { useState, useEffect } from 'react'
import { testApi } from './services/api'

function App() {

  const [apiStatus, setApiStatus] = useState({
    loading: true,
    success: false,
    message: '',
    error: null
  });

  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const data = await testApi();
        setApiStatus({
          loading: false,
          success: true,
          message: data.message || 'API is reachable',
          error: null
        });
      } catch (error) {
        setApiStatus({
          loading: false,
          success: false,
          message: 'Failed to connect to API',
          error: error.message || 'Unknown error'
        });
      }
    };
    checkApiConnection();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            Expense Tracker
          </h1>
          <h2 className="text-xl text-white/90">
            Phase 1: Project Setup
          </h2>
        </div>

        {/* API Status Card */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Backend API Connection Test
          </h3>

          {apiStatus.loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="ml-4 text-gray-600 text-lg">Testing connection...</p>
            </div>
          )}

          {!apiStatus.loading && apiStatus.success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start">
                <div className="shrink-0">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-lg font-medium text-green-800">
                    {apiStatus.message}
                  </p>
                  <p className="mt-2 text-sm text-green-700">
                    Backend is running successfully!
                  </p>
                </div>
              </div>
            </div>
          )}

          {!apiStatus.loading && !apiStatus.success && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start">
                <div className="shrink-0">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-lg font-medium text-red-800">
                    Connection Failed
                  </p>
                  <p className="mt-2 text-sm text-red-700">
                    {apiStatus.error}
                  </p>
                  <p className="mt-2 text-xs text-red-600">
                    Make sure your backend server is running on port 5000
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Checklist Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">✅</span>
            Phase 1 Checklist
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start text-gray-700">
              <span className="text-green-500 mr-3 text-xl">✅</span>
              <span className="text-base">Backend Express server initialized</span>
            </li>
            <li className="flex items-start text-gray-700">
              <span className="text-green-500 mr-3 text-xl">✅</span>
              <span className="text-base">PostgreSQL database configured</span>
            </li>
            <li className="flex items-start text-gray-700">
              <span className="text-green-500 mr-3 text-xl">✅</span>
              <span className="text-base">Frontend React app created</span>
            </li>
            <li className="flex items-start text-gray-700">
              <span className="text-green-500 mr-3 text-xl">✅</span>
              <span className="text-base">Project folder structure set up</span>
            </li>
            <li className="flex items-start text-gray-700">
              <span className="text-green-500 mr-3 text-xl">✅</span>
              <span className="text-base">Dependencies installed</span>
            </li>
            <li className="flex items-start text-gray-700">
              <span className="text-green-500 mr-3 text-xl">✅</span>
              <span className="text-base">Environment variables configured</span>
            </li>
            <li className="flex items-start text-gray-700">
              <span className={`mr-3 text-xl ${apiStatus.success ? 'text-green-500' : 'text-gray-400'}`}>
                {apiStatus.success ? '✅' : '⏳'}
              </span>
              <span className="text-base">API connection verified</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
