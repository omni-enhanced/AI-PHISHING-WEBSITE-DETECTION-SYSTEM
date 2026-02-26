import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import RidgeClassifier

# ===============================
# LOAD DATASET
# ===============================

DATA_PATH = "../data/phishing_dataset.csv"

data = pd.read_csv(DATA_PATH)

print("Dataset loaded:", data.shape)

# ===============================
# PREPARE FEATURES & LABELS
# ===============================

# Drop URL column if exists
if 'url' in data.columns:
    X = data.drop(['url', 'label'], axis=1)
else:
    X = data.drop(['label'], axis=1)

y = data['label'].astype(int)

# ===============================
# SCALE FEATURES
# ===============================

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ===============================
# TRAIN TEST SPLIT
# ===============================

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

# ===============================
# SIMPLE ELM-LIKE CLASSIFIER
# (Fast + strong baseline)
# ===============================

model = RidgeClassifier()

model.fit(X_train, y_train)

# ===============================
# EVALUATE
# ===============================

y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)

print(f"Model Accuracy: {acc*100:.2f}%")

# ===============================
# SAVE MODEL + SCALER
# ===============================

with open("elm_model.pkl", "wb") as f:
    pickle.dump((model, scaler), f)

print("Model saved as elm_model.pkl")
