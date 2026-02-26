from spoof_detector import is_spoof

safe_domains = [
    "google.com",
    "paypal.com",
    "microsoft.com",
    "facebook.com",
    "amazon.com"
]

test_urls = [
    "http://paypal.com",
    "http://paypa1.com",
    "http://ggoogle.com",
    "http://rmicrosoft.com",
    "http://google.login-secure.site",
    "http://facebook.com",
    "http://faceb00k.com"
]

print("\n=== FINAL RESULT FORMAT ===\n")

for url in test_urls:
    spoof, brand, similarity = is_spoof(url, safe_domains)

    print(f"URL: {url}")

    if spoof:
        print("→ Phishing (Brand Spoof)")
        print(f"→ Matched Brand: {brand}")
        print(f"→ Similarity: {similarity}%\n")
    else:
        print("→ Safe\n")