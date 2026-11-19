// NeuroML Studio Validation and CSV Parsing Helpers

export const validateCSVFile = (file) => {
  if (!file) {
    return { valid: false, error: 'Please select a file to upload.' };
  }

  const name = file.name || '';
  const isCSV = name.toLowerCase().endsWith('.csv') || file.type === 'text/csv' || file.type === 'application/vnd.ms-excel';
  if (!isCSV) {
    return { valid: false, error: 'Invalid file format. Only .csv files are supported.' };
  }

  // Max 50MB
  const maxSizeBytes = 50 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { valid: false, error: 'File size exceeds maximum allowed limit (50 MB).' };
  }

  return { valid: true, error: null };
};

export const parseCSVPreview = (csvText, maxRows = 10) => {
  try {
    const lines = csvText.trim().split(/\r\n|\n/);
    if (lines.length < 2) {
      return { success: false, error: 'CSV file must have at least a header row and one data row.' };
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    const previewRows = [];
    const totalLines = lines.length - 1;

    for (let i = 1; i <= Math.min(totalLines, maxRows); i++) {
      if (!lines[i].trim()) continue;
      const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
      const row = {};
      headers.forEach((header, idx) => {
        let val = values[idx] !== undefined ? values[idx] : '';
        // Try parsing number
        if (val !== '' && !isNaN(val)) {
          val = Number(val);
        }
        row[header] = val;
      });
      previewRows.push(row);
    }

    // Infer column types and missing values
    const columnsList = headers.map(header => {
      let isNumeric = true;
      let missingCount = 0;
      const uniqueVals = new Set();

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const vals = lines[i].split(',');
        const val = vals[headers.indexOf(header)]?.trim();
        if (val === undefined || val === '' || val.toLowerCase() === 'nan' || val.toLowerCase() === 'null') {
          missingCount++;
        } else {
          uniqueVals.add(val);
          if (isNaN(val)) {
            isNumeric = false;
          }
        }
      }

      return {
        name: header,
        type: isNumeric ? 'Numeric' : 'Categorical',
        missing: missingCount,
        unique: uniqueVals.size,
      };
    });

    return {
      success: true,
      headers,
      previewRows,
      totalRows: totalLines,
      totalColumns: headers.length,
      columnsList,
    };
  } catch (err) {
    return { success: false, error: 'Failed to parse CSV file: ' + err.message };
  }
};

export const validatePredictionInputs = (inputs, featuresList) => {
  const errors = {};
  for (const feat of featuresList) {
    const val = inputs[feat.name];
    if (val === undefined || val === null || val === '') {
      errors[feat.name] = `${feat.name} is required`;
    } else if (feat.type === 'Integer' || feat.type === 'Float' || feat.type === 'Numeric') {
      if (isNaN(Number(val))) {
        errors[feat.name] = `${feat.name} must be a valid number`;
      }
    }
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
