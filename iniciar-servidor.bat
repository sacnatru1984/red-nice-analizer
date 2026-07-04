@echo off
title RedNICE — Servidor Local (manten abierto)
color 0A

echo.
echo  ==========================================
echo   RedNICE - Servidor de Sincronizacion
echo  ==========================================
echo.

cd /d "%~dp0scraper"

if not exist "node_modules" (
    echo  Instalando dependencias por primera vez...
    echo  (esto tarda ~2 minutos solo la primera vez)
    echo.
    call npm install
    call npx playwright install chromium
    echo.
)

echo  Servidor iniciando en http://localhost:7432
echo  Manten esta ventana abierta mientras usas la app.
echo  Para detener: presiona Ctrl+C
echo.

node server.js

echo.
echo  El servidor se detuvo.
pause >nul
