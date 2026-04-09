@echo off
REM Engram Connection Script for Qwen Code
REM Uso: engram-connect.bat [search_query]
REM Ejemplo: engram-connect.bat "freecloud arquitectura"

set ENGRAM_PATH=C:\tools\engram\engram.exe

REM Verificar que existe
if not exist "%ENGRAM_PATH%" (
    echo ERROR: Engram no encontrado en %ENGRAM_PATH%
    echo Instala engram.exe primero. Ver docs/engram-setup.md
    exit /b 1
)

REM Verificar versión
echo [Engram] Conectando...
"%ENGRAM_PATH%" version

REM Si hay argumento, buscar
if "%1"=="" (
    echo.
    echo [Engram] Mostrando contexto del proyecto...
    "%ENGRAM_PATH%" context
) else (
    echo.
    echo [Engram] Buscando: %*
    "%ENGRAM_PATH%" search %*
)
