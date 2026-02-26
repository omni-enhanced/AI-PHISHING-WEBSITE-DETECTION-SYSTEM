from urllib.parse import urlparse

TYPO_MAP = {
    "0": "o",
    "1": "l",
    "rn": "m",
    "vv": "w"
}

def normalize(text):
    text = text.lower()
    for k, v in TYPO_MAP.items():
        text = text.replace(k, v)
    return text

def extract_domain(url):
    parsed = urlparse(url if url.startswith("http") else "http://" + url)
    return parsed.netloc.replace("www.", "")

def get_root(domain):
    parts = domain.split(".")
    if len(parts) >= 2:
        return parts[-2]
    return domain

def progressive_match(test, safe):
    # grow matching: s → sa → saf → safe ...
    for i in range(3, min(len(test), len(safe)) + 1):
        if test[:i] == safe[:i]:
            return True
    return False

def typo_similarity(a, b):
    matches = sum(1 for x, y in zip(a, b) if x == y)
    return matches / max(len(a), len(b))

def is_spoof(url, safe_domains):
    domain = extract_domain(url)
    test_root = normalize(get_root(domain))

    for safe in safe_domains:
        safe_root = normalize(get_root(safe))

        # Subdomain attack
        if safe_root in domain and domain != safe:
            return True, safe, 99.0

        # Progressive alphabet matching (your idea!)
        if progressive_match(test_root, safe_root) and test_root != safe_root:
            return True, safe, 95.0

        # Typo similarity fallback
        score = typo_similarity(test_root, safe_root)

        if score >= 0.7 and test_root != safe_root:
            return True, safe, round(score * 100, 2)

    return False, None, 0
