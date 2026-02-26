chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  if (!tab.url.startsWith("http")) return;

  fetch("http://127.0.0.1:5000/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: tab.url })
  })
  .then(r => r.json())
  .then(data => {
    if (data.result.includes("Phishing")) {
      chrome.tabs.sendMessage(tabId, {
        type: "PHISHING_ALERT",
        payload: data
      });
    }
  })
  .catch(() => {});
});
