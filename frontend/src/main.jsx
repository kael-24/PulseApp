import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { AuthContextProvider } from './context/AuthContext';
import { StopwatchContextProvider } from './context/StopwachContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <AuthContextProvider>
      <StopwatchContextProvider>
        <App />
      </StopwatchContextProvider>
    </AuthContextProvider>
  // </React.StrictMode>
);
