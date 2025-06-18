import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { useAuthContext } from './hooks/useAuthContext';

import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import UserAccount from './pages/UserAccount';

function App() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return null;
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
          path="/account"
          element={user ? <UserAccount /> : <Navigate to='/login' />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;