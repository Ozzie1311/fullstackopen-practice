

@echo off
color 0a
echo ===============================================================
echo SCRIPT REALIZADO POR OSWALDO RODRIGUEZ
echo AGILIZANDO SOLUCION DE PUNTO DE VENTA
echo ===============================================================

cd /d "C:\VPosUniversal_3.15.6"

echo estoy en 
cd

call DesinstalacionVPOSREST.bat

echo.

echo Iniciando INSTALACION en 2 segundos...
timeout /t 3 >nul
call InstalacionVPOSREST.bat
