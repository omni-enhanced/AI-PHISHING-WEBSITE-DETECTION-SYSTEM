chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "PHISHING_ALERT") {
    renderPopup(msg.payload);
  }
});

function renderPopup(data) {
  if (document.getElementById("phish-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "phish-overlay";
  overlay.style = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.65);
    z-index:999999;
  `;

  const box = document.createElement("div");
  box.style = `
    position:fixed;
    top:12%;
    left:15%;
    width:70%;
    height:70%;
    background:white;
    border-radius:14px;
    padding:28px;
    font-family:Arial;
    overflow:auto;
    box-shadow:0 0 25px red;
  `;

  box.innerHTML = `
    <h1 style="color:red">⚠ Phishing Website Detected</h1>
    <p><b>URL:</b> ${data.url}</p>
    <p><b>Result:</b> ${data.result}</p>
    <p><b>Matched Brand:</b> ${data.matched_brand || "N/A"}</p>
    <p><b>Similarity:</b> ${data.similarity || "N/A"}%</p>
    <p><b>Risk Confidence:</b> ${data.risk_confidence}%</p>

    <div style="margin-top:25px">
      <button id="leaveBtn" style="background:red;color:white;padding:10px 18px;border:none;border-radius:8px">
        Go Back (Recommended)
      </button>

      <button id="continueBtn" style="margin-left:10px;padding:10px 18px;border:none;border-radius:8px">
        Continue Anyway
      </button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(box);

  document.getElementById("leaveBtn").onclick = () => history.back();
  document.getElementById("continueBtn").onclick = () => {
    overlay.remove();
    box.remove();
  };
}
