import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle2, FileText, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import PageHeader from '../components/layout/PageHeader';
import FileUpload from '../components/datasets/FileUpload';
import DatasetPreview from '../components/datasets/DatasetPreview';
import Button from '../components/common/Button';
import { SAMPLE_DATASETS } from '../utils/constants';

export const UploadDataset = () => {
  const navigate = useNavigate();
  const { addDataset, setSelectedDatasetId } = useDataset();
  const [parsedDataset, setParsedDataset] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleDatasetParsed = async (datasetInfo) => {
    try {
      const saved = await addDataset({
        ...datasetInfo,
        type: datasetInfo.name.toLowerCase().includes('housing') ? 'Regression' : 'Classification',
      });
      setParsedDataset(saved);
      setIsSaved(true);
      setSelectedDatasetId(saved.id);
    } catch (err) {
      console.error('Failed to add dataset:', err);
    }
  };

  const handleSelectSample = (sampleName) => {
    const found = SAMPLE_DATASETS.find((s) => s.name.includes(sampleName)) || SAMPLE_DATASETS[0];
    setParsedDataset(found);
    setIsSaved(true);
    setSelectedDatasetId(found.id);
  };

  const handleContinueToExplorer = () => {
    if (parsedDataset) {
      setSelectedDatasetId(parsedDataset.id);
      navigate('/data-explorer');
    }
  };

  const handleContinueToPreprocessing = () => {
    if (parsedDataset) {
      setSelectedDatasetId(parsedDataset.id);
      navigate('/preprocessing');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Upload CSV Dataset"
        subtitle="Upload a raw or processed CSV dataset to begin data profiling, feature engineering, and model training."
        actions={
          <Button
            variant="secondary"
            size="sm"
            leftIcon={ArrowLeft}
            onClick={() => navigate('/datasets')}
          >
            Back to Datasets
          </Button>
        }
      />

      {/* Main Upload Zone */}
      {!parsedDataset ? (
        <FileUpload
          onDatasetParsed={handleDatasetParsed}
          onSelectSample={handleSelectSample}
        />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Upload Success Banner */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">
                  Dataset "{parsedDataset.name}" Ready
                </h4>
                <p className="text-xs text-slate-300">
                  {parsedDataset.rows?.toLocaleString()} rows and {parsedDataset.columns} columns successfully indexed.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setParsedDataset(null);
                setIsSaved(false);
              }}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Upload another file
            </button>
          </div>

          {/* Dataset Preview Component */}
          <DatasetPreview
            dataset={parsedDataset}
            onContinueToExplorer={handleContinueToExplorer}
            onContinueToPreprocessing={handleContinueToPreprocessing}
          />
        </div>
      )}
    </div>
  );
};

export default UploadDataset;
