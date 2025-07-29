import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { AuthContextProvider } from './context/AuthContext';
import { DeepworkContextProvider } from './context/DeepworkContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <AuthContextProvider>
      <DeepworkContextProvider>
          <App /> 
      </DeepworkContextProvider>
    </AuthContextProvider>
  // </React.StrictMode>
);
