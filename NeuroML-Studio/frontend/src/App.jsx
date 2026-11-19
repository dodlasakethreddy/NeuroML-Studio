import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DatasetProvider } from './context/DatasetContext';
import AppRoutes from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <DatasetProvider>
          <AppRoutes />
        </DatasetProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
