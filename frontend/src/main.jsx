import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { AuthContextProvider } from './context/AuthContext';
import { DeepworkContextProvider } from './context/DeepworkContext';
import { AlarmContextProvider } from './context/AlarmContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <AuthContextProvider>
      <DeepworkContextProvider>
        <AlarmContextProvider>
          <App /> 
        </AlarmContextProvider>
      </DeepworkContextProvider>
    </AuthContextProvider>
  // </React.StrictMode>
);
