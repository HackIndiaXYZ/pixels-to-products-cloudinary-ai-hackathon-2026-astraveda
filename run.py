import os
import sys
import subprocess
import time
import webbrowser

def main():
    print("=" * 60)
    print("🚀 Starting EduVision: Ed-Tech Dynamic Asset Engine")
    print("🏆 Cloudinary AI Hackathon 2026 (Track 2)")
    print("=" * 60)

    # 1. Start FastAPI Backend in background
    print("\n[1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...")
    backend_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    time.sleep(2)

    # 2. Start Streamlit Studio Frontend
    print("[2/2] Launching Streamlit Creator Studio on http://localhost:8501 ...")
    streamlit_process = subprocess.Popen(
        [sys.executable, "-m", "streamlit", "run", "frontend/app.py", "--server.port", "8501", "--server.headless", "false"]
    )

    print("\n✨ EduVision is live!")
    print("👉 Frontend Studio: http://localhost:8501")
    print("👉 Backend API Docs: http://127.0.0.1:8000/docs")
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
