// NeuroML Studio - Constants & Sample Data

export const PROBLEM_TYPES = {
  CLASSIFICATION: 'Classification',
  REGRESSION: 'Regression',
};

export const ALGORITHMS = {
  classification: [
    {
      id: 'random_forest',
      name: 'Random Forest',
      category: 'Ensemble',
      description: 'Ensemble of decision trees offering high accuracy and resistance to overfitting.',
      speed: 'Medium',
      accuracyRating: 'High',
      icon: 'Trees',
      recommendedFor: 'Tabular data with mixed feature types and complex non-linear patterns.',
      params: [
        { id: 'n_estimators', label: 'Number of Estimators', type: 'number', default: 100, min: 10, max: 500, step: 10 },
        { id: 'max_depth', label: 'Max Depth', type: 'number', default: 12, min: 1, max: 50, step: 1 },
        { id: 'min_samples_split', label: 'Min Samples Split', type: 'number', default: 2, min: 2, max: 20, step: 1 },
        { id: 'criterion', label: 'Criterion', type: 'select', default: 'gini', options: ['gini', 'entropy', 'log_loss'] },
      ]
    },
    {
      id: 'xgboost',
      name: 'XGBoost',
      category: 'Boosting',
      description: 'Optimized gradient boosted decision tree library designed for high efficiency and performance.',
      speed: 'Fast',
      accuracyRating: 'Very High',
      icon: 'Zap',
      recommendedFor: 'Competitive ML, complex tabular datasets, structured features.',
      params: [
        { id: 'n_estimators', label: 'Number of Estimators', type: 'number', default: 150, min: 20, max: 1000, step: 10 },
        { id: 'learning_rate', label: 'Learning Rate', type: 'number', default: 0.05, min: 0.001, max: 1.0, step: 0.01 },
        { id: 'max_depth', label: 'Max Depth', type: 'number', default: 6, min: 1, max: 20, step: 1 },
        { id: 'subsample', label: 'Subsample Ratio', type: 'number', default: 0.8, min: 0.1, max: 1.0, step: 0.05 },
      ]
    },
    {
      id: 'gradient_boosting',
      name: 'Gradient Boosting',
      category: 'Boosting',
      description: 'Sequential ensemble technique that corrects errors of prior trees to minimize loss.',
      speed: 'Medium',
      accuracyRating: 'High',
      icon: 'TrendingUp',
      recommendedFor: 'Medium-sized tabular datasets requiring high precision.',
      params: [
        { id: 'n_estimators', label: 'Number of Estimators', type: 'number', default: 100, min: 10, max: 500, step: 10 },
        { id: 'learning_rate', label: 'Learning Rate', type: 'number', default: 0.1, min: 0.01, max: 0.5, step: 0.01 },
        { id: 'max_depth', label: 'Max Depth', type: 'number', default: 4, min: 1, max: 15, step: 1 },
      ]
    },
    {
      id: 'svm',
      name: 'Support Vector Machine',
      category: 'Kernel',
      description: 'Finds optimal hyperplane that maximizes margin between classes in high dimensions.',
      speed: 'Moderate',
      accuracyRating: 'High',
      icon: 'Layers',
      recommendedFor: 'High-dimensional spaces with clear margins of separation.',
      params: [
        { id: 'C', label: 'Regularization (C)', type: 'number', default: 1.0, min: 0.01, max: 100, step: 0.1 },
        { id: 'kernel', label: 'Kernel', type: 'select', default: 'rbf', options: ['rbf', 'linear', 'poly', 'sigmoid'] },
        { id: 'gamma', label: 'Gamma', type: 'select', default: 'scale', options: ['scale', 'auto'] },
      ]
    },
    {
      id: 'logistic_regression',
      name: 'Logistic Regression',
      category: 'Linear',
      description: 'Statistical baseline classifier modeling log-odds of a binary or multi-class outcome.',
      speed: 'Very Fast',
      accuracyRating: 'Moderate',
      icon: 'Activity',
      recommendedFor: 'Linear decision boundaries, rapid baseline benchmarking and interpretability.',
      params: [
        { id: 'C', label: 'Inverse Regularization (C)', type: 'number', default: 1.0, min: 0.001, max: 10, step: 0.1 },
        { id: 'solver', label: 'Solver', type: 'select', default: 'lbfgs', options: ['lbfgs', 'liblinear', 'saga'] },
        { id: 'max_iter', label: 'Max Iterations', type: 'number', default: 200, min: 50, max: 2000, step: 50 },
      ]
    },
    {
      id: 'knn',
      name: 'K-Nearest Neighbors',
      category: 'Instance-Based',
      description: 'Non-parametric method that assigns class based on majority vote of nearest training instances.',
      speed: 'Fast Training / Slow Predict',
      accuracyRating: 'Good',
      icon: 'Users',
      recommendedFor: 'Localized data clusters, non-linear boundaries, small to medium datasets.',
      params: [
        { id: 'n_neighbors', label: 'Number of Neighbors (k)', type: 'number', default: 5, min: 1, max: 50, step: 1 },
        { id: 'weights', label: 'Weighting Function', type: 'select', default: 'uniform', options: ['uniform', 'distance'] },
        { id: 'metric', label: 'Distance Metric', type: 'select', default: 'minkowski', options: ['minkowski', 'euclidean', 'manhattan'] },
      ]
    },
    {
      id: 'decision_tree',
      name: 'Decision Tree',
      category: 'Tree-Based',
      description: 'Hierarchical tree model partitioning feature space based on information gain or Gini impurity.',
      speed: 'Very Fast',
      accuracyRating: 'Moderate',
      icon: 'GitFork',
      recommendedFor: 'Explainable AI, non-linear relationships without feature scaling.',
      params: [
        { id: 'max_depth', label: 'Max Depth', type: 'number', default: 8, min: 1, max: 30, step: 1 },
        { id: 'min_samples_split', label: 'Min Samples Split', type: 'number', default: 4, min: 2, max: 20, step: 1 },
        { id: 'criterion', label: 'Split Criterion', type: 'select', default: 'gini', options: ['gini', 'entropy'] },
      ]
    },
    {
      id: 'naive_bayes',
      name: 'Naive Bayes',
      category: 'Probabilistic',
      description: 'Probabilistic classifier based on Bayes theorem with strong independence assumptions.',
      speed: 'Extremely Fast',
      accuracyRating: 'Moderate',
      icon: 'Cpu',
      recommendedFor: 'Text classification, high-dimensional categorical features, rapid prototyping.',
      params: [
        { id: 'var_smoothing', label: 'Variance Smoothing', type: 'number', default: 1e-9, min: 1e-12, max: 1e-5, step: 1e-10 },
      ]
    },
  ],
  regression: [
    {
      id: 'rf_regressor',
      name: 'Random Forest Regressor',
      category: 'Ensemble',
      description: 'Ensemble of decision trees for regression averaging predictions across all trees.',
      speed: 'Medium',
      accuracyRating: 'High',
      icon: 'Trees',
      recommendedFor: 'Non-linear continuous targets with complex multi-feature interactions.',
      params: [
        { id: 'n_estimators', label: 'Number of Estimators', type: 'number', default: 120, min: 10, max: 500, step: 10 },
        { id: 'max_depth', label: 'Max Depth', type: 'number', default: 14, min: 1, max: 40, step: 1 },
        { id: 'criterion', label: 'Criterion', type: 'select', default: 'squared_error', options: ['squared_error', 'absolute_error', 'friedman_mse'] },
      ]
    },
    {
      id: 'gb_regressor',
      name: 'Gradient Boosting Regressor',
      category: 'Boosting',
      description: 'Additive boosting framework producing robust predictions by fitting trees to negative gradients.',
      speed: 'Medium',
      accuracyRating: 'High',
      icon: 'TrendingUp',
      recommendedFor: 'High precision continuous outcome prediction with tabular inputs.',
      params: [
        { id: 'n_estimators', label: 'Number of Estimators', type: 'number', default: 100, min: 10, max: 500, step: 10 },
        { id: 'learning_rate', label: 'Learning Rate', type: 'number', default: 0.1, min: 0.01, max: 0.5, step: 0.01 },
        { id: 'max_depth', label: 'Max Depth', type: 'number', default: 4, min: 1, max: 15, step: 1 },
      ]
    },
    {
      id: 'linear_regression',
      name: 'Linear Regression',
      category: 'Linear',
      description: 'Standard Ordinary Least Squares (OLS) fitting optimal linear coefficients to minimize residuals.',
      speed: 'Very Fast',
      accuracyRating: 'Moderate',
      icon: 'Activity',
      recommendedFor: 'Simple linear relationships, high interpretability of feature weights.',
      params: [
        { id: 'fit_intercept', label: 'Fit Intercept', type: 'select', default: 'true', options: ['true', 'false'] },
      ]
    },
    {
      id: 'ridge_regression',
      name: 'Ridge Regression',
      category: 'Regularized Linear',
      description: 'Linear model with L2 regularization penalty to prevent multicollinearity and overfitting.',
      speed: 'Very Fast',
      accuracyRating: 'Good',
      icon: 'Shield',
      recommendedFor: 'Correlated predictors, preventing parameter explosion.',
      params: [
        { id: 'alpha', label: 'Alpha (L2 Penalty)', type: 'number', default: 1.0, min: 0.001, max: 100, step: 0.1 },
        { id: 'solver', label: 'Solver', type: 'select', default: 'auto', options: ['auto', 'svd', 'cholesky', 'lsqr'] },
      ]
    },
    {
      id: 'lasso_regression',
      name: 'Lasso Regression',
      category: 'Regularized Linear',
      description: 'Linear model with L1 penalty that forces unimportant feature coefficients to exactly zero.',
      speed: 'Fast',
      accuracyRating: 'Good',
      icon: 'Sliders',
      recommendedFor: 'Sparse feature selection and high-dimensional regression.',
      params: [
        { id: 'alpha', label: 'Alpha (L1 Penalty)', type: 'number', default: 0.1, min: 0.001, max: 10, step: 0.01 },
        { id: 'max_iter', label: 'Max Iterations', type: 'number', default: 1000, min: 100, max: 5000, step: 100 },
      ]
    },
    {
      id: 'dt_regressor',
      name: 'Decision Tree Regressor',
      category: 'Tree-Based',
      description: 'Single decision tree partitioning space into piecewise constant segments.',
      speed: 'Very Fast',
      accuracyRating: 'Moderate',
      icon: 'GitFork',
      recommendedFor: 'Non-linear step functions, clear visual interpretation.',
      params: [
        { id: 'max_depth', label: 'Max Depth', type: 'number', default: 6, min: 1, max: 25, step: 1 },
        { id: 'min_samples_split', label: 'Min Samples Split', type: 'number', default: 2, min: 2, max: 20, step: 1 },
      ]
    },
    {
      id: 'svr',
      name: 'Support Vector Regressor (SVR)',
      category: 'Kernel',
      description: 'Finds continuous function within an epsilon-tube of training points using kernel trick.',
      speed: 'Moderate',
      accuracyRating: 'High',
      icon: 'Layers',
      recommendedFor: 'Complex non-linear regression with localized relationships.',
      params: [
        { id: 'C', label: 'Regularization (C)', type: 'number', default: 10.0, min: 0.1, max: 200, step: 1.0 },
        { id: 'epsilon', label: 'Epsilon Tube Width', type: 'number', default: 0.1, min: 0.01, max: 1.0, step: 0.01 },
        { id: 'kernel', label: 'Kernel', type: 'select', default: 'rbf', options: ['rbf', 'linear', 'poly'] },
      ]
    },
    {
      id: 'polynomial_regression',
      name: 'Polynomial Regression',
      category: 'Curvilinear',
      description: 'Linear model augmented with polynomial feature combinations to capture curvature.',
      speed: 'Fast',
      accuracyRating: 'Good',
      icon: 'Maximize2',
      recommendedFor: 'Curved relationships with a modest number of input variables.',
      params: [
        { id: 'degree', label: 'Polynomial Degree', type: 'number', default: 2, min: 2, max: 4, step: 1 },
        { id: 'include_bias', label: 'Include Bias', type: 'select', default: 'false', options: ['true', 'false'] },
      ]
    },
  ]
};

export const SAMPLE_DATASETS = [
  {
    id: 'ds-1',
    name: 'Employee Attrition.csv',
    type: 'Classification',
    rows: 1470,
    columns: 35,
    target: 'Attrition',
    uploadDate: 'Apr 24, 2025',
    status: 'Ready',
    fileSize: '412 KB',
    description: 'IBM HR Analytics dataset analyzing employee turnover, satisfaction, compensation, and workplace attrition.',
    missingValues: 0,
    duplicates: 0,
    columnsList: [
      { name: 'Age', type: 'Integer', missing: 0, unique: 43 },
      { name: 'Attrition', type: 'Categorical', missing: 0, unique: 2, isTarget: true },
      { name: 'BusinessTravel', type: 'Categorical', missing: 0, unique: 3 },
      { name: 'DailyRate', type: 'Integer', missing: 0, unique: 886 },
      { name: 'Department', type: 'Categorical', missing: 0, unique: 3 },
      { name: 'DistanceFromHome', type: 'Integer', missing: 0, unique: 29 },
      { name: 'Education', type: 'Integer', missing: 0, unique: 5 },
      { name: 'EducationField', type: 'Categorical', missing: 0, unique: 6 },
      { name: 'EnvironmentSatisfaction', type: 'Integer', missing: 0, unique: 4 },
      { name: 'Gender', type: 'Categorical', missing: 0, unique: 2 },
      { name: 'HourlyRate', type: 'Integer', missing: 0, unique: 71 },
      { name: 'JobInvolvement', type: 'Integer', missing: 0, unique: 4 },
      { name: 'JobLevel', type: 'Integer', missing: 0, unique: 5 },
      { name: 'JobRole', type: 'Categorical', missing: 0, unique: 9 },
      { name: 'JobSatisfaction', type: 'Integer', missing: 0, unique: 4 },
      { name: 'MaritalStatus', type: 'Categorical', missing: 0, unique: 3 },
      { name: 'MonthlyIncome', type: 'Integer', missing: 0, unique: 1349 },
      { name: 'NumCompaniesWorked', type: 'Integer', missing: 0, unique: 10 },
      { name: 'OverTime', type: 'Categorical', missing: 0, unique: 2 },
      { name: 'PercentSalaryHike', type: 'Integer', missing: 0, unique: 15 },
      { name: 'PerformanceRating', type: 'Integer', missing: 0, unique: 2 },
      { name: 'RelationshipSatisfaction', type: 'Integer', missing: 0, unique: 4 },
      { name: 'TotalWorkingYears', type: 'Integer', missing: 0, unique: 40 },
      { name: 'WorkLifeBalance', type: 'Integer', missing: 0, unique: 4 },
      { name: 'YearsAtCompany', type: 'Integer', missing: 0, unique: 37 },
      { name: 'YearsInCurrentRole', type: 'Integer', missing: 0, unique: 19 },
      { name: 'YearsSinceLastPromotion', type: 'Integer', missing: 0, unique: 16 },
      { name: 'YearsWithCurrManager', type: 'Integer', missing: 0, unique: 18 },
    ],
    previewRows: [
      { Age: 41, Attrition: 'Yes', BusinessTravel: 'Travel_Rarely', Department: 'Sales', DistanceFromHome: 1, Education: 2, EducationField: 'Life Sciences', EnvironmentSatisfaction: 2, Gender: 'Female', JobRole: 'Sales Executive', MonthlyIncome: 5993, OverTime: 'Yes', TotalWorkingYears: 8, YearsAtCompany: 6 },
      { Age: 49, Attrition: 'No', BusinessTravel: 'Travel_Frequently', Department: 'Research & Development', DistanceFromHome: 8, Education: 1, EducationField: 'Life Sciences', EnvironmentSatisfaction: 3, Gender: 'Male', JobRole: 'Research Scientist', MonthlyIncome: 5130, OverTime: 'No', TotalWorkingYears: 10, YearsAtCompany: 10 },
      { Age: 37, Attrition: 'Yes', BusinessTravel: 'Travel_Rarely', Department: 'Research & Development', DistanceFromHome: 2, Education: 2, EducationField: 'Other', EnvironmentSatisfaction: 4, Gender: 'Male', JobRole: 'Laboratory Technician', MonthlyIncome: 2090, OverTime: 'Yes', TotalWorkingYears: 7, YearsAtCompany: 0 },
      { Age: 33, Attrition: 'No', BusinessTravel: 'Travel_Frequently', Department: 'Research & Development', DistanceFromHome: 3, Education: 4, EducationField: 'Life Sciences', EnvironmentSatisfaction: 4, Gender: 'Female', JobRole: 'Research Scientist', MonthlyIncome: 2909, OverTime: 'Yes', TotalWorkingYears: 8, YearsAtCompany: 8 },
      { Age: 27, Attrition: 'No', BusinessTravel: 'Travel_Rarely', Department: 'Research & Development', DistanceFromHome: 2, Education: 1, EducationField: 'Medical', EnvironmentSatisfaction: 1, Gender: 'Male', JobRole: 'Laboratory Technician', MonthlyIncome: 3468, OverTime: 'No', TotalWorkingYears: 6, YearsAtCompany: 2 },
      { Age: 32, Attrition: 'No', BusinessTravel: 'Travel_Frequently', Department: 'Research & Development', DistanceFromHome: 2, Education: 2, EducationField: 'Life Sciences', EnvironmentSatisfaction: 4, Gender: 'Male', JobRole: 'Laboratory Technician', MonthlyIncome: 3068, OverTime: 'No', TotalWorkingYears: 8, YearsAtCompany: 7 },
      { Age: 59, Attrition: 'No', BusinessTravel: 'Travel_Rarely', Department: 'Research & Development', DistanceFromHome: 3, Education: 3, EducationField: 'Medical', EnvironmentSatisfaction: 3, Gender: 'Female', JobRole: 'Laboratory Technician', MonthlyIncome: 2670, OverTime: 'Yes', TotalWorkingYears: 12, YearsAtCompany: 1 },
      { Age: 30, Attrition: 'No', BusinessTravel: 'Travel_Rarely', Department: 'Research & Development', DistanceFromHome: 24, Education: 1, EducationField: 'Life Sciences', EnvironmentSatisfaction: 4, Gender: 'Male', JobRole: 'Laboratory Technician', MonthlyIncome: 2693, OverTime: 'No', TotalWorkingYears: 1, YearsAtCompany: 1 },
      { Age: 38, Attrition: 'No', BusinessTravel: 'Travel_Frequently', Department: 'Research & Development', DistanceFromHome: 23, Education: 3, EducationField: 'Life Sciences', EnvironmentSatisfaction: 4, Gender: 'Male', JobRole: 'Manufacturing Director', MonthlyIncome: 9526, OverTime: 'No', TotalWorkingYears: 10, YearsAtCompany: 9 },
      { Age: 36, Attrition: 'No', BusinessTravel: 'Travel_Rarely', Department: 'Research & Development', DistanceFromHome: 27, Education: 3, EducationField: 'Medical', EnvironmentSatisfaction: 3, Gender: 'Male', JobRole: 'Healthcare Representative', MonthlyIncome: 5237, OverTime: 'No', TotalWorkingYears: 17, YearsAtCompany: 7 },
    ]
  },
  {
    id: 'ds-2',
    name: 'Student Performance.csv',
    type: 'Classification',
    rows: 1000,
    columns: 8,
    target: 'Grade',
    uploadDate: 'Apr 23, 2025',
    status: 'Ready',
    fileSize: '74 KB',
    description: 'Demographic and academic dataset tracking student exam results across math, reading, and writing.',
    missingValues: 0,
    duplicates: 0,
    columnsList: [
      { name: 'gender', type: 'Categorical', missing: 0, unique: 2 },
      { name: 'race_ethnicity', type: 'Categorical', missing: 0, unique: 5 },
      { name: 'parental_level_of_education', type: 'Categorical', missing: 0, unique: 6 },
      { name: 'lunch', type: 'Categorical', missing: 0, unique: 2 },
      { name: 'test_preparation_course', type: 'Categorical', missing: 0, unique: 2 },
      { name: 'math_score', type: 'Integer', missing: 0, unique: 81 },
      { name: 'reading_score', type: 'Integer', missing: 0, unique: 72 },
      { name: 'writing_score', type: 'Integer', missing: 0, unique: 77 },
      { name: 'Grade', type: 'Categorical', missing: 0, unique: 4, isTarget: true }
    ],
    previewRows: [
      { gender: 'female', race_ethnicity: 'group B', parental_level_of_education: "bachelor's degree", lunch: 'standard', test_preparation_course: 'none', math_score: 72, reading_score: 72, writing_score: 74, Grade: 'B' },
      { gender: 'female', race_ethnicity: 'group C', parental_level_of_education: 'some college', lunch: 'standard', test_preparation_course: 'completed', math_score: 69, reading_score: 90, writing_score: 88, Grade: 'A' },
      { gender: 'female', race_ethnicity: 'group B', parental_level_of_education: "master's degree", lunch: 'standard', test_preparation_course: 'none', math_score: 90, reading_score: 95, writing_score: 93, Grade: 'A' },
      { gender: 'male', race_ethnicity: 'group A', parental_level_of_education: "associate's degree", lunch: 'free/reduced', test_preparation_course: 'none', math_score: 47, reading_score: 57, writing_score: 44, Grade: 'C' },
      { gender: 'male', race_ethnicity: 'group C', parental_level_of_education: 'some college', lunch: 'standard', test_preparation_course: 'none', math_score: 76, reading_score: 78, writing_score: 75, Grade: 'B' },
      { gender: 'female', race_ethnicity: 'group B', parental_level_of_education: "associate's degree", lunch: 'standard', test_preparation_course: 'none', math_score: 71, reading_score: 83, writing_score: 78, Grade: 'B' },
      { gender: 'female', race_ethnicity: 'group B', parental_level_of_education: 'some college', lunch: 'standard', test_preparation_course: 'completed', math_score: 88, reading_score: 95, writing_score: 92, Grade: 'A' },
      { gender: 'male', race_ethnicity: 'group B', parental_level_of_education: 'some college', lunch: 'free/reduced', test_preparation_course: 'none', math_score: 40, reading_score: 43, writing_score: 39, Grade: 'D' },
      { gender: 'male', race_ethnicity: 'group D', parental_level_of_education: 'high school', lunch: 'free/reduced', test_preparation_course: 'completed', math_score: 64, reading_score: 64, writing_score: 67, Grade: 'B' },
      { gender: 'female', race_ethnicity: 'group B', parental_level_of_education: 'high school', lunch: 'free/reduced', test_preparation_course: 'none', math_score: 38, reading_score: 60, writing_score: 50, Grade: 'C' }
    ]
  },
  {
    id: 'ds-3',
    name: 'Heart Disease.csv',
    type: 'Classification',
    rows: 303,
    columns: 14,
    target: 'Outcome',
    uploadDate: 'Apr 22, 2025',
    status: 'Ready',
    fileSize: '12 KB',
    description: 'Cleveland Heart Clinic diagnostic indicators for cardiovascular disease presence.',
    missingValues: 0,
    duplicates: 1,
    columnsList: [
      { name: 'age', type: 'Integer', missing: 0, unique: 41 },
      { name: 'sex', type: 'Categorical', missing: 0, unique: 2 },
      { name: 'cp', type: 'Categorical', missing: 0, unique: 4 },
      { name: 'trestbps', type: 'Integer', missing: 0, unique: 49 },
      { name: 'chol', type: 'Integer', missing: 0, unique: 152 },
      { name: 'fbs', type: 'Categorical', missing: 0, unique: 2 },
      { name: 'restecg', type: 'Categorical', missing: 0, unique: 3 },
      { name: 'thalach', type: 'Integer', missing: 0, unique: 91 },
      { name: 'exang', type: 'Categorical', missing: 0, unique: 2 },
      { name: 'oldpeak', type: 'Float', missing: 0, unique: 40 },
      { name: 'slope', type: 'Categorical', missing: 0, unique: 3 },
      { name: 'ca', type: 'Integer', missing: 0, unique: 5 },
      { name: 'thal', type: 'Categorical', missing: 0, unique: 4 },
      { name: 'Outcome', type: 'Categorical', missing: 0, unique: 2, isTarget: true }
    ],
    previewRows: [
      { age: 63, sex: 1, cp: 3, trestbps: 145, chol: 233, fbs: 1, restecg: 0, thalach: 150, exang: 0, oldpeak: 2.3, slope: 0, ca: 0, thal: 1, Outcome: 1 },
      { age: 37, sex: 1, cp: 2, trestbps: 130, chol: 250, fbs: 0, restecg: 1, thalach: 187, exang: 0, oldpeak: 3.5, slope: 0, ca: 0, thal: 2, Outcome: 1 },
      { age: 41, sex: 0, cp: 1, trestbps: 130, chol: 204, fbs: 0, restecg: 0, thalach: 172, exang: 0, oldpeak: 1.4, slope: 2, ca: 0, thal: 2, Outcome: 1 },
      { age: 56, sex: 1, cp: 1, trestbps: 120, chol: 236, fbs: 0, restecg: 1, thalach: 178, exang: 0, oldpeak: 0.8, slope: 2, ca: 0, thal: 2, Outcome: 1 },
      { age: 57, sex: 0, cp: 0, trestbps: 120, chol: 354, fbs: 0, restecg: 1, thalach: 163, exang: 1, oldpeak: 0.6, slope: 2, ca: 0, thal: 2, Outcome: 1 },
      { age: 57, sex: 1, cp: 0, trestbps: 140, chol: 192, fbs: 0, restecg: 1, thalach: 148, exang: 0, oldpeak: 0.4, slope: 1, ca: 0, thal: 1, Outcome: 1 },
      { age: 56, sex: 0, cp: 1, trestbps: 140, chol: 294, fbs: 0, restecg: 0, thalach: 153, exang: 0, oldpeak: 1.3, slope: 1, ca: 0, thal: 2, Outcome: 1 },
      { age: 44, sex: 1, cp: 1, trestbps: 120, chol: 263, fbs: 0, restecg: 1, thalach: 173, exang: 0, oldpeak: 0.0, slope: 2, ca: 0, thal: 3, Outcome: 1 },
      { age: 52, sex: 1, cp: 2, trestbps: 172, chol: 199, fbs: 1, restecg: 1, thalach: 162, exang: 0, oldpeak: 0.5, slope: 2, ca: 0, thal: 3, Outcome: 1 },
      { age: 57, sex: 1, cp: 2, trestbps: 150, chol: 168, fbs: 0, restecg: 1, thalach: 174, exang: 0, oldpeak: 1.6, slope: 2, ca: 0, thal: 2, Outcome: 1 }
    ]
  },
  {
    id: 'ds-4',
    name: 'California Housing.csv',
    type: 'Regression',
    rows: 20640,
    columns: 9,
    target: 'MedHouseVal',
    uploadDate: 'Apr 20, 2025',
    status: 'Ready',
    fileSize: '1.4 MB',
    description: 'Median house values in California districts derived from the 1990 U.S. census.',
    missingValues: 0,
    duplicates: 0,
    columnsList: [
      { name: 'MedInc', type: 'Float', missing: 0, unique: 12928 },
      { name: 'HouseAge', type: 'Float', missing: 0, unique: 52 },
      { name: 'AveRooms', type: 'Float', missing: 0, unique: 19392 },
      { name: 'AveBedrms', type: 'Float', missing: 0, unique: 14233 },
      { name: 'Population', type: 'Float', missing: 0, unique: 3846 },
      { name: 'AveOccup', type: 'Float', missing: 0, unique: 18841 },
      { name: 'Latitude', type: 'Float', missing: 0, unique: 862 },
      { name: 'Longitude', type: 'Float', missing: 0, unique: 844 },
      { name: 'MedHouseVal', type: 'Float', missing: 0, unique: 3842, isTarget: true }
    ],
    previewRows: [
      { MedInc: 8.3252, HouseAge: 41.0, AveRooms: 6.9841, AveBedrms: 1.0238, Population: 322.0, AveOccup: 2.5556, Latitude: 37.88, Longitude: -122.23, MedHouseVal: 4.526 },
      { MedInc: 8.3014, HouseAge: 21.0, AveRooms: 6.2381, AveBedrms: 0.9718, Population: 2401.0, AveOccup: 2.1098, Latitude: 37.86, Longitude: -122.22, MedHouseVal: 3.585 },
      { MedInc: 7.2574, HouseAge: 52.0, AveRooms: 8.2881, AveBedrms: 1.0734, Population: 496.0, AveOccup: 2.8023, Latitude: 37.85, Longitude: -122.24, MedHouseVal: 3.521 },
      { MedInc: 5.6431, HouseAge: 52.0, AveRooms: 5.8173, AveBedrms: 1.0730, Population: 558.0, AveOccup: 2.5479, Latitude: 37.85, Longitude: -122.25, MedHouseVal: 3.413 },
      { MedInc: 3.8462, HouseAge: 52.0, AveRooms: 6.2818, AveBedrms: 1.0811, Population: 565.0, AveOccup: 2.1815, Latitude: 37.85, Longitude: -122.25, MedHouseVal: 3.422 },
      { MedInc: 4.0368, HouseAge: 52.0, AveRooms: 4.7616, AveBedrms: 1.1036, Population: 413.0, AveOccup: 2.1399, Latitude: 37.85, Longitude: -122.25, MedHouseVal: 2.697 },
      { MedInc: 3.6591, HouseAge: 52.0, AveRooms: 4.9319, AveBedrms: 0.9514, Population: 1094.0, AveOccup: 2.1284, Latitude: 37.84, Longitude: -122.25, MedHouseVal: 2.992 },
      { MedInc: 3.1200, HouseAge: 52.0, AveRooms: 4.7975, AveBedrms: 1.0618, Population: 1157.0, AveOccup: 1.7883, Latitude: 37.84, Longitude: -122.25, MedHouseVal: 2.414 },
      { MedInc: 2.0804, HouseAge: 42.0, AveRooms: 4.2941, AveBedrms: 1.1176, Population: 1206.0, AveOccup: 2.0269, Latitude: 37.84, Longitude: -122.26, MedHouseVal: 2.267 },
      { MedInc: 3.6912, HouseAge: 52.0, AveRooms: 4.9705, AveBedrms: 0.9902, Population: 1551.0, AveOccup: 2.1723, Latitude: 37.84, Longitude: -122.25, MedHouseVal: 2.611 }
    ]
  }
];

export const SAMPLE_MODELS = [
  {
    id: 'mod-1',
    name: 'Random Forest Classifier v2',
    algorithm: 'Random Forest',
    datasetId: 'ds-1',
    datasetName: 'Employee Attrition.csv',
    problemType: 'Classification',
    target: 'Attrition',
    accuracy: 96.8,
    precision: 95.4,
    recall: 94.1,
    f1Score: 94.7,
    trainingDate: 'Apr 24, 2025',
    duration: '4.2s',
    status: 'Trained',
    isBest: true,
    hyperparameters: {
      n_estimators: 150,
      max_depth: 12,
      min_samples_split: 2,
      criterion: 'gini'
    },
    features: ['Age', 'BusinessTravel', 'DailyRate', 'Department', 'DistanceFromHome', 'JobRole', 'MonthlyIncome', 'OverTime', 'TotalWorkingYears', 'YearsAtCompany'],
    confusionMatrix: {
      labels: ['No (Stayed)', 'Yes (Left)'],
      matrix: [
        [240, 7],
        [8, 105]
      ]
    }
  },
  {
    id: 'mod-2',
    name: 'Support Vector Machine v1',
    algorithm: 'Support Vector Machine',
    datasetId: 'ds-1',
    datasetName: 'Employee Attrition.csv',
    problemType: 'Classification',
    target: 'Attrition',
    accuracy: 91.2,
    precision: 90.1,
    recall: 88.5,
    f1Score: 89.3,
    trainingDate: 'Apr 24, 2025',
    duration: '3.1s',
    status: 'Trained',
    isBest: false,
    hyperparameters: {
      C: 1.5,
      kernel: 'rbf',
      gamma: 'scale'
    },
    features: ['Age', 'BusinessTravel', 'DailyRate', 'Department', 'DistanceFromHome', 'JobRole', 'MonthlyIncome', 'OverTime', 'TotalWorkingYears', 'YearsAtCompany'],
    confusionMatrix: {
      labels: ['No (Stayed)', 'Yes (Left)'],
      matrix: [
        [231, 16],
        [16, 97]
      ]
    }
  },
  {
    id: 'mod-3',
    name: 'KNN Classifier v1',
    algorithm: 'K-Nearest Neighbors',
    datasetId: 'ds-1',
    datasetName: 'Employee Attrition.csv',
    problemType: 'Classification',
    target: 'Attrition',
    accuracy: 85.5,
    precision: 84.0,
    recall: 82.2,
    f1Score: 83.1,
    trainingDate: 'Apr 24, 2025',
    duration: '1.2s',
    status: 'Trained',
    isBest: false,
    hyperparameters: {
      n_neighbors: 7,
      weights: 'distance',
      metric: 'euclidean'
    },
    features: ['Age', 'BusinessTravel', 'DailyRate', 'Department', 'DistanceFromHome', 'JobRole', 'MonthlyIncome', 'OverTime', 'TotalWorkingYears', 'YearsAtCompany'],
    confusionMatrix: {
      labels: ['No (Stayed)', 'Yes (Left)'],
      matrix: [
        [220, 27],
        [25, 88]
      ]
    }
  },
  {
    id: 'mod-4',
    name: 'Logistic Regression Baseline',
    algorithm: 'Logistic Regression',
    datasetId: 'ds-1',
    datasetName: 'Employee Attrition.csv',
    problemType: 'Classification',
    target: 'Attrition',
    accuracy: 82.1,
    precision: 81.2,
    recall: 78.4,
    f1Score: 79.8,
    trainingDate: 'Apr 24, 2025',
    duration: '0.8s',
    status: 'Trained',
    isBest: false,
    hyperparameters: {
      C: 1.0,
      solver: 'lbfgs',
      max_iter: 200
    },
    features: ['Age', 'BusinessTravel', 'DailyRate', 'Department', 'DistanceFromHome', 'JobRole', 'MonthlyIncome', 'OverTime', 'TotalWorkingYears', 'YearsAtCompany'],
    confusionMatrix: {
      labels: ['No (Stayed)', 'Yes (Left)'],
      matrix: [
        [215, 32],
        [32, 81]
      ]
    }
  },
  {
    id: 'mod-5',
    name: 'California House Price RF Regressor',
    algorithm: 'Random Forest Regressor',
    datasetId: 'ds-4',
    datasetName: 'California Housing.csv',
    problemType: 'Regression',
    target: 'MedHouseVal',
    r2Score: 0.884,
    mae: 0.312,
    mse: 0.184,
    rmse: 0.429,
    trainingDate: 'Apr 21, 2025',
    duration: '6.5s',
    status: 'Trained',
    isBest: true,
    hyperparameters: {
      n_estimators: 150,
      max_depth: 16,
      criterion: 'squared_error'
    },
    features: ['MedInc', 'HouseAge', 'AveRooms', 'AveBedrms', 'Population', 'AveOccup', 'Latitude', 'Longitude'],
    residuals: [
      { predicted: 2.1, actual: 2.05, residual: 0.05 },
      { predicted: 3.5, actual: 3.42, residual: 0.08 },
      { predicted: 1.8, actual: 1.95, residual: -0.15 },
      { predicted: 4.2, actual: 4.10, residual: 0.10 },
      { predicted: 2.9, actual: 2.85, residual: 0.05 }
    ]
  },
  {
    id: 'mod-6',
    name: 'Gradient Boosting Regressor v1',
    algorithm: 'Gradient Boosting Regressor',
    datasetId: 'ds-4',
    datasetName: 'California Housing.csv',
    problemType: 'Regression',
    target: 'MedHouseVal',
    r2Score: 0.862,
    mae: 0.338,
    mse: 0.208,
    rmse: 0.456,
    trainingDate: 'Apr 21, 2025',
    duration: '5.1s',
    status: 'Trained',
    isBest: false,
    hyperparameters: {
      n_estimators: 120,
      learning_rate: 0.08,
      max_depth: 5
    },
    features: ['MedInc', 'HouseAge', 'AveRooms', 'AveBedrms', 'Population', 'AveOccup', 'Latitude', 'Longitude']
  }
];

export const RECENT_ACTIVITIES = [
  {
    id: 'act-1',
    type: 'upload',
    title: 'Dataset "Employee Attrition.csv" uploaded',
    time: '2 min ago',
    color: '#8B5CF6',
  },
  {
    id: 'act-2',
    type: 'train',
    title: 'Random Forest model trained successfully',
    time: '5 min ago',
    color: '#22C55E',
  },
  {
    id: 'act-3',
    type: 'predict',
    title: 'Prediction made (Class: No, Confidence: 94.2%)',
    time: '12 min ago',
    color: '#3B82F6',
  },
  {
    id: 'act-4',
    type: 'upload',
    title: 'New dataset "Student Performance.csv" uploaded',
    time: '1 hour ago',
    color: '#A855F7',
  },
  {
    id: 'act-5',
    type: 'comparison',
    title: 'Evaluated 4 algorithms on Attrition dataset',
    time: '3 hours ago',
    color: '#F59E0B',
  }
];

export const PREPROCESSING_OPTIONS = {
  missingValues: [
    { id: 'mean', name: 'Mean Imputation', desc: 'Replace nulls with column arithmetic mean (Numerical only)' },
    { id: 'median', name: 'Median Imputation', desc: 'Replace nulls with 50th percentile (Robust to outliers)' },
    { id: 'mode', name: 'Mode Imputation', desc: 'Replace nulls with most frequent value (Categorical & Discrete)' },
    { id: 'drop', name: 'Drop Missing Rows', desc: 'Discard any row containing NaN values across selected features' },
    { id: 'constant', name: 'Constant Value (0 / "Unknown")', desc: 'Fill with fixed placeholder' },
  ],
  encoding: [
    { id: 'one_hot', name: 'One-Hot Encoding', desc: 'Create binary indicator columns for each category (Best for nominal data)' },
    { id: 'label', name: 'Label Encoding', desc: 'Convert unique strings into integer indices 0, 1, 2... (Best for ordinal data)' },
  ],
  scaling: [
    { id: 'standard', name: 'StandardScaler (Z-Score)', desc: 'Zero mean and unit variance (x - mean) / std' },
    { id: 'minmax', name: 'MinMaxScaler (0 to 1)', desc: 'Compress features into a bounded [0, 1] range' },
    { id: 'robust', name: 'RobustScaler (IQR)', desc: 'Scales features using statistics that are robust to outliers' },
    { id: 'none', name: 'None (Raw Values)', desc: 'Leave continuous scales untouched' },
  ],
  splits: [
    { id: '80_20', label: '80% Train / 20% Test', train: 80, test: 20 },
    { id: '70_30', label: '70% Train / 30% Test', train: 70, test: 30 },
    { id: '75_25', label: '75% Train / 25% Test', train: 75, test: 25 },
  ]
};
