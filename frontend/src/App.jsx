import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/contextHook/useAuthContext';
import { useDeepworkContext } from './hooks/contextHook/useDeepworkContext'
import CircularProgress from '@mui/material/CircularProgress';

import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ProfileSettings from './pages/ProfileSettings';
import SessionHistory from './pages/SessionHistory';
import SessionDetails from './pages/SessionDetails';

import { AuthContextProvider } from './context/AuthContext';
import { DeepworkContextProvider } from './context/DeepworkContext';
import Navbar from './components/Navbar';

function App() {
  const { user, userLoading } = useAuthContext();
  const { deepworkSession, deepworkLoading } = useDeepworkContext();

  if (userLoading || deepworkLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <CircularProgress color="primary" />
      </div>
    );
  }

  return (
    <div className='App'>
      <AuthContextProvider>
        <DeepworkContextProvider>
            <BrowserRouter>
              <Navbar />
              <div className='pages'>
                <Routes>
                  <Route 
                    path="/"
                    element={user ? <Home /> : <Navigate to='/login' />}
                  />
                  <Route 
                    path="/signup"
                    element={!user ? <Signup /> : <Navigate to='/' />}
                  />
                  <Route 
                    path="/login"
                    element={!user ? <Login /> : <Navigate to='/' />}
                  />
                  <Route 
                    path="/edit-profile"
                    element={user ? <ProfileSettings /> : <Navigate to='/login' />}
                  />
                  <Route
                    path="/session-history"
                    element={user ? <SessionHistory /> : <Navigate to='/login' />}
                  />
                  <Route
                    path="/session-details"
                    element={user && deepworkSession && deepworkSession.deepwork && deepworkSession.deepwork.length ? <SessionDetails /> : <Navigate to='/' />}
                  />
                </Routes>
              </div>
            </BrowserRouter>
        </DeepworkContextProvider>
      </AuthContextProvider>
    </div>
  )
}

export default App