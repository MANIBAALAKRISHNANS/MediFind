#!/usr/bin/env bash
# scripts/run-tests.sh — local test runner for developers.
# Runs the backend test suite and the frontend unit test suite, reports
# pass/fail for each, and exits non-zero if either failed (so it composes
# with a pre-push hook or CI step).
#
# Requires: a reachable Postgres database for the backend tests — set
# DATABASE_URL (backend/.env) to point at one before running this.
#
# Usage:
#   ./scripts/run-tests.sh              # backend + frontend
#   ./scripts/run-tests.sh --security   # also run the security review
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

RUN_SECURITY=false
for arg in "$@"; do
  case "$arg" in
    --security) RUN_SECURITY=true ;;
  esac
done

RESULTS=()
OVERALL_STATUS=0

run_suite() {
  local label="$1"
  local dir="$2"
  local cmd="$3"

  echo ""
  echo "────────────────────────────────────────────────────────────"
  echo "▶ $label"
  echo "────────────────────────────────────────────────────────────"

  if (cd "$dir" && eval "$cmd"); then
    RESULTS+=("✅ $label")
  else
    RESULTS+=("❌ $label")
    OVERALL_STATUS=1
  fi
}

run_suite "Backend tests (node --test)"        "$ROOT_DIR/backend"      "npm test"
run_suite "Frontend unit tests (vitest)"       "$ROOT_DIR/frontend-web" "npm test"

if [ "$RUN_SECURITY" = true ]; then
  run_suite "Security review" "$ROOT_DIR" "node scripts/security-review.js"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "Summary"
echo "════════════════════════════════════════════════════════════"
for r in "${RESULTS[@]}"; do
  echo "  $r"
done
echo ""

if [ "$OVERALL_STATUS" -eq 0 ]; then
  echo "✅ All suites passed."
else
  echo "❌ One or more suites failed — see output above."
fi

echo ""
echo "Not run by default (need a running backend server first):"
echo "  BASE_URL=http://localhost:5000 node scripts/load-test.js"
echo "  cd frontend-web && npm run test:e2e"

exit $OVERALL_STATUS
