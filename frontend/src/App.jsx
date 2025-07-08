import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import { useDeepworkContext } from './hooks/useDeepworkContext'
import CircularProgress from '@mui/material/CircularProgress';

import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ProfileSettings from './pages/ProfileSettings';
import SessionHistory from './pages/SessionHistory';
import SessionDetails from './pages/SessionDetails';

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
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;