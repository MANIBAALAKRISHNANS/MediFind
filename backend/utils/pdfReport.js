import PDFDocument from 'pdfkit'

// ── Palette ───────────────────────────────────────────────────────────────────
const TEAL       = '#0D9488'
const DARK       = '#1E293B'
const GRAY       = '#64748B'
const LIGHT_GRAY = '#F1F5F9'
const BORDER_GRAY= '#E2E8F0'
const RED_LIGHT  = '#FEF2F2'
const RED_TEXT   = '#DC2626'
const GREEN      = '#16A34A'
const ORANGE     = '#EA580C'

const SEVERITY_COLOR = { mild: GREEN, moderate: ORANGE, severe: RED_TEXT }

const URGENCY_LABELS = {
  'self-care':        'Self-Care - manageable at home',
  'see-doctor-soon':  'See a Doctor Soon - within the next few days',
  'see-doctor-today': 'See a Doctor Today - do not delay',
  'see-doctor':       'See a Doctor - schedule an appointment',
  'emergency':        'EMERGENCY - seek immediate medical attention',
}
const URGENCY_COLOR = {
  'self-care':        GREEN,
  'see-doctor-soon':  ORANGE,
  'see-doctor-today': RED_TEXT,
  'see-doctor':       ORANGE,
  'emergency':        RED_TEXT,
}

function formatDate(date) {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function hRule(doc, y, color = BORDER_GRAY, weight = 1) {
  const margin = 60
  doc
    .moveTo(margin, y)
    .lineTo(doc.page.width - margin, y)
    .strokeColor(color)
    .lineWidth(weight)
    .stroke()
}

function filledRect(doc, x, y, w, h, color) {
  doc.save().rect(x, y, w, h).fill(color).restore()
}

function sectionTitle(doc, label, usableW) {
  doc.moveDown(0.8)
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor(TEAL)
    .text(label.toUpperCase(), 60, doc.y)
  hRule(doc, doc.y + 2)
  doc.moveDown(0.7)
}

function bulletLine(doc, text, color, usableW) {
  const x     = 72
  const textX = 84
  const y     = doc.y
  doc.font('Helvetica-Bold').fontSize(10).fillColor(color)
     .text('•', x, y, { lineBreak: false })
  doc.font('Helvetica').fillColor(color)
     .text(text, textX, y, { width: usableW - (textX - 60) })
}

// ── Main export ───────────────────────────────────────────────────────────────

export function generateReportPDF(analysis, res) {
  const MARGIN  = 60
  const doc     = new PDFDocument({ bufferPages: true, size: 'A4', margin: MARGIN })
  const usableW = doc.page.width - MARGIN * 2

  // Set response headers before piping
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="MediFind-Report-${analysis.id.slice(0, 8)}.pdf"`,
  )
  doc.pipe(res)

  // ── PAGE 1 HEADER ─────────────────────────────────────────────────────────
  doc
    .font('Helvetica-Bold').fontSize(30).fillColor(TEAL)
    .text('MEDIFIND', MARGIN, MARGIN)

  doc
    .font('Helvetica').fontSize(12).fillColor(GRAY)
    .text('AI Symptom Analysis Report', MARGIN, MARGIN + 36)

  hRule(doc, MARGIN + 58, TEAL, 2)

  // ── METADATA ──────────────────────────────────────────────────────────────
  const metaTop = MARGIN + 74
  const metaRows = [
    ['Patient',    analysis.user?.name  ?? 'Unknown'],
    ['Email',      analysis.user?.email ?? '—'],
    ['Report ID',  analysis.id.slice(0, 8).toUpperCase()],
    ['Generated',  formatDate(analysis.createdAt)],
  ]
  metaRows.forEach(([label, value], i) => {
    const y = metaTop + i * 16
    doc.font('Helvetica').fontSize(10).fillColor(GRAY).text(`${label}: `, MARGIN, y, { continued: true })
    doc.font('Helvetica-Bold').fillColor(DARK).text(value)
  })

  doc.y = metaTop + metaRows.length * 16 + 10

  // ── SECTION 1: SYMPTOMS ───────────────────────────────────────────────────
  sectionTitle(doc, 'Symptoms Reported', usableW)

  const sympText = analysis.symptoms
  doc.font('Helvetica').fontSize(11)
  const sympH = doc.heightOfString(sympText, { width: usableW - 24 }) + 24
  const sympY = doc.y

  filledRect(doc, MARGIN, sympY, usableW, sympH, LIGHT_GRAY)
  doc.font('Helvetica').fontSize(11).fillColor(DARK)
    .text(sympText, MARGIN + 12, sympY + 12, { width: usableW - 24 })
  doc.y = sympY + sympH + 6

  // ── SECTION 2: AI DIAGNOSIS ───────────────────────────────────────────────
  sectionTitle(doc, 'AI Diagnosis', usableW)

  // Disease
  doc.font('Helvetica-Bold').fontSize(22).fillColor(DARK)
    .text(analysis.disease ?? '—', MARGIN, doc.y)
  doc.moveDown(0.45)

  // Specialty
  doc.font('Helvetica').fontSize(11).fillColor(GRAY)
    .text('Recommended Specialty:  ', MARGIN, doc.y, { continued: true })
  doc.font('Helvetica-Bold').fillColor(TEAL)
    .text((analysis.specialty ?? '—').toUpperCase())
  doc.moveDown(0.35)

  // Severity
  const sevColor = SEVERITY_COLOR[analysis.severity] ?? GRAY
  doc.font('Helvetica').fontSize(11).fillColor(GRAY)
    .text('Severity:  ', MARGIN, doc.y, { continued: true })
  doc.font('Helvetica-Bold').fillColor(sevColor)
    .text(
      analysis.severity
        ? analysis.severity.charAt(0).toUpperCase() + analysis.severity.slice(1)
        : '—',
    )
  doc.moveDown(0.35)

  // Urgency
  const urgColor = URGENCY_COLOR[analysis.urgency] ?? GRAY
  doc.font('Helvetica').fontSize(11).fillColor(GRAY)
    .text('Urgency:  ', MARGIN, doc.y, { continued: true })
  doc.font('Helvetica-Bold').fillColor(urgColor)
    .text(URGENCY_LABELS[analysis.urgency] ?? analysis.urgency ?? '—')
  doc.moveDown(0.6)

  // Description
  if (analysis.description) {
    doc.font('Helvetica').fontSize(11).fillColor(DARK)
      .text(analysis.description, MARGIN, doc.y, { width: usableW })
    doc.moveDown(0.8)
  }

  // Recommendations
  if (analysis.recommendations?.length) {
    doc.font('Helvetica-Bold').fontSize(12).fillColor(DARK)
      .text('Recommendations', MARGIN, doc.y)
    doc.moveDown(0.3)
    for (const rec of analysis.recommendations) {
      bulletLine(doc, rec, DARK, usableW)
    }
    doc.moveDown(0.6)
  }

  // Red Flags
  if (analysis.redFlags?.length) {
    doc.font('Helvetica-Bold').fontSize(12).fillColor(RED_TEXT)
      .text('! Red Flags - Seek immediate help if you notice:', MARGIN, doc.y)
    doc.moveDown(0.3)

    // Calculate box height before drawing
    doc.font('Helvetica').fontSize(10)
    let rfBoxH = 16
    for (const flag of analysis.redFlags) {
      rfBoxH += doc.heightOfString('•  ' + flag, { width: usableW - 20 }) + 3
    }

    const rfY = doc.y
    filledRect(doc, MARGIN, rfY, usableW, rfBoxH, RED_LIGHT)
    doc.y = rfY + 8
    for (const flag of analysis.redFlags) {
      bulletLine(doc, flag, RED_TEXT, usableW)
    }
    doc.y = rfY + rfBoxH + 6
  }

  // ── SECTION 3: RECOMMENDED FACILITY ──────────────────────────────────────
  if (analysis.matchName) {
    sectionTitle(doc, 'Recommended Facility', usableW)

    doc.font('Helvetica-Bold').fontSize(16).fillColor(DARK)
      .text(analysis.matchName, MARGIN, doc.y)
    doc.moveDown(0.4)

    const fields = [
      ['Type',     analysis.matchType],
      ['Address',  analysis.matchAddress],
      ['Phone',    analysis.matchPhone],
      ['Distance', analysis.matchDistanceKm != null ? `${analysis.matchDistanceKm} km away` : null],
      ['Website',  analysis.matchWebsite],
    ]

    for (const [label, value] of fields) {
      if (!value) continue
      doc.font('Helvetica').fontSize(11).fillColor(GRAY)
        .text(`${label}:  `, MARGIN, doc.y, { continued: true })
      if (label === 'Website') {
        doc.font('Helvetica-Bold').fillColor(TEAL)
          .text(value, { link: value, underline: true })
      } else {
        doc.font('Helvetica-Bold').fillColor(DARK).text(value)
      }
    }

    // Match score bar
    if (analysis.matchScore != null) {
      doc.moveDown(0.6)
      doc.font('Helvetica').fontSize(10).fillColor(GRAY)
        .text(`Match Score: ${analysis.matchScore} / 100`, MARGIN, doc.y)
      doc.moveDown(0.25)

      const barY  = doc.y
      const barW  = Math.min(usableW, 280)
      const fillW = Math.round((analysis.matchScore / 100) * barW)
      filledRect(doc, MARGIN, barY, barW, 8, BORDER_GRAY)
      filledRect(doc, MARGIN, barY, fillW, 8, TEAL)
      doc.y = barY + 16
    }

    // OSM map link
    if (analysis.matchOsmMapUrl) {
      doc.moveDown(0.3)
      doc.font('Helvetica').fontSize(10).fillColor(TEAL)
        .text('View on OpenStreetMap →', MARGIN, doc.y, {
          link: analysis.matchOsmMapUrl,
          underline: true,
        })
    }
  }

  // ── MEDICAL DISCLAIMER (last page bottom) ─────────────────────────────────
  // Rendered at fontSize 8 (same as footer) so it stays compact.
  // If it won't fit before the footer zone, push to a fresh page.
  doc.moveDown(1.5)

  const disclaimerText =
    'MEDICAL DISCLAIMER: This report was generated by an AI system and is intended for ' +
    'informational purposes only. It does not constitute medical advice, diagnosis, or treatment. ' +
    'Always consult a qualified healthcare professional for any medical concerns. In a medical ' +
    'emergency, call your local emergency services immediately. MediFind and its operators accept ' +
    'no liability for actions taken based on this report.'

  const FOOTER_ZONE = doc.page.height - MARGIN - 15   // same value used in footer loop
  const DISCLAIMER_GAP = 20                           // min gap between disclaimer and footer

  doc.font('Helvetica').fontSize(8)
  const dH = doc.heightOfString(disclaimerText, { width: usableW - 24 }) + 20

  // Not enough room before the footer — start a fresh page
  if (doc.y + dH > FOOTER_ZONE - DISCLAIMER_GAP) {
    doc.addPage()
    doc.moveDown(1)
  }

  const dY = doc.y
  filledRect(doc, MARGIN, dY, usableW, dH, LIGHT_GRAY)
  doc.font('Helvetica').fontSize(8).fillColor(GRAY)
    .text(disclaimerText, MARGIN + 12, dY + 10, { width: usableW - 24 })

  // ── FOOTERS (all pages, added last via bufferedPageRange) ─────────────────
  const total        = doc.bufferedPageRange().count
  const supportEmail = process.env.SUPPORT_EMAIL ?? 'medifindofficial@gmail.com'

  for (let i = 0; i < total; i++) {
    doc.switchToPage(i)
    const footerY = doc.page.height - MARGIN - 15

    hRule(doc, footerY - 10, BORDER_GRAY, 0.5)

    doc.font('Helvetica').fontSize(8).fillColor(GRAY)
      .text(`MediFind — Support: ${supportEmail}`, MARGIN, footerY, { width: usableW / 2 })

    doc.font('Helvetica').fontSize(8).fillColor(GRAY)
      .text(`Page ${i + 1} of ${total}`, MARGIN, footerY, { width: usableW, align: 'right' })

    // Reset y so the next switchToPage doesn't see a position past maxY
    // and accidentally trigger an addPage() before writing the next footer.
    doc.y = footerY
  }

  doc.flushPages()
  doc.end()
}
