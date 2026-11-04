#!/usr/bin/env bash
# Runs a test command and saves its full terminal output (start to finish) to
# a timestamped file under reports/logs/, while still printing it live.
set -o pipefail

RUN_NAME="$1"
shift

mkdir -p reports/logs
LOG_FILE="reports/logs/test-${RUN_NAME}-$(date +%Y%m%d-%H%M%S).log"

echo "Logging this run to ${LOG_FILE}"

"$@" 2>&1 | tee "$LOG_FILE"
exit "${PIPESTATUS[0]}"
