# Quick Command Reference

## 🚀 Quick Start Commands

### 1. Navigate to Work Directory
```powershell
cd work
```

### 2. Install Dependencies (First Time Only)
```powershell
pip install -r requirements.txt
```

### 3. Train Model (First Time Only)
```powershell
python train_model.py
```
**Note:** Requires `amazon_delivery_final-final.csv` in parent directory

### 4. Run API Example
```powershell
python call_api_example.py
```

### 5. Run API Directly
```powershell
python api.py
```

---

## 📋 Step-by-Step Execution

### **Complete Setup (First Time)**
```powershell
# Step 1: Navigate to work directory
cd work

# Step 2: Install dependencies
pip install -r requirements.txt

# Step 3: Train model (if not already trained)
python train_model.py

# Step 4: Test the API
python call_api_example.py
```

### **Daily Usage (After Setup)**
```powershell
# Just run the API
cd work
python call_api_example.py
```

---

## 🔧 Individual Component Commands

### **Train Model Only**
```powershell
cd work
python train_model.py
```
**Output:** `delivery_slot_model.pkl` and `delivery_slot_model_metadata.json`

### **Test Inference Only**
```powershell
cd work
python inference.py
```

### **Test API Only**
```powershell
cd work
python api.py
```

### **Run Example**
```powershell
cd work
python call_api_example.py
```

---

## 🐍 Python Code Usage

### **In Your Python Script**
```python
from api import recommend_delivery_slots, print_recommendations

# Call API
result = recommend_delivery_slots(
    store_id="STR_1023",
    pickup_availability_window="09:00-21:00",
    seller_allowed_slots=["10-11", "12-13", "15-16", "18-19"],
    parcel_category="Electronics",
    delivery_location=(19.176, 72.836),
    top_n=8
)

# Print results
print_recommendations(result)
```

---

## 📊 Verify Installation

### **Check Python Version**
```powershell
python --version
```

### **Check Installed Packages**
```powershell
python -c "import pandas; import xgboost; import sklearn; import geopy; print('All packages installed!')"
```

### **Check Model Exists**
```powershell
dir delivery_slot_model.pkl
```

---

## 🐛 Troubleshooting Commands

### **Reinstall Dependencies**
```powershell
pip install --upgrade -r requirements.txt
```

### **Check for Errors**
```powershell
python -c "from api import recommend_delivery_slots; print('API OK')"
```

### **Verify Model File**
```powershell
python -c "import pickle; f=open('delivery_slot_model.pkl','rb'); pickle.load(f); print('Model OK')"
```

---

## 📝 Expected Output

### **Training Output**
```
Loading data from amazon_delivery_final-final.csv...
Loaded 41050 records
Engineering features...
Using 21 features: [...]
Training XGBoost model...
Training set: 32840 samples
Test set: 8210 samples

Model Performance:
Train RMSE: 0.1234
Test RMSE: 0.1456
Test MAE: 0.0987
Test R²: 0.8234

Model saved to delivery_slot_model.pkl
```

### **API Output**
```
======================================================================
DELIVERY SLOT RECOMMENDATIONS
======================================================================

Successfully generated 8 recommendations

1. 2024-01-20 (Saturday) - 18-19
   Success Probability: 85.00%
   Time: 18:00

2. 2024-01-21 (Sunday) - 15-16
   Success Probability: 82.50%
   Time: 15:00

...
```

---

## 🎯 Common Workflows

### **Workflow 1: First Time Setup**
```powershell
cd work
pip install -r requirements.txt
python train_model.py
python call_api_example.py
```

### **Workflow 2: Daily Usage**
```powershell
cd work
python call_api_example.py
```

### **Workflow 3: Integration Testing**
```python
# In your test file
from api import recommend_delivery_slots

result = recommend_delivery_slots(...)
assert result['success'] == True
assert len(result['recommendations']) == 8
```

---

## ⚡ Quick Test

### **Minimal Test**
```powershell
cd work
python -c "from api import recommend_delivery_slots; r = recommend_delivery_slots('STR_1023', '09:00-21:00', ['10-11'], 'Electronics', (19.176, 72.836)); print('Success!' if r['success'] else r['message'])"
```
