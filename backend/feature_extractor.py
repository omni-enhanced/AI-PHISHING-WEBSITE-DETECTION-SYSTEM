import re

def extract_features(url):
    features = []

    features.append(len(url))                     # length
    features.append(1 if "@" in url else 0)        # @ symbol
    features.append(url.count("."))               # dot count
    features.append(1 if url.startswith("https") else 0) 
    features.append(1 if re.search(r'\d+\.\d+\.\d+\.\d+', url) else 0)

    return features
