import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine, Base, SessionLocal
from .seed import seed_database
from .routers import (
    dashboard,
    products,
    sales,
    purchases,
    customers,
    suppliers,
    expenses,
    reports,
    fiscal
)

# Ensure tables and initial seed data exist
Base.metadata.create_all(bind=engine)
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title="DRC Smart POS API",
    description="Point of Sale & Business Management Platform for the Democratic Republic of Congo",
    version="1.0.0"
)

# Enable CORS for Vite dev server and localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoint
@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "DRC Smart POS Backend",
        "version": "1.0.0",
        "environment": "demo-local"
    }

# Register API Routers under /api/v1
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(products.router, prefix="/api/v1")
app.include_router(sales.router, prefix="/api/v1")
app.include_router(purchases.router, prefix="/api/v1")
app.include_router(customers.router, prefix="/api/v1")
app.include_router(suppliers.router, prefix="/api/v1")
app.include_router(expenses.router, prefix="/api/v1")
app.include_router(reports.router, prefix="/api/v1")
app.include_router(fiscal.router, prefix="/api/v1")

# Mount built frontend SPA if frontend/dist exists
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")
