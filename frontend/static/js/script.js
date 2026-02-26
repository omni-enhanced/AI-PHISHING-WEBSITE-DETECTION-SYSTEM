// ══════════════════════════════════════
//  STORAGE HELPERS
// ══════════════════════════════════════
function getHistory() {
    try { return JSON.parse(localStorage.getItem('phishguard_history') || '[]'); } catch { return []; }
}

function saveToHistory(url, verdict, risk, safe) {
    try {
        const history = getHistory();
        history.unshift({ url, verdict, risk, safe, ts: new Date().toISOString() });
        if (history.length > 100) history.pop();
        localStorage.setItem('phishguard_history', JSON.stringify(history));
        renderHistory();
    } catch(e) { console.warn('Storage error:', e); }
}

// ══════════════════════════════════════
//  HISTORY RENDER
// ══════════════════════════════════════
function timeAgo(iso) {
    const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
    if (diff < 60)    return diff + 's';
    if (diff < 3600)  return Math.floor(diff/60) + 'm';
    if (diff < 86400) return Math.floor(diff/3600) + 'h';
    return Math.floor(diff/86400) + 'd';
}

function highlightMatch(text, query) {
    if (!query) return escHtml(text);
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return escHtml(text).replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}

function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderHistory(query = '') {
    const list    = document.getElementById('historyList');
    const empty   = document.getElementById('historyEmpty');
    const counter = document.getElementById('historyCount');

    const all     = getHistory().slice(0, 10); // recent 10 only
    const q       = query.trim().toLowerCase();
    const filtered = q ? all.filter(h => h.url.toLowerCase().includes(q)) : all;

    // update count badge
    counter.textContent = all.length;

    // remove old items (keep empty placeholder)
    list.querySelectorAll('.history-item, .history-no-results').forEach(el => el.remove());

    if (all.length === 0) {
        empty.style.display = 'flex';
        return;
    }
    empty.style.display = 'none';

    if (filtered.length === 0) {
        list.insertAdjacentHTML('beforeend',
            `<div class="history-no-results">No results for "<strong>${escHtml(query)}</strong>"</div>`);
        return;
    }

    filtered.forEach((item, i) => {
        const isPhish = item.verdict === 'Phishing';
        const cls     = isPhish ? 'threat' : 'safe';
        const label   = isPhish ? 'PHISHING' : 'SAFE';
        const conf    = isPhish ? item.risk : item.safe;
        const urlHtml = highlightMatch(item.url, query);

        const div = document.createElement('div');
        div.className = 'history-item';
        div.style.animationDelay = (i * 0.04) + 's';
        div.title = 'Click to re-scan this URL';
        div.innerHTML = `
            <span class="hi-dot ${cls}"></span>
            <span class="hi-url">${urlHtml}</span>
            <span class="hi-badge ${cls}">${label}</span>
            <span class="hi-conf ${cls}">${conf}%</span>
            <span class="hi-time">${timeAgo(item.ts)}</span>
            <span class="hi-rerun">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/>
                </svg>
            </span>`;

        // Click to re-scan
        div.addEventListener('click', () => {
            document.getElementById('urlInput').value = item.url;
            document.getElementById('urlInput').focus();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // auto-trigger scan after short delay
            setTimeout(() => analyzeUrl(), 300);
        });

        list.appendChild(div);
    });
}

// ══════════════════════════════════════
//  SEARCH
// ══════════════════════════════════════
function filterHistory(val) {
    const clearBtn = document.getElementById('searchClearBtn');
    clearBtn.classList.toggle('hidden', val.length === 0);
    renderHistory(val);
}

function clearSearch() {
    const input = document.getElementById('historySearch');
    input.value = '';
    input.focus();
    document.getElementById('searchClearBtn').classList.add('hidden');
    renderHistory();
}

function clearHistory() {
    if (!confirm('Clear all scan history?')) return;
    localStorage.removeItem('phishguard_history');
    renderHistory();
}

// ══════════════════════════════════════
//  MAIN ANALYZE
// ══════════════════════════════════════
async function analyzeUrl() {
    const urlInput = document.getElementById('urlInput').value.trim();
    const scanBtn  = document.getElementById('scanBtn');
    const result   = document.getElementById('resultCard');
    const loader   = document.getElementById('loader');

    if (!urlInput) {
        const inp = document.getElementById('urlInput');
        inp.style.borderColor = 'rgba(224,27,36,0.8)';
        inp.style.boxShadow   = '0 0 0 3px rgba(224,27,36,0.2)';
        inp.focus();
        setTimeout(() => { inp.style.borderColor = ''; inp.style.boxShadow = ''; }, 1800);
        return;
    }

    loader.classList.remove('hidden');
    result.classList.add('hidden');
    scanBtn.disabled = true;

    const phases = ['SCANNING TARGET', 'EXTRACTING FEATURES', 'RUNNING ELM MODEL', 'GENERATING VERDICT'];
    let pi = 0;
    const phaseTimer = setInterval(() => {
        pi = (pi + 1) % phases.length;
        document.getElementById('scanPhase').textContent = phases[pi];
    }, 900);

    try {
        const response = await fetch('http://127.0.0.1:5000/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: urlInput })
        });
        const data = await response.json();

        const isPhishing = !data.result.toLowerCase().includes('safe');

        const statusEl = document.getElementById('statusText');
        statusEl.textContent = isPhishing ? '⚠ PHISHING DETECTED' : '✓ URL IS SAFE';
        statusEl.className = 'verdict-text ' + (isPhishing ? 'threat' : 'safe');

        const iconWrap   = document.getElementById('resultIconWrap');
        const iconSafe   = document.getElementById('iconSafe');
        const iconThreat = document.getElementById('iconThreat');
        iconWrap.className = 'result-icon-wrap ' + (isPhishing ? 'threat-icon' : 'safe-icon');
        iconSafe.classList.toggle('hidden', isPhishing);
        iconThreat.classList.toggle('hidden', !isPhishing);

        document.getElementById('riskVal').textContent = `${data.risk_confidence}%`;
        document.getElementById('safeVal').textContent = `${data.safe_confidence}%`;

        result.classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('riskBar').style.width = `${data.risk_confidence}%`;
            document.getElementById('safeBar').style.width = `${data.safe_confidence}%`;
        }, 60);

        if (data.match_info) {
            const mi = document.getElementById('matchInfo');
            mi.textContent = data.match_info;
            mi.classList.remove('hidden');
        } else {
            document.getElementById('matchInfo').classList.add('hidden');
        }

        // Save and refresh history
        saveToHistory(urlInput, isPhishing ? 'Phishing' : 'Safe', data.risk_confidence, data.safe_confidence);

    } catch (err) {
        console.error(err);
        const statusEl = document.getElementById('statusText');
        statusEl.textContent = '✕ BACKEND OFFLINE';
        statusEl.className = 'verdict-text threat';
        document.getElementById('resultIconWrap').className = 'result-icon-wrap threat-icon';
        document.getElementById('iconThreat').classList.remove('hidden');
        document.getElementById('iconSafe').classList.add('hidden');
        document.getElementById('riskVal').textContent = '--';
        document.getElementById('safeVal').textContent = '--';
        result.classList.remove('hidden');
    } finally {
        clearInterval(phaseTimer);
        loader.classList.add('hidden');
        scanBtn.disabled = false;
    }
}

// ══════════════════════════════════════
//  INIT
// ══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {

    // Enter key on URL input
    document.getElementById('urlInput').addEventListener('keydown', e => {
        if (e.key === 'Enter') analyzeUrl();
    });

    // Enter key on search to scan first result
    document.getElementById('historySearch').addEventListener('keydown', e => {
        if (e.key === 'Escape') clearSearch();
    });

    // Render history on load
    renderHistory();

    // Track visitor
    try {
        const today = new Date().toDateString();
        const v = JSON.parse(localStorage.getItem('phishguard_visitors') || '{}');
        v[today] = (v[today] || 0) + 1;
        localStorage.setItem('phishguard_visitors', JSON.stringify(v));
    } catch(e) {}

    // ── SPLASH ──
    const splash  = document.getElementById('splash');
    const mainApp = document.getElementById('mainApp');
    const bar     = document.getElementById('splashBar');
    const pct     = document.getElementById('splashPct');
    const status  = document.getElementById('loaderStatus');

    const stages = [
        { to: 25, speed: 18, label: 'LOADING WEIGHTS'    },
        { to: 55, speed: 22, label: 'BUILDING ELM MODEL' },
        { to: 80, speed: 28, label: 'CALIBRATING'        },
        { to: 100,speed: 14, label: 'SYSTEM READY'       },
    ];

    let progress = 0, stage = 0;

    function tick() {
        if (stage >= stages.length) return;
        const s = stages[stage];
        status.textContent = s.label;
        const t = setInterval(() => {
            progress++;
            bar.style.width = progress + '%';
            pct.textContent = progress + '%';
            if (progress >= s.to) {
                clearInterval(t);
                stage++;
                if (progress >= 100) setTimeout(dismiss, 500);
                else setTimeout(tick, 180);
            }
        }, s.speed);
    }

    function dismiss() {
        splash.classList.add('fade-out');
        mainApp.style.transition = 'opacity 0.7s ease 0.3s';
        mainApp.style.opacity = '1';
        setTimeout(() => splash.remove(), 1200);
    }

    setTimeout(tick, 500);
});