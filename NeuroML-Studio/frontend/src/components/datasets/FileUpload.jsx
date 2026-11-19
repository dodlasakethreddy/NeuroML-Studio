import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { validateCSVFile, parseCSVPreview } from '../../utils/validators';
import Button from '../common/Button';

export const FileUpload = ({ onDatasetParsed, onSelectSample }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setErrorMessage(null);
    const validation = validateCSVFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error);
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);
    setUploadProgress(10);

    // Simulate progress animation and read file
    const reader = new FileReader();

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 25;
      });
    }, 150);

    reader.onload = (event) => {
      clearInterval(progressInterval);
      setUploadProgress(100);

      const content = event.target.result;
      const parsed = parseCSVPreview(content, 10);

      setTimeout(() => {
        setIsProcessing(false);
        if (parsed.success) {
          if (onDatasetParsed) {
            onDatasetParsed({
              file,
              name: file.name,
              fileSize: `${(file.size / 1024).toFixed(1)} KB`,
              totalRows: parsed.totalRows,
              totalColumns: parsed.totalColumns,
              columnsList: parsed.columnsList,
              previewRows: parsed.previewRows,
              missingValues: parsed.columnsList.reduce((acc, c) => acc + c.missing, 0),
              duplicates: 0,
            });
          }
        } else {
          setErrorMessage(parsed.error);
        }
      }, 300);
    };

    reader.onerror = () => {
      clearInterval(progressInterval);
      setIsProcessing(false);
      setErrorMessage('Failed to read file from disk.');
    };

    reader.readAsText(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-purple-500 bg-purple-500/10 scale-[1.01]'
            : selectedFile
            ? 'border-emerald-500/40 bg-emerald-500/5'
            : 'border-[#27334A] hover:border-purple-500/50 bg-[#151E32]/50 hover:bg-[#151E32]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileInput}
          className="hidden"
        />

        {!selectedFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-600/20 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-bold text-white">
                Drag and drop your CSV dataset here
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports UTF-8 CSV files up to 50 MB
              </p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Browse Files
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-lg flex flex-col gap-4">
            <div className="flex items-center justify-between p-3.5 bg-[#10172A] rounded-xl border border-[#27334A]">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-8 h-8 text-emerald-400 shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-bold text-white truncate max-w-[240px]">
                    {selectedFile.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Remove file"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            {isProcessing && (
              <div className="w-full flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Validating schema and parsing rows...</span>
                  <span className="font-semibold text-purple-400">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#10172A] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Quick Sample Selector */}
      <div className="bg-[#151E32] border border-[#27334A] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Or Load a Pre-configured Realistic Sample Dataset
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {[
            { name: 'Employee Attrition', rows: '1,470 rows', type: 'Classification', target: 'Attrition' },
            { name: 'Student Performance', rows: '1,000 rows', type: 'Classification', target: 'Grade' },
            { name: 'Heart Disease Risk', rows: '303 rows', type: 'Classification', target: 'Outcome' },
            { name: 'California Housing', rows: '20,640 rows', type: 'Regression', target: 'MedHouseVal' },
          ].map((sample) => (
            <button
              key={sample.name}
              type="button"
              onClick={() => onSelectSample && onSelectSample(sample.name)}
              className="p-3 rounded-lg bg-[#10172A] hover:bg-purple-950/30 border border-[#27334A] hover:border-purple-500/40 text-left transition-all duration-150 group"
            >
              <div className="font-semibold text-xs text-white group-hover:text-purple-300 flex items-center justify-between">
                <span>{sample.name}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" />
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {sample.rows} • <span className="text-purple-400">{sample.type}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
