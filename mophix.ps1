# Mophix Studio - Windows Developer Script
# Usage: .\mophix.ps1 [command]
# Run in PowerShell from the project root directory.
#
# If you get "cannot be loaded because running scripts is disabled", run once:
#   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

param(
    [Parameter(Position = 0)]
    [string]$Command = "help"
)

$Root = $PSScriptRoot

function Write-Header { Write-Host "`n  Mophix Studio" -ForegroundColor Cyan }

function Show-Help {
    Write-Header
    Write-Host ""
    Write-Host "  .\mophix.ps1 install     Install all dependencies (backend + frontend)"
    Write-Host "  .\mophix.ps1 db          Start MySQL database (Docker)"
    Write-Host "  .\mophix.ps1 db-stop     Stop the database container"
    Write-Host "  .\mophix.ps1 db-reset    Wipe database volume and recreate from schema"
    Write-Host "  .\mophix.ps1 backend     Start backend API (dev mode)"
    Write-Host "  .\mophix.ps1 frontend    Start React frontend"
    Write-Host "  .\mophix.ps1 dev         Start database + backend + frontend (new windows)"
    Write-Host "  .\mophix.ps1 stop        Stop database and all Node processes"
    Write-Host "  .\mophix.ps1 logs        Tail database container logs"
    Write-Host ""
}

function Wait-DbHealthy {
    Write-Host "Waiting for database to be healthy..." -ForegroundColor Yellow
    $attempts = 0
    while ($attempts -lt 30) {
        $status = docker compose ps 2>&1
        if ($status -match "healthy") {
            Write-Host "Database is ready." -ForegroundColor Green
            return
        }
        Start-Sleep -Seconds 2
        $attempts++
    }
    Write-Host "Warning: database health check timed out." -ForegroundColor Red
}

function Invoke-Install {
    Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
    Set-Location "$Root\backend"
    npm install
    Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
    Set-Location "$Root\frontend"
    npm install
    Set-Location $Root
    Write-Host "Done." -ForegroundColor Green
}

function Start-DB {
    Set-Location $Root
    Write-Host "Starting database..." -ForegroundColor Cyan
    docker compose up -d
    Wait-DbHealthy
}

function Stop-DB {
    Set-Location $Root
    Write-Host "Stopping database..." -ForegroundColor Cyan
    docker compose stop
    Write-Host "Database stopped." -ForegroundColor Green
}

function Reset-DB {
    Set-Location $Root
    Write-Host "Resetting database (all data will be wiped)..." -ForegroundColor Yellow
    docker compose down -v
    docker compose up -d
    Wait-DbHealthy
    Write-Host "Fresh database is ready." -ForegroundColor Green
}

function Start-Backend {
    Set-Location "$Root\backend"
    npm run dev
}

function Start-Frontend {
    Set-Location "$Root\frontend"
    npm start
}

function Start-Dev {
    Start-DB

    Write-Host "Opening backend in a new window..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\backend'; npm run dev"

    Write-Host "Opening frontend in a new window..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\frontend'; npm start"

    Write-Host ""
    Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Green
    Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Green
    Write-Host ""
    Write-Host "Close the backend and frontend windows to stop them," -ForegroundColor Yellow
    Write-Host "or run:  .\mophix.ps1 stop" -ForegroundColor Yellow
}

function Stop-All {
    Write-Host "Stopping database..." -ForegroundColor Cyan
    Set-Location $Root
    docker compose stop

    Write-Host "Stopping Node processes (nodemon / react-scripts)..." -ForegroundColor Cyan
    Get-WmiObject Win32_Process | Where-Object {
        $_.CommandLine -match "nodemon" -or $_.CommandLine -match "react-scripts"
    } | ForEach-Object {
        Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
    }
    Write-Host "All services stopped." -ForegroundColor Green
}

function Show-Logs {
    Set-Location $Root
    docker compose logs -f db
}

# ── dispatch ──────────────────────────────────────────────────────────────────
switch ($Command.ToLower()) {
    "help"     { Show-Help }
    "install"  { Invoke-Install }
    "db"       { Start-DB }
    "db-stop"  { Stop-DB }
    "db-reset" { Reset-DB }
    "backend"  { Start-Backend }
    "frontend" { Start-Frontend }
    "dev"      { Start-Dev }
    "stop"     { Stop-All }
    "logs"     { Show-Logs }
    default {
        Write-Host "Unknown command: $Command" -ForegroundColor Red
        Show-Help
        exit 1
    }
}
