# Run backend + frontend from a single browser address (dev)

This setup keeps your current React app, but proxies API calls through the React dev server so you can open just one URL in the browser.

## 1) Backend
1. Open a terminal
2. Run:

```bat
cd backend
npm install
npm run dev
```

Backend listens on: **http://localhost:5000**

## 2) Frontend (with proxy)
1. Open a second terminal
2. Run:

```bat
cd frontend
npm install
npm start
```

Frontend runs on: **http://localhost:3000**

## 3) What “single browser address” means here
- The React UI is at: `http://localhost:3000/`
- API calls made by the frontend go to `/api/v1/...` on the same host (3000)
- The React dev server proxies those requests to the backend on `http://localhost:5000`

## 4) Quick test
- Open: `http://localhost:3000/`
- Check backend health from backend terminal:
  - `http://localhost:5000/api/health`

## Notes
- If you use a different backend port, update the proxy in `frontend/package.json`.
- If CORS issues appear, set `CORS_ORIGIN=http://localhost:3000` in backend `.env`.

