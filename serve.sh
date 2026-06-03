#!/bin/bash
# Start GIYA local server (avoids "Address already in use" on 8080)
cd "$(dirname "$0")"
PORT="${1:-8765}"

if lsof -ti :"$PORT" >/dev/null 2>&1; then
  echo "Port $PORT is in use. Trying to free it..."
  lsof -ti :"$PORT" | xargs kill -9 2>/dev/null || true
  sleep 1
fi

echo ""
echo "  GIYA is running at:"
echo "  → http://127.0.0.1:$PORT/"
echo "  → http://127.0.0.1:$PORT/#business-academy"
echo ""
echo "  Press Ctrl+C to stop."
echo ""

python3 -m http.server "$PORT"
