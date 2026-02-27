from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import math
from urllib.parse import urlparse  # Added this for the helper function

from feature_extractor import extract_features
from whitelist import is_whitelisted, SAFE_DOMAINS
from spoof_detector import is_spoof

app = Flask(__name__)
CORS(app)

# ======================
# HELPER FUNCTION (The Fix)
# ======================
def extract_domain(url):
    if not url.startswith(('http://', 'https://')):
        url = 'http://' + url
    parsed_uri = urlparse(url)
    domain = '{uri.netloc}'.format(uri=parsed_uri)
    return domain.replace('www.', '')

# ======================
# LOAD MODEL
# ======================
import os
model_path = os.path.join(os.path.dirname(__file__), "elm_model.pkl")
with open(model_path, "rb") as f:
    model, scaler = pickle.load(f)

# ======================
# ROUTES
# ======================
@app.route("/")
def home():
    return {"status": "Hybrid AI Phishing Detection Running"}

@app.route("/scan", methods=["POST"])
def scan():
    data = request.get_json()
    url = data["url"]

    # This now works because extract_domain is defined above
    domain = extract_domain(url).lower()

    # 1️⃣ Exact Whitelist Check
    if domain in SAFE_DOMAINS:
        return jsonify({
            "result": "Safe",
            "risk_confidence": 0,
            "safe_confidence": 100,
            "url": url
        })

    # 2️⃣ Spoof Check
    spoof, brand, similarity = is_spoof(url, SAFE_DOMAINS)

    if spoof:
        risk = similarity
        safe = 100 - risk

        return jsonify({
            "result": "Phishing (Brand Spoof)",
            "matched_brand": brand,
            "similarity": similarity,
            "risk_confidence": risk,
            "safe_confidence": safe,
            "url": url
        })

    # 3️⃣ ML Prediction
    features = extract_features(url)
    features_scaled = scaler.transform([features])
    prediction = model.predict(features_scaled)[0]

    if prediction == 1:
        return jsonify({
            "result": "Safe",
            "risk_confidence": 10,
            "safe_confidence": 90,
            "url": url
        })
    else:
        return jsonify({
            "result": "Phishing (AI Detected)",
            "risk_confidence": 85,
            "safe_confidence": 15,
            "url": url
        })

# ======================
# RUN SERVER
# ======================
if __name__ == "__main__":
    # Bind to 0.0.0.0 and use the PORT env var for Render deployment
    import os

    port = int(os.environ.get("PORT", 5000))
    # debug mode should be off in production, but we respect FLASK_DEBUG
    debug_flag = os.environ.get("FLASK_DEBUG", "0") == "1"
    app.run(host="0.0.0.0", port=port, debug=debug_flag)
