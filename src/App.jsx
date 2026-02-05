import { useState, useEffect } from 'react'
import './App.css'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'

function App() {
  const [currentPage, setCurrentPage] = useState('login')
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
      setCurrentPage('dashboard')
    }
  }, [])

  const handleLogin = (user) => {
    setCurrentUser(user)
    localStorage.setItem('currentUser', JSON.stringify(user))
    setCurrentPage('dashboard')
  }

  const handleSignup = (user) => {
    setCurrentUser(user)
    localStorage.setItem('currentUser', JSON.stringify(user))
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
    setCurrentPage('login')
  }

  return (
    <div className="app">
      {!currentUser ? (
        <>
          {currentPage === 'login' && (
            <Login 
              onLogin={handleLogin}
              onSwitchToSignup={() => setCurrentPage('signup')}
            />
          )}
          {currentPage === 'signup' && (
            <Signup 
              onSignup={handleSignup}
              onSwitchToLogin={() => setCurrentPage('login')}
            />
          )}
        </>
      ) : (
        <Dashboard 
          user={currentUser}
          setUser={setCurrentUser}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}

export default App
