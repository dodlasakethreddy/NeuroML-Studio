import api from './api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const normalizeModel = (m) => {
  if (!m) return null;
  const metrics = m.metrics || {};
  return {
    ...m,
    id: m.id,
    name: m.model_name || m.name || m.algorithm,
    modelName: m.model_name || m.name || m.algorithm,
    model_name: m.model_name || m.name || m.algorithm,
    algorithm: m.algorithm,
    problemType: m.problem_type || m.problemType || 'Classification',
    problem_type: m.problem_type || m.problemType || 'Classification',
    target: m.target_column || m.target,
    target_column: m.target_column || m.target,
    features: m.feature_columns || m.features || [],
    feature_columns: m.feature_columns || m.features || [],
    datasetId: m.dataset_id || m.datasetId,
    dataset_id: m.dataset_id || m.datasetId,
    datasetName: m.dataset_name || m.datasetName || 'Dataset',
    metrics: metrics,
    accuracy: metrics.accuracy ?? m.accuracy,
    precision: metrics.precision ?? m.precision,
    recall: metrics.recall ?? m.recall,
    f1Score: metrics.f1_score ?? metrics.f1Score ?? m.f1Score,
    r2Score: metrics.r2_score ?? metrics.r2Score ?? m.r2Score,
    mae: metrics.mae ?? m.mae,
    mse: metrics.mse ?? m.mse,
    rmse: metrics.rmse ?? m.rmse,
    confusionMatrix: metrics.confusion_matrix ?? m.confusion_matrix,
    createdDate: m.created_at || m.createdDate || new Date().toISOString(),
    duration: m.duration || metrics.training_duration || '1.2s',
    isBest: m.is_best ?? m.isBest ?? false,
  };
};

export const modelService = {
  // Start training job (asynchronous background execution)
  startTraining: async ({
    datasetId,
    problemType,
    targetColumn,
    selectedFeatures,
    algorithms,
    testSize = 0.2,
    randomState = 42,
    hyperparameters = {},
  }) => {
    return await api.post('/training/start', {
      dataset_id: datasetId,
      problem_type: problemType,
      target_column: targetColumn,
      selected_features: selectedFeatures,
      algorithms,
      test_size: testSize,
      random_state: randomState,
      hyperparameters,
    });
  },

  // Poll status of training job
  getJobStatus: async (jobId) => {
    return await api.get(`/training/${jobId}`);
  },

  // High-level automated training orchestration with status polling
  trainModels: async (config, onProgress) => {
    const datasetId = config.dataset?.id || config.datasetId;
    const problemType = config.problemType || config.problem_type;
    const targetColumn = config.target || config.targetColumn || config.target_column;
    const selectedFeatures = config.features || config.selectedFeatures || config.selected_features;
    const rawAlgorithms = config.algorithms || [];
    const algorithms = rawAlgorithms.map((a) => (typeof a === 'string' ? a : (a.id || a.name)));
    const hyperparameters = config.hyperparameters || {};

    if (onProgress) {
      onProgress({ percent: 10, stage: 'Queuing job...', log: `Dispatched ${algorithms.length} algorithm pipelines to background queue...` });
    }

    const startRes = await api.post('/training/start', {
      dataset_id: datasetId,
      problem_type: problemType,
      target_column: targetColumn,
      selected_features: selectedFeatures,
      algorithms,
      test_size: 0.2,
      random_state: 42,
      hyperparameters,
    });

    const jobId = startRes.job_id || startRes.id;
    if (!jobId) {
      throw new Error('Training job initialization failed.');
    }

    // Polling loop
    let attempts = 0;
    const maxAttempts = 120;
    let jobDetails = null;

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      attempts++;

      jobDetails = await api.get(`/training/${jobId}`);
      const status = (jobDetails.status || '').toLowerCase();

      if (onProgress) {
        const pct = Math.min(20 + attempts * 9, 94);
        onProgress({
          percent: pct,
          stage: `Training ${algorithms.length} models (${jobDetails.status})...`,
          log: `[${new Date().toLocaleTimeString()}] Pipeline state: ${jobDetails.status}...`,
        });
      }

      if (status === 'completed') {
        if (onProgress) {
          onProgress({ percent: 100, stage: 'Completed', log: 'All models trained and evaluated successfully!' });
        }
        break;
      }

      if (status === 'failed') {
        throw new Error(jobDetails.error_message || 'Training job encountered an execution error.');
      }
    }

    // Retrieve models for this completed job or user models
    const allModels = await api.get('/models/');
    const jobModels = (jobDetails?.models && jobDetails.models.length > 0)
      ? jobDetails.models.map(normalizeModel)
      : (Array.isArray(allModels) ? allModels.map(normalizeModel) : []);

    return jobModels;
  },

  // Get training runs history
  getTrainingHistory: async () => {
    return await api.get('/training/history');
  },

  // Get model comparison for a job
  compareModels: async (trainingJobId) => {
    return await api.get(`/models/compare/${trainingJobId}`);
  },

  // Get all saved models
  getAllModels: async () => {
    const res = await api.get('/models/');
    return Array.isArray(res) ? res.map(normalizeModel) : [];
  },

  // Alias for backward compatibility
  getModels: async () => {
    const res = await api.get('/models/');
    return Array.isArray(res) ? res.map(normalizeModel) : [];
  },

  // Get single model details
  getModelById: async (modelId) => {
    const res = await api.get(`/models/${modelId}`);
    return normalizeModel(res);
  },

  // Delete a saved model
  deleteModel: async (modelId) => {
    return await api.delete(`/models/${modelId}`);
  },

  // Get direct download URL for model artifact
  getModelDownloadUrl: (modelId) => {
    return `${API_BASE_URL}/api/models/${modelId}/download`;
  },
};

export default modelService;
