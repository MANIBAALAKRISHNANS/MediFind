import { Router } from 'express'

import prisma from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { generateReportPDF } from '../utils/pdfReport.js'

const router = Router()

router.use(requireAuth)

// ── GET /api/history ──────────────────────────────────────────────────────────
// Cursor-based pagination (replaces offset-based to stay performant at scale).
//
// Query params:
//   cursor  — id of the LAST item returned by the previous page (omit for page 1)
//   limit   — items per page, 1–100, default 20
//
// Response:
//   { analyses: [...], nextCursor: string|null, hasMore: boolean }
//
// Client usage:
//   GET /api/history?limit=20          → first page
//   GET /api/history?cursor=<id>&limit=20 → next page (use nextCursor from prev response)

router.get('/', async (req, res, next) => {
  const limit  = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20))
  const cursor = req.query.cursor ?? null   // UUID of the last seen item

  // Fetch one extra record to determine whether more pages exist
  const take = limit + 1

  try {
    const [analyses, total] = await Promise.all([
      prisma.analysis.findMany({
        where:   { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        take,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      }),
      // Only run the count on the first page (no cursor) to avoid redundant DB work
      cursor ? Promise.resolve(null) : prisma.analysis.count({ where: { userId: req.user.id } }),
    ])

    const hasMore    = analyses.length > limit
    const page       = hasMore ? analyses.slice(0, limit) : analyses
    const nextCursor = hasMore ? page[page.length - 1].id : null

    return res.json({ analyses: page, nextCursor, hasMore, ...(total !== null ? { total } : {}) })
  } catch (err) {
    return next(err)
  }
})

// ── GET /api/history/:id ──────────────────────────────────────────────────────

router.get('/:id', async (req, res, next) => {
  try {
    const analysis = await prisma.analysis.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    })

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found.', code: 'NOT_FOUND' })
    }

    return res.json(analysis)
  } catch (err) {
    return next(err)
  }
})

// ── DELETE /api/history/:id ───────────────────────────────────────────────────

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await prisma.analysis.deleteMany({
      where: { id: req.params.id, userId: req.user.id },
    })

    if (deleted.count === 0) {
      return res.status(404).json({ error: 'Analysis not found.', code: 'NOT_FOUND' })
    }

    return res.json({ message: 'Deleted.' })
  } catch (err) {
    return next(err)
  }
})

// ── GET /api/history/:id/pdf ──────────────────────────────────────────────────

router.get('/:id/pdf', async (req, res, next) => {
  try {
    const analysis = await prisma.analysis.findFirst({
      where:   { id: req.params.id, userId: req.user.id },
      include: { user: { select: { name: true, email: true } } },
    })

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found.', code: 'NOT_FOUND' })
    }

    generateReportPDF(analysis, res)
  } catch (err) {
    return next(err)
  }
})

export default router
