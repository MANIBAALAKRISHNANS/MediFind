// Professional medical PDF report (web only).
// Opens a styled A4 HTML page and triggers the browser print dialog
// so the user can "Save as PDF".

function safe(val, fallback = 'Not available') {
  if (val == null || val === '') return fallback
  return String(val)
}

function capitalize(str) {
  return safe(str).replace(/\b\w/g, c => c.toUpperCase())
}

function escHtml(str) {
  return safe(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function severityColor(sev) {
  const s = (sev || '').toLowerCase()
  if (s === 'severe')   return { bg: '#fef2f2', border: '#fca5a5', text: '#dc2626', badge: '#dc2626' }
  if (s === 'moderate') return { bg: '#fff7ed', border: '#fdba74', text: '#ea580c', badge: '#ea580c' }
  return                       { bg: '#f0fdf4', border: '#86efac', text: '#16a34a', badge: '#16a34a' }
}

function urgencyLabel(urgency) {
  const map = {
    'self-care':        { label: 'Self-Care — Manageable at Home',       color: '#16a34a', bg: '#f0fdf4' },
    'see-doctor-soon':  { label: 'See a Doctor Within a Few Days',        color: '#ea580c', bg: '#fff7ed' },
    'see-doctor-today': { label: 'See a Doctor Today — Do Not Delay',     color: '#dc2626', bg: '#fef2f2' },
    'emergency':        { label: 'MEDICAL EMERGENCY — Call 108 Now',      color: '#dc2626', bg: '#fef2f2' },
  }
  return map[urgency] ?? { label: 'Consult a Doctor', color: '#ea580c', bg: '#fff7ed' }
}

function buildHTML(diagnosis, symptoms, bestMatch) {
  const d   = diagnosis  || {}
  const bm  = bestMatch  || {}
  const now = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short',
  })

  const sev     = severityColor(d.severity)
  const urg     = urgencyLabel(d.urgency)
  const conf    = Math.min(100, d.confidence ?? 50)
  const source  = d.source === 'gemini' ? 'Gemini AI (Cloud)' : 'MediFind Local Engine'
  const disease = escHtml(d.disease || 'Unspecified Condition')
  const spec    = capitalize(d.specialty || 'General Physician')

  const recList = (d.recommendations || [])
    .map((r, i) => `<li><span class="num">${i + 1}</span>${escHtml(r)}</li>`).join('')

  const flagList = (d.redFlags || [])
    .map(f => `<li>${escHtml(f)}</li>`).join('')

  const careList = (d.homeCare || [])
    .map(c => `<li>${escHtml(c)}</li>`).join('')

  const diffList = (d.differentialDiagnosis || [])
    .map(x => `
      <div class="diff-row">
        <span class="diff-name">${escHtml(x.name)}</span>
        <div class="diff-bar-wrap">
          <div class="diff-bar" style="width:${x.probability ?? 0}%"></div>
        </div>
        <span class="diff-pct">${x.probability ?? 0}%</span>
      </div>`).join('')

  const scoreBreak = bm.scoreBreakdown || {}
  const scoreRows = [
    ['Specialty Match', scoreBreak.specialtyScore ?? 0, 35],
    ['Distance Score',  scoreBreak.distanceScore  ?? 0, 40],
    ['Facility Type',   scoreBreak.typeScore       ?? 0, 15],
    ['Data Quality',    scoreBreak.completenessScore ?? 0, 10],
  ].map(([label, val, max]) => `
    <div class="score-row">
      <span class="score-label">${label}</span>
      <div class="score-bar-wrap">
        <div class="score-bar" style="width:${Math.round((val/max)*100)}%"></div>
      </div>
      <span class="score-val">${Math.round(val)} / ${max}</span>
    </div>`).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>MediFind Report — ${disease}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 13px;
    color: #1e293b;
    background: #f1f5f9;
    line-height: 1.6;
  }

  .page {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    background: #ffffff;
    box-shadow: 0 0 30px rgba(0,0,0,.15);
  }

  /* ── HEADER ── */
  .header {
    background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
    padding: 28px 30px 22px;
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .header-left h1 {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }
  .header-left p {
    font-size: 12px;
    color: #ccfbf1;
    margin-top: 4px;
  }
  .header-right {
    text-align: right;
    font-size: 10px;
    color: #99f6e4;
    line-height: 1.8;
  }
  .header-right strong { color: #e2fefa; }

  /* ── DISCLAIMER ── */
  .disclaimer {
    background: #fff7ed;
    border-left: 4px solid #ea580c;
    padding: 10px 20px;
    font-size: 10.5px;
    color: #9a3412;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .disclaimer .icon { font-size: 16px; flex-shrink: 0; }

  /* ── BODY ── */
  .body { padding: 20px 30px 10px; }

  /* ── SECTION ── */
  .section { margin-bottom: 18px; }
  .section-title {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #0f766e;
    border-bottom: 2px solid #ccfbf1;
    padding-bottom: 5px;
    margin-bottom: 12px;
  }

  /* ── SYMPTOMS BOX ── */
  .symptoms-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 14px 18px;
    font-size: 14px;
    font-style: italic;
    color: #334155;
  }

  /* ── DIAGNOSIS CARD ── */
  .diagnosis-card {
    border: 1.5px solid ${sev.border};
    background: ${sev.bg};
    border-radius: 12px;
    padding: 18px 20px;
  }
  .diagnosis-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 14px;
  }
  .disease-name {
    font-size: 22px;
    font-weight: 800;
    color: #0f172a;
  }
  .sev-badge {
    background: ${sev.badge};
    color: #fff;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  /* confidence */
  .confidence-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
  }
  .conf-label { font-size: 11px; color: #64748b; font-weight: 600; white-space: nowrap; }
  .conf-track {
    flex: 1;
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
  }
  .conf-fill {
    height: 100%;
    background: linear-gradient(90deg, #0d9488, #14b8a6);
    border-radius: 4px;
    width: ${conf}%;
  }
  .conf-pct { font-size: 13px; font-weight: 700; color: #0d9488; }

  /* urgency + specialty row */
  .meta-row {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }
  .meta-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
  }
  .urg-pill { background: ${urg.bg}; color: ${urg.color}; border: 1px solid ${urg.color}40; }
  .spec-pill { background: #f0fdfa; color: #0f766e; border: 1px solid #99f6e4; }

  .description {
    font-size: 12.5px;
    color: #475569;
    line-height: 1.7;
    border-top: 1px solid ${sev.border};
    padding-top: 12px;
  }

  /* ── GRID LAYOUT ── */
  .two-col { display: flex; gap: 20px; }
  .two-col .col { flex: 1; }

  /* ── LISTS ── */
  .rec-list, .bullet-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .rec-list li {
    display: flex;
    gap: 10px;
    font-size: 12px;
    color: #334155;
    align-items: flex-start;
  }
  .rec-list li .num {
    background: #0d9488;
    color: #fff;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .bullet-list li {
    display: flex;
    gap: 8px;
    font-size: 12px;
    color: #334155;
    align-items: flex-start;
  }
  .bullet-list li::before {
    content: '';
    width: 6px;
    height: 6px;
    background: #0d9488;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 6px;
  }

  /* ── RED FLAGS ── */
  .red-flags-box {
    background: #fef2f2;
    border: 1.5px solid #fca5a5;
    border-radius: 10px;
    padding: 14px 18px;
  }
  .red-flags-box .flag-header {
    font-size: 12px;
    font-weight: 700;
    color: #dc2626;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .red-flags-box ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .red-flags-box ul li {
    font-size: 12px;
    color: #991b1b;
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }
  .red-flags-box ul li::before {
    content: '';
    width: 7px;
    height: 7px;
    background: #dc2626;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 5px;
  }

  /* ── WHEN TO SEEK HELP ── */
  .when-box {
    background: #f0fdfa;
    border-left: 4px solid #0d9488;
    border-radius: 0 8px 8px 0;
    padding: 12px 16px;
    font-size: 12px;
    color: #134e4a;
    line-height: 1.65;
  }

  /* ── DIFFERENTIAL ── */
  .diff-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 7px;
  }
  .diff-name { font-size: 11.5px; color: #334155; width: 150px; flex-shrink: 0; }
  .diff-bar-wrap { flex: 1; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; }
  .diff-bar { height: 100%; background: linear-gradient(90deg, #0d9488, #14b8a6); border-radius: 3px; }
  .diff-pct { font-size: 11px; color: #0d9488; font-weight: 700; width: 32px; text-align: right; }

  /* ── FACILITY CARD ── */
  .facility-card {
    border: 1.5px solid #a5f3fc;
    background: #f0fdfe;
    border-radius: 12px;
    padding: 18px 20px;
  }
  .facility-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }
  .facility-name { font-size: 17px; font-weight: 800; color: #0f172a; }
  .type-badge {
    background: #0e7490;
    color: #fff;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 700;
    white-space: nowrap;
  }
  .facility-dist {
    font-size: 13px;
    font-weight: 600;
    color: #0d9488;
    margin-bottom: 12px;
  }
  .facility-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 14px;
  }
  .facility-item label {
    display: block;
    font-size: 9.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #64748b;
    margin-bottom: 2px;
  }
  .facility-item span {
    font-size: 11.5px;
    color: #1e293b;
    word-break: break-all;
  }
  .score-section { margin-top: 12px; border-top: 1px solid #a5f3fc; padding-top: 12px; }
  .score-total {
    font-size: 18px;
    font-weight: 800;
    color: #0d9488;
    margin-bottom: 8px;
  }
  .score-row { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }
  .score-label { font-size: 10.5px; color: #64748b; width: 110px; flex-shrink: 0; }
  .score-bar-wrap { flex: 1; height: 5px; background: #e2e8f0; border-radius: 3px; overflow: hidden; }
  .score-bar { height: 100%; background: linear-gradient(90deg, #0d9488, #14b8a6); border-radius: 3px; }
  .score-val { font-size: 10.5px; font-weight: 700; color: #0d9488; width: 40px; text-align: right; }

  /* ── FOOTER ── */
  .footer {
    background: #0f766e;
    color: #ccfbf1;
    padding: 14px 30px;
    font-size: 9.5px;
    line-height: 1.8;
    text-align: center;
    margin-top: 20px;
  }
  .footer strong { color: #e2fefa; }

  /* ── PRINT RULES ── */
  @media print {
    body { background: #fff; }
    .page { box-shadow: none; width: 100%; min-height: auto; }

    /* Compact header fixed at the top of every printed page */
    .header {
      position: fixed;
      top: -52px;
      left: 0; right: 0;
      height: 52px;
      padding: 8px 24px;
      align-items: center;
    }
    .header-left h1 { font-size: 16px; }
    .header-left p  { font-size: 9px; margin-top: 1px; }
    .header-right   { font-size: 8px; line-height: 1.4; }

    /* Footer fixed at the bottom of every printed page */
    .footer {
      position: fixed;
      bottom: -36px;
      left: 0; right: 0;
      height: 36px;
      margin-top: 0;
      padding: 8px 20px;
      font-size: 8.5px;
      line-height: 1.4;
    }

    /* Prevent any block from splitting across a page break */
    .disclaimer     { page-break-inside: avoid; break-inside: avoid; }
    .section        { page-break-inside: avoid; break-inside: avoid; }
    .section-title  { page-break-after: avoid;  break-after: avoid; }
    .diagnosis-card { page-break-inside: avoid; break-inside: avoid; }
    .facility-card  { page-break-inside: avoid; break-inside: avoid; }
    .red-flags-box  { page-break-inside: avoid; break-inside: avoid; }
    .when-box       { page-break-inside: avoid; break-inside: avoid; }
    .two-col        { page-break-inside: avoid; break-inside: avoid; }
  }

  @page {
    size: A4;
    /* Top margin reserves space for the fixed header; bottom for the footer */
    margin: 52px 0 36px 0;
  }
</style>
</head>
<body>
<div class="page">

  <!-- HEADER -->
  <div class="header">
    <div class="header-left">
      <h1>MediFind</h1>
      <p>AI-Powered Symptom Analysis Report</p>
    </div>
    <div class="header-right">
      <div><strong>Generated:</strong> ${escHtml(now)}</div>
      <div><strong>Analysis engine:</strong> ${escHtml(source)}</div>
      <div><strong>Report ID:</strong> MF-${Date.now()}</div>
    </div>
  </div>

  <!-- DISCLAIMER -->
  <div class="disclaimer">
    <span class="icon">&#9888;</span>
    <div>
      <strong>Medical Disclaimer:</strong> This report is generated by AI and is intended for informational purposes ONLY.
      It is NOT a substitute for professional medical diagnosis, advice, or treatment.
      Always consult a qualified healthcare provider before making any medical decisions.<br/>
      <strong>Emergency India:</strong> 108 (Ambulance) &nbsp;|&nbsp; 112 (Police / Fire / Medical) &nbsp;|&nbsp; iCall Mental Health: 9152987821
    </div>
  </div>

  <div class="body">

    <!-- SYMPTOMS -->
    <div class="section">
      <div class="section-title">&#128203; Symptoms Reported</div>
      <div class="symptoms-box">
        "${escHtml(symptoms || 'Not recorded')}"
      </div>
    </div>

    <!-- DIAGNOSIS -->
    <div class="section">
      <div class="section-title">&#128203; Diagnosis</div>
      <div class="diagnosis-card">
        <div class="diagnosis-top">
          <div class="disease-name">${disease}</div>
          <div class="sev-badge">${escHtml((d.severity || 'mild').toUpperCase())}</div>
        </div>

        <div class="confidence-row">
          <span class="conf-label">AI Confidence</span>
          <div class="conf-track"><div class="conf-fill"></div></div>
          <span class="conf-pct">${conf}%</span>
        </div>

        <div class="meta-row">
          <div class="meta-pill urg-pill">
            <span>&#9200;</span> ${escHtml(urg.label)}
          </div>
          <div class="meta-pill spec-pill">
            <span>&#128203;</span> Specialist: <strong>${escHtml(spec)}</strong>
          </div>
        </div>

        <div class="description">${escHtml(d.description || 'No description available.')}</div>
      </div>
    </div>

    <!-- RECOMMENDATIONS + HOME CARE -->
    <div class="section two-col">
      <div class="col">
        <div class="section-title">&#10003; Recommendations</div>
        ${recList
          ? `<ul class="rec-list">${recList}</ul>`
          : '<p style="color:#94a3b8;font-size:12px">No recommendations listed.</p>'}
      </div>
      ${careList ? `
      <div class="col">
        <div class="section-title">&#127968; Home Care</div>
        <ul class="bullet-list">${careList}</ul>
      </div>` : ''}
    </div>

    <!-- RED FLAGS -->
    ${flagList ? `
    <div class="section">
      <div class="red-flags-box">
        <div class="flag-header">
          &#9888; WARNING SIGNS &mdash; Seek Emergency Help Immediately If Any of These Occur:
        </div>
        <ul>${flagList}</ul>
      </div>
    </div>` : ''}

    <!-- WHEN TO SEEK HELP -->
    ${d.whenToSeekHelp ? `
    <div class="section">
      <div class="section-title">&#128337; When to Seek Professional Help</div>
      <div class="when-box">${escHtml(d.whenToSeekHelp)}</div>
    </div>` : ''}

    <!-- DIFFERENTIAL DIAGNOSES -->
    ${diffList ? `
    <div class="section">
      <div class="section-title">&#128202; Other Conditions Considered</div>
      ${diffList}
    </div>` : ''}

    <!-- RECOMMENDED FACILITY -->
    <div class="section">
      <div class="section-title">&#127968; Recommended Medical Facility</div>
      <div class="facility-card">
        <div class="facility-top">
          <div class="facility-name">${escHtml(bm.name || 'Not found')}</div>
          ${bm.type ? `<div class="type-badge">${escHtml(bm.type.toUpperCase())}</div>` : ''}
        </div>
        ${bm.distanceKm != null ? `<div class="facility-dist">&#128205; ${bm.distanceKm} km away</div>` : ''}
        <div class="facility-grid">
          <div class="facility-item">
            <label>Phone</label>
            <span>${escHtml(bm.phone || 'Not listed')}</span>
          </div>
          <div class="facility-item">
            <label>Address</label>
            <span>${escHtml(bm.address || 'Not listed')}</span>
          </div>
          <div class="facility-item">
            <label>Opening Hours</label>
            <span>${escHtml(bm.openingHours || 'Not listed')}</span>
          </div>
          <div class="facility-item">
            <label>Map Link</label>
            <span>${escHtml(bm.osmMapUrl || 'N/A')}</span>
          </div>
        </div>
        <div class="score-section">
          <div class="score-total">Match Score: ${bm.matchScore ?? 0} / 100</div>
          ${scoreRows}
        </div>
      </div>
    </div>

  </div><!-- /body -->

  <!-- FOOTER -->
  <div class="footer">
    <strong>MediFind AI</strong> &nbsp;|&nbsp;
    This report is AI-generated and for informational purposes only &mdash; not a substitute for professional medical advice.<br/>
    <strong>Emergency:</strong> 108 (Ambulance) &nbsp;|&nbsp; 112 (All emergencies) &nbsp;|&nbsp;
    <strong>iCall Mental Health Helpline:</strong> 9152987821
  </div>

</div><!-- /page -->

<script>
  // Auto-trigger print so user can save as PDF immediately
  window.addEventListener('load', function() {
    setTimeout(function() { window.print(); }, 600);
  });
</script>
</body>
</html>`
}

export async function generatePDF({ diagnosis = {}, symptoms = '', bestMatch = {} }) {
  // Opens a styled A4 HTML page and auto-triggers window.print().
  // User chooses "Save as PDF" in the browser's print dialog.
  const html = buildHTML(diagnosis, symptoms, bestMatch)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url  = URL.createObjectURL(blob)
  const win  = window.open(url, '_blank')
  if (!win) {
    // Popup blocked — fallback: download the HTML file directly
    const a    = document.createElement('a')
    a.href     = url
    a.download = `MediFind-Report-${Date.now()}.html`
    a.click()
  }
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}
