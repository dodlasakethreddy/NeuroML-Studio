import React, { useState } from 'react';
import { Play, Sparkles, RotateCcw, AlertCircle } from 'lucide-react';
import Button from '../common/Button';

export const PredictionForm = ({
  model,
  dataset,
  onPredict,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  if (!model) return null;

  // Features list
  const features = model.features || [
    'Age',
    'Department',
    'MonthlyIncome',
    'OverTime',
    'TotalWorkingYears',
    'YearsAtCompany',
  ];

  // Pre-fill with sample values from dataset preview row or realistic defaults
  const handleFillSample = () => {
    const sample = {};
    const sampleRow = dataset?.previewRows?.[0] || {};

    features.forEach((feat) => {
      if (sampleRow[feat] !== undefined) {
        sample[feat] = sampleRow[feat];
      } else {
        // Fallback default
        if (feat.toLowerCase().includes('income')) sample[feat] = 5200;
        else if (feat.toLowerCase().includes('age')) sample[feat] = 38;
        else if (feat.toLowerCase().includes('time')) sample[feat] = 'No';
        else if (feat.toLowerCase().includes('score')) sample[feat] = 78;
        else if (feat.toLowerCase().includes('rate')) sample[feat] = 120;
        else sample[feat] = 5;
      }
    });

    setFormData(sample);
    setValidationErrors({});
  };

  const handleInputChange = (feat, val) => {
    setFormData((prev) => ({ ...prev, [feat]: val }));
    if (validationErrors[feat]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[feat];
        return copy;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    features.forEach((feat) => {
      const val = formData[feat];
      if (val === undefined || val === null || val === '') {
        errors[feat] = 'Required';
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    onPredict(formData);
  };

  const handleReset = () => {
    setFormData({});
    setValidationErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Top action helpers */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Enter feature values or load sample data:
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFillSample}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Fill with Sample Data</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-1 text-slate-400 hover:text-white"
            title="Clear Inputs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Dynamic Input Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[380px] overflow-y-auto pr-1">
        {features.map((feat) => {
          const hasError = !!validationErrors[feat];
          const isCategory =
            feat === 'Department' ||
            feat === 'OverTime' ||
            feat === 'BusinessTravel' ||
            feat === 'Gender' ||
            feat === 'JobRole';

          return (
            <div key={feat} className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>{feat}</span>
                {hasError && (
                  <span className="text-[10px] text-rose-400 font-bold">Required</span>
                )}
              </label>

              {isCategory ? (
                <select
                  value={formData[feat] || ''}
                  onChange={(e) => handleInputChange(feat, e.target.value)}
                  className={`neu-input py-1.5 text-xs ${hasError ? 'border-rose-500' : ''}`}
                >
                  <option value="">Select option</option>
                  {feat === 'OverTime' && (
                    <>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </>
                  )}
                  {feat === 'Department' && (
                    <>
                      <option value="Research & Development">Research & Development</option>
                      <option value="Sales">Sales</option>
                      <option value="Human Resources">Human Resources</option>
                    </>
                  )}
                  {feat === 'BusinessTravel' && (
                    <>
                      <option value="Travel_Rarely">Travel_Rarely</option>
                      <option value="Travel_Frequently">Travel_Frequently</option>
                      <option value="Non-Travel">Non-Travel</option>
                    </>
                  )}
                  {feat === 'Gender' && (
                    <>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </>
                  )}
                  {feat === 'JobRole' && (
                    <>
                      <option value="Research Scientist">Research Scientist</option>
                      <option value="Laboratory Technician">Laboratory Technician</option>
                      <option value="Sales Executive">Sales Executive</option>
                      <option value="Manufacturing Director">Manufacturing Director</option>
                    </>
                  )}
                </select>
              ) : (
                <input
                  type="number"
                  step="any"
                  value={formData[feat] !== undefined ? formData[feat] : ''}
                  onChange={(e) => handleInputChange(feat, e.target.value)}
                  placeholder={`e.g. ${feat.includes('Income') ? '5000' : '25'}`}
                  className={`neu-input py-1.5 text-xs font-mono ${hasError ? 'border-rose-500' : ''}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <div className="pt-3 border-t border-[#27334A] flex items-center justify-end gap-3">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          rightIcon={Play}
          className="w-full sm:w-auto px-6"
        >
          Generate Prediction
        </Button>
      </div>
    </form>
  );
};

export default PredictionForm;
