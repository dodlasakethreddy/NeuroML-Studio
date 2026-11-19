import api from './api';

export const normalizeDataset = (d) => {
  if (!d) return null;
  const cols = d.columns_metadata || d.column_metadata || d.columnsList || [];
  return {
    ...d,
    id: d.id,
    name: d.dataset_name || d.name || 'Dataset.csv',
    dataset_name: d.dataset_name || d.name || 'Dataset.csv',
    rows: d.total_rows ?? d.rows ?? 0,
    total_rows: d.total_rows ?? d.rows ?? 0,
    columns: d.total_columns ?? d.columns ?? cols.length,
    total_columns: d.total_columns ?? d.columns ?? cols.length,
    columns_metadata: cols,
    column_metadata: cols,
    columnsList: cols,
    type: d.type || ((d.dataset_name || d.name || '').toLowerCase().includes('housing') ? 'Regression' : 'Classification'),
    uploadDate: d.uploaded_at || d.uploadDate || new Date().toISOString(),
    uploaded_at: d.uploaded_at || d.uploadDate || new Date().toISOString(),
    status: 'Ready',
    previewRows: d.preview_rows || d.previewRows || [],
  };
};

export const datasetService = {
  // Upload CSV file with optional progress tracking
  uploadDataset: async (fileOrData, onUploadProgress) => {
    const file = fileOrData instanceof File ? fileOrData : fileOrData?.file;
    if (!file) {
      throw new Error('No valid CSV file found to upload.');
    }

    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post('/datasets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      },
    });
    return normalizeDataset(res);
  },

  // Get all datasets for current user
  getAllDatasets: async () => {
    const res = await api.get('/datasets/');
    return Array.isArray(res) ? res.map(normalizeDataset) : [];
  },

  // Get single dataset by ID
  getDatasetById: async (datasetId) => {
    const res = await api.get(`/datasets/${datasetId}`);
    return normalizeDataset(res);
  },

  // Get preview rows (first 10-20 rows)
  getDatasetPreview: async (datasetId, limit = 20) => {
    return await api.get(`/datasets/${datasetId}/preview?limit=${limit}`);
  },

  // Get comprehensive dataset statistics
  getDatasetStatistics: async (datasetId) => {
    return await api.get(`/datasets/${datasetId}/statistics`);
  },

  // Get correlation matrix for numerical features
  getDatasetCorrelation: async (datasetId) => {
    return await api.get(`/datasets/${datasetId}/correlation`);
  },

  // Get distribution for a specific column
  getDatasetDistribution: async (datasetId, column) => {
    return await api.get(`/datasets/${datasetId}/distribution?column=${encodeURIComponent(column)}`);
  },

  // Get single column statistics
  getColumnStatistics: async (datasetId, column) => {
    return await api.get(`/datasets/${datasetId}/column-statistics?column=${encodeURIComponent(column)}`);
  },

  // Delete a dataset
  deleteDataset: async (datasetId) => {
    return await api.delete(`/datasets/${datasetId}`);
  },
};

export default datasetService;
