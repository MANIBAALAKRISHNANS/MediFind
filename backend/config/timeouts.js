// Cross-file timeout invariants. Kept here (rather than as inline literals in
// server.js and routes/findDoctor.js) so the two can't silently drift apart —
// routes/findDoctor.js's Overpass retry budget (worst case:
// OVERPASS_TIMEOUT_MS + TIMEOUT_RETRY_TIMEOUT_MS) must always stay under this,
// or the socket gets cut before a graceful JSON error can be sent. See
// backend/test/findDoctor.test.js's "worst-case latency" assertion.

/**
 * Hard timeout on the HTTP server's underlying socket. Ensures the server
 * always responds before the frontend's 30s axios timeout drops the
 * connection (which would show as a raw "socket closed unexpectedly" instead
 * of a proper error response).
 */
export const SERVER_SOCKET_TIMEOUT_MS = 28_000
