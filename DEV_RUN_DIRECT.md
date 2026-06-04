# Run backend + frontend from a single browser address (dev)

This setup keeps your current React app, but proxies API calls through the React dev server so you can open just one URL in the browser.

---

## Mac / Linux

### 0) Start the database (Docker)
```bash
docker compose up -d
```
This starts MySQL 8.0 on port 3306 and auto-loads the schema on first run.
Wait for it to be healthy before starting the backend:
```bash
docker compose ps   # Status should show “healthy”
```

Or use the Makefile shortcut which waits automatically:
```bash
make db
```

### 1) Backend
```bash
cd backend
npm install
npm run dev
```
Backend listens on: **http://localhost:5000**

### 2) Frontend (with proxy)
Open a second terminal:
```bash
cd frontend
npm install
npm start
```
Frontend runs on: **http://localhost:3000**

Or start everything at once:
```bash
make dev
```

---

## Windows (PowerShell)

A `mophix.ps1` script is provided that mirrors the Makefile commands.

### One-time setup
Open PowerShell as your normal user and run:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Start everything at once
```powershell
.\mophix.ps1 dev
```
This starts the database, then opens the backend and frontend each in their own PowerShell window.

### Or step by step
```powershell
.\mophix.ps1 install    # install npm deps for backend + frontend
.\mophix.ps1 db         # start MySQL (waits until healthy)
.\mophix.ps1 backend    # start backend API  (http://localhost:5000)
.\mophix.ps1 frontend   # start React frontend  (http://localhost:3000)
```

### Stop everything
```powershell
.\mophix.ps1 stop
```

---

## What “single browser address” means here
- The React UI is at: `http://localhost:3000/`
- API calls made by the frontend go to `/api/v1/...` on the same host (3000)
- The React dev server proxies those requests to the backend on `http://localhost:5000`

## Quick test
- Open: `http://localhost:3000/`
- Check backend health: `http://localhost:5000/api/health`

## Notes
- If you use a different backend port, update the proxy in `frontend/package.json`.
- If CORS issues appear, set `CORS_ORIGIN=http://localhost:3000` in backend `.env`.

