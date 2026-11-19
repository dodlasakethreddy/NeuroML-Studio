import { useDataset } from '../context/DatasetContext';

export const useDatasets = () => {
  const {
    datasets,
    selectedDataset,
    selectedDatasetId,
    setSelectedDatasetId,
    addDataset,
    deleteDataset,
    isLoading,
  } = useDataset();

  return {
    datasets,
    selectedDataset,
    selectedDatasetId,
    setSelectedDatasetId,
    addDataset,
    deleteDataset,
    isLoading,
  };
};

export default useDatasets;
