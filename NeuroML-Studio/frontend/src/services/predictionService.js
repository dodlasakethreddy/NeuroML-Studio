import api from './api';

export const predictionService = {
  // Make a prediction with an existing trained model
  predict: async (modelOrId, inputs) => {
    const modelId = typeof modelOrId === 'object' && modelOrId !== null ? modelOrId.id : modelOrId;

    // Graceful simulation for sample/demo placeholder models
    if (String(modelId).startsWith('mod-')) {
      const isReg = typeof modelOrId === 'object' && modelOrId?.problemType === 'Regression';
      const predVal = isReg ? '42.8' : 'No (Stayed)';
      return {
        id: `sim-${Date.now()}`,
        model_id: modelId,
        prediction: predVal,
        predicted_result: predVal,
        confidence: 0.94,
        probabilities: isReg ? [] : [
          { label: 'No (Stayed)', value: 0.94 },
          { label: 'Yes (Left)', value: 0.06 },
        ],
        created_at: new Date().toISOString(),
        is_simulated: true,
      };
    }

    const res = await api.post(`/predictions/${modelId}`, {
      inputs,
    });

    const predResult = res.predicted_result !== undefined ? res.predicted_result : res.prediction;
    const confidenceVal = typeof res.prediction_probability === 'number'
      ? res.prediction_probability
      : Array.isArray(res.prediction_probability) && res.prediction_probability.length > 0
      ? res.prediction_probability[0].value
      : 0.95;

    return {
      ...res,
      prediction: String(predResult),
      predicted_result: predResult,
      confidence: confidenceVal,
      probabilities: Array.isArray(res.prediction_probability) ? res.prediction_probability : [],
    };
  },

  // Get previous predictions history
  getPredictionHistory: async () => {
    return await api.get('/predictions/history');
  },
};

export default predictionService;
