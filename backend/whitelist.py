import pandas as pd
from urllib.parse import urlparse

DATA_PATH = "../data/phishing_dataset.csv"

def load_safe_domains():
    df = pd.read_csv(DATA_PATH)

    if 'url' not in df.columns:
        return set()

    safe_urls = df[df['label'] == 0]['url'].astype(str)

    domains = set()
    for url in safe_urls:
        parsed = urlparse(url if url.startswith("http") else "http://" + url)
        domains.add(parsed.netloc.replace("www.", ""))

    return domains

SAFE_DOMAINS = load_safe_domains()

def is_whitelisted(url):
    parsed = urlparse(url if url.startswith("http") else "http://" + url)
    domain = parsed.netloc.replace("www.", "")
    return domain in SAFE_DOMAINS
