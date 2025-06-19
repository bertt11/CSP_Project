import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { AuthProvider } from './context/AuthContext';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

function App() {
  return (
     <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;

