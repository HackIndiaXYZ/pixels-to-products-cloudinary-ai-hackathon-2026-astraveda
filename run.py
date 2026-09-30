import os
import sys
import subprocess
import time

if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def main():
    print("=" * 60)
    print("[STARTING] EduVision: Ed-Tech Dynamic Asset Engine")
    print("[TRACK 2] Cloudinary AI Hackathon 2026")
    print("=" * 60)

    # 1. Start FastAPI Backend in background
    print("\n[1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...")
    backend_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000"]
    )
    time.sleep(2)

    # 2. Start Streamlit Studio Frontend
    print("[2/2] Launching Streamlit Creator Studio on http://localhost:8501 ...")
    streamlit_process = subprocess.Popen(
        [sys.executable, "-m", "streamlit", "run", "frontend/app.py", "--server.port", "8501", "--server.headless", "true"]
    )

    print("\n[SUCCESS] EduVision is live!")
    print("👉 Frontend Studio UI: http://localhost:8501")
    print("👉 Backend API Swagger: http://127.0.0.1:8000/docs")
    print("👉 Backend Root Endpoint: http://127.0.0.1:8000")
    print("\nPress Ctrl+C to terminate both servers.")

    try:
        streamlit_process.wait()
    except KeyboardInterrupt:
        print("\nStopping EduVision servers...")
        backend_process.terminate()
        streamlit_process.terminate()
        print("Done.")

if __name__ == "__main__":
    main()
