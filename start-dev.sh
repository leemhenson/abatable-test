#!/bin/bash

# Start both backend and frontend in development mode

echo "🚀 Starting Carbon Portfolio Development Environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to cleanup on exit
cleanup() {
  echo ""
  echo "Shutting down servers..."
  kill $(jobs -p) 2>/dev/null
  exit
}

trap cleanup SIGINT SIGTERM

# Start backend
(
  cd backend
  echo -e "${GREEN}[BACKEND]${NC} Starting on http://localhost:4000"
  npm run dev 2>&1 | while IFS= read -r line; do
    echo -e "${GREEN}[BACKEND]${NC} $line"
  done
) &

# Start frontend (from root directory)
(
  echo -e "${BLUE}[FRONTEND]${NC} Starting on http://localhost:8080"
  npm run dev 2>&1 | while IFS= read -r line; do
    echo -e "${BLUE}[FRONTEND]${NC} $line"
  done
) &

# Wait for both processes
wait
