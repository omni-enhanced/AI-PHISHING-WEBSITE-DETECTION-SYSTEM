# 🛡️ AI-Powered Phishing Website Detection System

An intelligent cybersecurity system designed to detect phishing websites using machine learning, real-time URL analysis, and browser extension integration.

This system analyzes URLs and webpage features to identify malicious phishing websites and protect users from online fraud.

---

## 🚀 Project Overview

Phishing attacks are one of the most common cyber threats where attackers create fake websites to steal sensitive information such as:

- Login credentials
- Banking information
- Personal data

This project uses **machine learning and feature-based analysis** to detect phishing websites with high accuracy and provide instant warnings to users.

---

## 🎯 Key Features

- Real-time phishing detection
- Feature-based Machine Learning Model (ELM)
- Explainable AI predictions with confidence scores
- Browser Extension Auto Scan
- Domain Age & SSL Verification
- Redirect Detection
- Hidden Form Detection
- Brand Spoof Detection

---

## 🧠 AI Model

The system uses a **Feature-Based Extreme Learning Machine (ELM)** model.

### Workflow

1. URL Input
2. Feature Extraction
3. ML Model Prediction
4. Risk Score Generation
5. Security Warning to User

---

## ⚙️ Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Python
- FastAPI

### Machine Learning
- Extreme Learning Machine (ELM)
- Scikit-learn
- Pandas
- NumPy

### Database
- MongoDB

### Browser Extension
- JavaScript
- Chrome Extension API

---

## 📂 Project Structure
phishing-detection-system
│
├── backend
│ ├── main.py
│ ├── feature_extractor.py
│ ├── train_elm.py
│ ├── elm_model.pkl
│ ├── requirements.txt
│ └── .env
│
├── data
│ └── phishing_dataset.csv
│
├── frontend
│ ├── login.html
│ ├── register.html
│ ├── dashboard.html
│ ├── styles.css
│ └── script.js
│
├── extension
│ ├── manifest.json
│ ├── background.js
│ ├── content.js
│ └── popup.html
│
└── README.md


---

## 🔍 Detection Features

The system analyzes multiple indicators including:

- URL length
- IP address in URL
- Suspicious characters
- HTTPS/SSL certificate
- Domain age
- Redirect behavior
- Hidden forms
- Brand spoof attempts

---

## 🖥️ System Architecture

User / Browser  
↓  
Browser Extension  
↓  
FastAPI Backend  
↓  
Feature Extraction  
↓  
ELM Machine Learning Model  
↓  
Prediction + Confidence Score  
↓  
Security Warning

---

## 📦 Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/phishing-detection-system.git
cd phishing-detection-system
2️⃣ Install Dependencies
pip install flask flask-cors flask-jwt-extended pymongo python-dotenv bcrypt numpy scikit-learn joblib
3️⃣ Create .env
MONGO_URI=your_mongodb_connection
SECRET_KEY=your_secret_key
4️⃣ Run Backend
python app.py

Server runs on:

http://127.0.0.1:5000
🌐 Browser Extension Setup

Open Chrome

Go to

chrome://extensions

Enable Developer Mode

Click Load Unpacked

Select the extension folder

📊 Example Output
URL: http://secure-paypal-login.com

Prediction: PHISHING
Confidence: 92%

Detected Issues:
- Suspicious Domain
- Redirect Detected
- Brand Spoof Attempt
🔐 Security Impact

This project helps:

- Protect users from phishing attacks

- Improve cybersecurity awareness

- Provide explainable AI predictions

- Enable real-time website protection

🔮 Future Improvements

- Deep Learning Model

- Email Phishing Detection

- Global Threat Intelligence

- Mobile Browser Protection

- Real-time Threat Dashboard

👨‍💻 Authors

- Omni-Enhanced Developers

📜 License

This project is licensed under the MIT License.


---

# 📜 LICENSE (MIT License)

Create a file named **`LICENSE`** and paste this:

```markdown
MIT License

Copyright (c) 2026 Omni-Enhanced Developers

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software.

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY.
