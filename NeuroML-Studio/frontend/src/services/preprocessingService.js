import api from './api';

export const preprocessingService = {
  // Apply preprocessing configuration to a dataset
  applyPreprocessing: async (firstArg, secondArg) => {
    // Support both signatures: (datasetId, config) and (config, dataset)
    let datasetId;
    let config;

    if (typeof firstArg === 'string') {
      datasetId = firstArg;
      config = secondArg || {};
    } else if (typeof firstArg === 'object' && firstArg.id) {
      datasetId = firstArg.id;
      config = secondArg || {};
    } else {
      config = firstArg || {};
      datasetId = secondArg?.id || secondArg;
    }

    if (!datasetId) {
      throw new Error('Dataset ID is required to apply preprocessing.');
    }

    return await api.post(`/preprocessing/${datasetId}`, {
      target_column: config.target_column || config.target,
      missing_values: config.missing_values || config.missingValues || 'median',
      remove_duplicates: config.remove_duplicates !== undefined ? config.remove_duplicates : (config.removeDuplicates !== undefined ? config.removeDuplicates : true),
      encoding: config.encoding || 'one_hot',
      scaling: config.scaling || 'standard',
      train_test_split: config.train_test_split || (config.trainSplit ? (100 - config.trainSplit) / 100 : 0.2),
      selected_features: config.selected_features || config.selectedFeatures || null,
    });
  },
};

export default preprocessingService;
