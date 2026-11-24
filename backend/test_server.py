import threading
import time
import urllib.request
import json
import uvicorn
from app.main import app

def run_server():
    config = uvicorn.Config(app, host="127.0.0.1", port=8000, log_level="warning")
    server = uvicorn.Server(config)
    server.run()

if __name__ == "__main__":
    t = threading.Thread(target=run_server, daemon=True)
    t.start()
    time.sleep(1.5)

    print("--- 1. Testing /api/v1/health ---")
    with urllib.request.urlopen("http://127.0.0.1:8000/api/v1/health") as res:
        data = json.loads(res.read().decode())
        print("Response:", data)
        assert data["status"] == "healthy"

    print("\n--- 2. Testing /api/v1/dashboard/summary ---")
    with urllib.request.urlopen("http://127.0.0.1:8000/api/v1/dashboard/summary") as res:
        data = json.loads(res.read().decode())
        print("Revenue:", data["total_revenue"], "USD, Transactions:", data["today_transactions_count"])
        assert data["total_revenue"] > 0

    print("\n--- 3. Testing / (Frontend SPA Mount) ---")
    with urllib.request.urlopen("http://127.0.0.1:8000/") as res:
        html = res.read().decode()
        print("Frontend HTML length:", len(html), "bytes")
        assert "DRC Smart POS" in html
        assert "<div id=\"root\"></div>" in html

    print("\n--- 4. Testing /api/v1/products ---")
    with urllib.request.urlopen("http://127.0.0.1:8000/api/v1/products") as res:
        prods = json.loads(res.read().decode())
        print("Products count:", len(prods))
        assert len(prods) >= 12

    print("\n=======================================================")
    print("LIVE FASTAPI + REACT SPA UNIFIED SERVER PROBE SUCCEEDED!")
    print("=======================================================")
