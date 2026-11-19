# NeuroML Studio – Modern AI/ML Model Training Platform

**NeuroML Studio** is an enterprise-grade SaaS web application for data scientists, machine learning engineers, and researchers to explore tabular datasets, execute preprocessing pipelines, benchmark multiple supervised machine learning algorithms, and perform real-time model inferences through an intuitive, dark-themed dashboard.

![NeuroML Studio](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80)

---

## 🌟 Key Features

### 1. 📊 Interactive Analytics Dashboard
- **Executive Metric Cards**: Total Datasets, Models Trained, Real-time Predictions Made, Best Model Accuracy.
- **Model Performance Bar Chart**: Visually compares cross-validation scores across algorithms (Random Forest, SVM, KNN, Logistic Regression).
- **Recent Activity Feed**: Real-time audit trail of uploads, training runs, and inference queries.
- **Recent Datasets Overview**: Quick access to dataset schemas and ready-status badges.
- **Quick Action Triggers**: Instant shortcuts to upload datasets, trigger model training, or run inference.

### 2. 📂 CSV Dataset Upload & Schema Profiling
- **Drag & Drop CSV Upload Zone**: Native drag-and-drop file uploader with validation (UTF-8 format, file size bounds).
- **One-Click Realistic Sample Datasets**:
  - *Employee Attrition (IBM HR Analytics)*: 1,470 rows, 35 columns (Classification: Attrition).
  - *Student Academic Performance*: 1,000 rows, 8 columns (Classification: Grade).
  - *Heart Disease Diagnostics*: 303 rows, 14 columns (Classification: Risk Outcome).
  - *California Housing Prices*: 20,640 rows, 9 columns (Regression: Median House Value).
- **Instant Preview**: Displays first 10 rows with detected column types (Numerical vs. Categorical), unique counts, and missing values.

### 3. 🔍 Exploratory Data Analysis (EDA) & Data Explorer
- **Overview Tab**: Dataset profile, schema breakdowns, and memory usage.
- **Interactive Table View**: Client-side search, multi-column sorting, pagination, and row inspection.
- **Descriptive Statistics**: Matrix containing count, mean, standard deviation, minimum, 25%, 50% (median), 75%, and maximum values for numeric features.
- **Visualizations**:
  - *Histograms & Frequency Bars*: Feature frequency distributions.
  - *2D Scatter Plots*: Bivariate correlation between any two selected features.
  - *Pearson Correlation Heatmap Matrix*: Color-coded correlation coefficients from -1.0 to +1.0.
  - *Pie Charts*: Class balance and category proportions.

### 4. ⚙️ Data Preprocessing Pipeline Builder
- **Missing Value Imputation**: Mean, Median, Mode, Drop missing rows, or constant replacement.
- **Duplicate Removal**: Automated deduplication with status counters.
- **Categorical Feature Encoding**: One-Hot Encoding (binary dummies) and Label Encoding (ordinal integers).
- **Feature Scaling**: StandardScaler (Z-Score normalization), MinMaxScaler [0, 1], and RobustScaler (IQR).
- **Train/Test Partitioning**: Adjustable slider (80/20, 70/30, 75/25 splits).
- **Live Recipe Summary**: Live audit of transformation steps before applying to training.

### 5. 🤖 Multi-Algorithm Model Training Studio
- **Problem Types**: Classification and Regression.
- **Dynamic Target Selection**: Dropdown to designate dependent target variable.
- **Feature Selection**: Multiselect list with search, select-all, and deselect-all capabilities.
- **Supported Classification Algorithms**:
  - Random Forest Classifier (Ensemble)
  - XGBoost (Extreme Gradient Boosting)
  - Gradient Boosting Classifier
  - Support Vector Machine (SVM)
  - Logistic Regression (Linear)
  - K-Nearest Neighbors (KNN)
  - Decision Tree Classifier
  - Naive Bayes (Probabilistic)
- **Supported Regression Algorithms**:
  - Random Forest Regressor
  - Gradient Boosting Regressor
  - Linear Regression (OLS)
  - Ridge Regression (L2 Regularization)
  - Lasso Regression (L1 Regularization)
  - Decision Tree Regressor
  - Support Vector Regressor (SVR)
  - Polynomial Regression
- **Hyperparameter Customization**: Tune `n_estimators`, `max_depth`, `learning_rate`, `C`, `n_neighbors`, etc.
- **Real-Time Training Terminal**: Live progress bar, step-by-step checklist, and animated console log window.

### 6. 🏆 Model Comparison & Metrics Leaderboard
- **Classification Evaluation**: Accuracy, Precision, Recall, F1 Score, and 2x2 Interactive Confusion Matrix.
- **Regression Evaluation**: R² Score, Mean Absolute Error (MAE), Mean Squared Error (MSE), and Root Mean Squared Error (RMSE).
- **Head-to-Head Comparison Chart**: Visual metric bars and convergence curves.
- **Best-Performing Model Callout**: Highlights best algorithm with direct "Use for Prediction" trigger.

### 7. 🔮 Real-Time Inference & Prediction Studio
- **Dynamic Feature Inputs**: Generates input fields matching the selected model's training features.
- **Sample Data Auto-Fill**: One-click test button to populate inputs with representative values.
- **Inference Results Card**: Clear output classification/value, confidence gauge, class probability distributions, and latency timer.
- **Prediction History Log**: Audit table of past inferences with JSON export capability.

### 8. 📦 Model Registry & Training History
- **Saved Models**: Inspect hyperparameters, model metrics, download weights stub, or delete models.
- **Training History**: Historical run logs with elapsed time, cross-validation metrics, and status badges.

---

## 💻 Tech Stack

- **Framework**: React.js (v18.3.1)
- **Bundler & Tooling**: Vite
- **Styling**: Tailwind CSS with custom Dark SaaS Design System
- **Routing**: React Router DOM (v6)
- **Charts & Visualizations**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: React Context API (`AuthContext`, `DatasetContext`)

---

## 🎨 Design System Specifications

| Element | Color Hex | Description |
| :--- | :--- | :--- |
| **Main Background** | `#0B1020` | Ultra-deep navy dashboard canvas |
| **Sidebar Background** | `#10172A` | Slate dark navigation panel |
| **Cards & Panels** | `#151E32` | Elevated container surface |
| **Borders** | `#27334A` | Subtle structural dividers |
| **Primary Accent** | `#8B5CF6` | Vibrant neon purple glow |
| **Secondary Accent**| `#3B82F6` | Electric tech blue |
| **Success Indicator**| `#22C55E` | Emerald green status & metrics |
| **Primary Typography** | `#F8FAFC` | Crisp white headers |
| **Secondary Text** | `#94A3B8` | Subdued slate labels |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Installation & Run

1. **Navigate to the frontend directory**:
   ```bash
   cd NeuroML-Studio/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local Vite development server**:
   ```bash
   npm run dev
   ```

4. **Open in your browser**:
   Navigate to `http://localhost:5173`

---

## 🔌 Backend Integration (FastAPI)

NeuroML Studio comes pre-configured with a clean API service layer in `src/services/`.

To connect to your live FastAPI backend:
1. Update `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_DEMO_MODE=false
   ```
2. The UI will communicate with the following FastAPI endpoints:
   - `POST /datasets/upload`: Multipart CSV file upload
   - `GET /datasets`: List datasets
   - `POST /preprocessing/apply`: Apply transformation pipelines
   - `POST /models/train`: Multi-algorithm model training
   - `POST /predict`: Real-time inference
