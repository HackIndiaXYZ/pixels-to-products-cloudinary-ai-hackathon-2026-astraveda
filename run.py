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
    print("=" * 65)
    print("[STARTING] EduVision: AI Visual Studio for Education")
    print("[TECH STACK] Next.js + TypeScript + Tailwind + FastAPI + Cloudinary")
    print("[TRACK 02] Cloudinary AI Hackathon 2026 (ASTRAVEDA)")
    print("=" * 65)

    # 1. Start FastAPI Backend in background
    print("\n[1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...")
    backend_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000"]
    )
    time.sleep(2)

    # 2. Start Next.js Studio Frontend
    print("[2/2] Launching Next.js Creative Studio on http://localhost:3000 ...")
    frontend_dir = os.path.join(os.path.dirname(__file__), "frontend")
    
    # Check if npm is available
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    
    frontend_process = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=frontend_dir
    )

    print("\n" + "=" * 65)
    print("[SUCCESS] EduVision Studio is Live!")
    print("👉 Next.js Studio UI:        http://localhost:3000")
    print("👉 FastAPI Backend Swagger:   http://127.0.0.1:8000/docs")
    print("👉 FastAPI Health Probe:      http://127.0.0.1:8000/api/health")
    print("=" * 65)
    print("\nPress Ctrl+C to terminate both servers.")

    try:
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\nStopping EduVision servers...")
        backend_process.terminate()
        frontend_process.terminate()
        print("Done.")

if __name__ == "__main__":
    main()
