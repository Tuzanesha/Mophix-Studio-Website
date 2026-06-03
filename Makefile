.PHONY: help install db db-stop db-reset backend frontend dev stop logs

# ──────────────────────────────────────────────
#  Default: show help
# ──────────────────────────────────────────────
help:
	@echo ""
	@echo "  Mophix Studio — available commands"
	@echo ""
	@echo "  make install     Install all dependencies (backend + frontend)"
	@echo "  make db          Start MySQL database (Docker)"
	@echo "  make db-stop     Stop the database container"
	@echo "  make db-reset    Wipe database volume and recreate from schema"
	@echo "  make backend     Start backend API (dev mode with nodemon)"
	@echo "  make frontend    Start React frontend"
	@echo "  make dev         Start database + backend + frontend together"
	@echo "  make stop        Stop all running services"
	@echo "  make logs        Tail database container logs"
	@echo ""

# ──────────────────────────────────────────────
#  Dependencies
# ──────────────────────────────────────────────
install:
	cd backend && npm install
	cd frontend && npm install

# ──────────────────────────────────────────────
#  Database
# ──────────────────────────────────────────────
db:
	docker compose up -d
	@echo "Waiting for database to be healthy..."
	@until docker compose ps | grep -q "healthy"; do sleep 2; done
	@echo "Database is ready."

db-stop:
	docker compose stop

db-reset:
	docker compose down -v
	docker compose up -d
	@echo "Waiting for database to be healthy..."
	@until docker compose ps | grep -q "healthy"; do sleep 2; done
	@echo "Fresh database is ready."

logs:
	docker compose logs -f db

# ──────────────────────────────────────────────
#  Backend
# ──────────────────────────────────────────────
backend:
	cd backend && npm run dev

# ──────────────────────────────────────────────
#  Frontend
# ──────────────────────────────────────────────
frontend:
	cd frontend && npm start

# ──────────────────────────────────────────────
#  Run everything (each in its own terminal tab)
# ──────────────────────────────────────────────
dev: db
	@echo "Starting backend and frontend..."
	@make -j2 backend frontend

# ──────────────────────────────────────────────
#  Stop everything
# ──────────────────────────────────────────────
stop:
	docker compose stop
	@pkill -f "nodemon server.js" 2>/dev/null || true
	@pkill -f "react-scripts start" 2>/dev/null || true
	@echo "All services stopped."
