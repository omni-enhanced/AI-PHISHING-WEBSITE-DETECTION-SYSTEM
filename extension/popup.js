const siteText = document.getElementById("site");
const resultBox = document.getElementById("result");
const scanBtn = document.getElementById("scan");

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = tabs[0].url;
  siteText.innerText = url;

  scanBtn.onclick = () => scanSite(url);
});

function scanSite(url) {
  resultBox.innerText = "Scanning...";

  fetch("http://127.0.0.1:5000/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  })
  .then(res => res.json())
  .then(data => {
    if (data.result.includes("Phishing")) {
      resultBox.className = "phishing";
      resultBox.innerHTML = `
        🚨 PHISHING<br>
        Risk: ${data.risk_confidence}%
      `;
    } else {
      resultBox.className = "safe";
      resultBox.innerHTML = `
        ✅ SAFE<br>
        Risk: ${data.risk_confidence}%
      `;
    }
  })
  .catch(() => {
    resultBox.innerText = "Backend not running";
  });
}
