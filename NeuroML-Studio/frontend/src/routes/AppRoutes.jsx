import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Pages
import Dashboard from '../pages/Dashboard';
import Datasets from '../pages/Datasets';
import UploadDataset from '../pages/UploadDataset';
import DataExplorer from '../pages/DataExplorer';
import Preprocessing from '../pages/Preprocessing';
import ModelTraining from '../pages/ModelTraining';
import ModelComparison from '../pages/ModelComparison';
import Predictions from '../pages/Predictions';
import SavedModels from '../pages/SavedModels';
import TrainingHistory from '../pages/TrainingHistory';
import Settings from '../pages/Settings';
import Login from '../pages/Login';
import Register from '../pages/Register';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Dashboard Layout Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="datasets" element={<Datasets />} />
        <Route path="upload-dataset" element={<UploadDataset />} />
        <Route path="data-explorer" element={<DataExplorer />} />
        <Route path="preprocessing" element={<Preprocessing />} />
        <Route path="model-training" element={<ModelTraining />} />
        <Route path="model-comparison" element={<ModelComparison />} />
        <Route path="predictions" element={<Predictions />} />
        <Route path="saved-models" element={<SavedModels />} />
        <Route path="training-history" element={<TrainingHistory />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
