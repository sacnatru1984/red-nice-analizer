@echo off
title RedNICE — Actualizar datos desde Backoffice
color 0A

echo.
echo  ====================================
echo   RedNICE — Actualizacion de datos
echo  ====================================
echo.

cd /d "%~dp0scraper"

:: Verificar si node_modules existe
if not exist "node_modules" (
    echo  Instalando dependencias por primera vez...
    echo  (esto tarda ~2 minutos solo la primera vez)
    echo.
    call npm install
    call npx playwright install chromium
    echo.
)

echo  Iniciando scraper...
echo.
node scraper.js

echo.
echo  Presiona cualquier tecla para cerrar.
pause >nul
