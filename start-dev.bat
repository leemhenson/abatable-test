@echo off
echo Starting Carbon Portfolio Development Environment...
echo.

start "Backend Server" cmd /k "cd backend && npm run dev"
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Backend and Frontend servers are starting in separate windows...
echo Backend: http://localhost:4000
echo Frontend: http://localhost:8080
echo.
echo Press any key to close this window (servers will keep running)
pause >nul
