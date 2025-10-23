import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [view, setView] = useState('landing'); // 'landing', 'login', 'register'

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="text-gray-700 text-lg">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  if (view === 'login') {
    return (
      <Login
        onToggle={() => setView('register')}
        onBack={() => setView('landing')}
      />
    );
  }

  if (view === 'register') {
    return (
      <Register
        onToggle={() => setView('login')}
        onBack={() => setView('landing')}
      />
    );
  }

  return (
    <LandingPage
      onGetStarted={(isLogin) => setView(isLogin ? 'login' : 'register')}
    />
  );

}

function App() {

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App
