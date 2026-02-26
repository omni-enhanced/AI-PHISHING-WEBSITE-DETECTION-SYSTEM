// Visitor Counter (session-based demo)
if (!localStorage.getItem("visitors")) {
  localStorage.setItem("visitors", 1);
} else {
  let count = parseInt(localStorage.getItem("visitors"));
  localStorage.setItem("visitors", count + 1);
}

// Scan Website
function scanWebsite() {
  const url = document.getElementById("urlInput").value;
  const resultBox = document.getElementById("resultBox");

  if (!url) return;

  resultBox.innerHTML = "Scanning...";

  fetch("http://127.0.0.1:5000/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  })
  .then(res => res.json())
  .then(data => {

    if (data.result.includes("Phishing")) {
      resultBox.className = "phishing";
      incrementStat("phishing");
    } else {
      resultBox.className = "safe";
      incrementStat("safe");
    }

    resultBox.innerHTML = `${data.result} <br> Risk: ${data.risk_confidence}%`;

    addToHistory(url, data.result);
  });
}

// Store History
function addToHistory(url, result) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.unshift({url, result});
  localStorage.setItem("history", JSON.stringify(history));
  incrementStat("total");
}

// Stats Counter
function incrementStat(type) {
  let stats = JSON.parse(localStorage.getItem("stats")) || {
    total:0, phishing:0, safe:0
  };

  stats[type]++;
  localStorage.setItem("stats", JSON.stringify(stats));
}

// Admin Page Load
if (window.location.pathname.includes("admin.html")) {

  let stats = JSON.parse(localStorage.getItem("stats")) || {
    total:0, phishing:0, safe:0
  };

  document.getElementById("totalScans").innerText = stats.total;
  document.getElementById("phishingCount").innerText = stats.phishing;
  document.getElementById("safeCount").innerText = stats.safe;
  document.getElementById("visitorCount").innerText =
    localStorage.getItem("visitors") || 1;

  let history = JSON.parse(localStorage.getItem("history")) || [];
  let list = document.getElementById("historyList");

  history.forEach(item => {
    let li = document.createElement("li");
    li.textContent = `${item.url} → ${item.result}`;
    list.appendChild(li);
  });
}

// Navigation
function goAdmin() {
  window.location.href = "admin.html";
}

function goHome() {
  window.location.href = "index.html";
}