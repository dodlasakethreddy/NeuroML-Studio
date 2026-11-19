import { useDataset } from '../context/DatasetContext';

export const useModels = () => {
  const {
    models,
    selectedModel,
    selectedModelId,
    setSelectedModelId,
    trainingHistory,
    predictions,
    trainModels,
    deleteModel,
    makePrediction,
    isLoading,
  } = useDataset();

  return {
    models,
    selectedModel,
    selectedModelId,
    setSelectedModelId,
    trainingHistory,
    predictions,
    trainModels,
    deleteModel,
    makePrediction,
    isLoading,
  };
};

export default useModels;
