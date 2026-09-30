@echo off
cd /d "%~dp0"
title EduVision Launcher
echo =========================================================
echo  Starting EduVision Studio
echo  Cloudinary AI Hackathon 2026 - Track 2 (ASTRAVEDA)
echo =========================================================

echo [1/2] Launching FastAPI Backend on http://127.0.0.1:8000 ...
start "EduVision Backend (Port 8000)" cmd /k "python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000"

ping 127.0.0.1 -n 3 >nul

echo [2/2] Launching Next.js Creative Studio on http://localhost:3000 ...
start "EduVision Studio Frontend (Port 3000)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo =========================================================
echo  EduVision is Starting!
echo  👉 Next.js UI:     http://localhost:3000
echo  👉 Backend Docs:   http://127.0.0.1:8000/docs
echo =========================================================
