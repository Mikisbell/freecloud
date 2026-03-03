# GGA Review Script — Guardian Angel
# Revisa el diff staged contra las reglas de AGENTS.md usando GitHub Models API
# Uso: .\scripts\gga-review.ps1
#
# REQUISITO: GITHUB_TOKEN en .env.local (o como variable de entorno)
# Crear token en: https://github.com/settings/tokens
# Solo necesita scope: (ninguno especial — acceso público basta para Models API)

param(
    [string]$ApiKey = $env:GITHUB_TOKEN,
    [string]$Model = "gpt-4o-mini"
)

# --- Cargar .env.local si existe ---
$envFile = Join-Path $PSScriptRoot "..\\.env.local"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^\s*([^#][^=]+)=(.*)$") {
            $name = $Matches[1].Trim()
            $value = $Matches[2].Trim()
            if (-not [System.Environment]::GetEnvironmentVariable($name)) {
                [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
            }
        }
    }
    if (-not $ApiKey) { $ApiKey = $env:GITHUB_TOKEN }
}

# --- Validaciones ---
if (-not $ApiKey) {
    Write-Host "❌ ERROR: GITHUB_TOKEN no encontrado." -ForegroundColor Red
    Write-Host ""
    Write-Host "  1. Ir a: https://github.com/settings/tokens" -ForegroundColor Yellow
    Write-Host "  2. Crear un token (classic o fine-grained, sin scopes especiales)" -ForegroundColor Yellow
    Write-Host "  3. Agregar a .env.local:  GITHUB_TOKEN=ghp_..." -ForegroundColor Yellow
    exit 1
}

$projectRoot = Join-Path $PSScriptRoot ".."
$agentsFile = Join-Path $projectRoot "AGENTS.md"
if (-not (Test-Path $agentsFile)) {
    Write-Host "❌ ERROR: AGENTS.md no encontrado." -ForegroundColor Red
    exit 1
}

# --- Capturar el diff ---
Write-Host "🔍 Capturando diff staged..." -ForegroundColor Cyan
Push-Location $projectRoot
$diff = git diff --staged 2>&1
Pop-Location

if ([string]::IsNullOrWhiteSpace($diff)) {
    Write-Host "⚠️  No hay cambios staged. Correr 'git add .' primero." -ForegroundColor Yellow
    exit 0
}

# Truncar diff si es muy largo (límite seguro del contexto)
$maxDiffChars = 12000
if ($diff.Length -gt $maxDiffChars) {
    $diff = $diff.Substring(0, $maxDiffChars) + "`n`n[... diff truncado por longitud ...]"
    Write-Host "⚠️  Diff truncado a $maxDiffChars caracteres." -ForegroundColor Yellow
}

# --- Cargar el rulebook ---
$rulebook = Get-Content $agentsFile -Raw -Encoding UTF8

# --- Construir el prompt ---
$systemPrompt = @"
Eres GGA (Guardian Angel), un revisor de código independiente y estricto para el proyecto FreeCloud.pe.
Tu única fuente de verdad son las reglas del archivo AGENTS.md del proyecto.
No tienes contexto previo de la sesión. Solo ves el diff y las reglas.
Tu rol: identificar violaciones a las convenciones del proyecto.

RESPONDE SIEMPRE EN ESTE FORMATO EXACTO:
## Resultado: [✅ APROBADO | ⚠️ CON ADVERTENCIAS | 🚫 BLOQUEADO]

### Análisis
[Resumen breve de qué hace el diff — máx 3 líneas]

### Issues encontrados
[Lista: Severidad | Archivo L# | Descripción | Regla de AGENTS.md violada]
Si no hay issues: "Ninguno detectado."

### Recomendación
[Una sola línea de acción]
"@

$userMessage = "## RULEBOOK (AGENTS.md):`n$rulebook`n`n---`n`n## DIFF:`n``````diff`n$diff`n``````"

# --- Llamar a GitHub Models API ---
Write-Host "🤖 Enviando a GGA ($Model via GitHub Models)..." -ForegroundColor Cyan

$body = @{
    model       = $Model
    messages    = @(
        @{ role = "system"; content = $systemPrompt }
        @{ role = "user"; content = $userMessage }
    )
    max_tokens  = 1024
    temperature = 0.1
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod `
        -Uri "https://models.inference.ai.azure.com/chat/completions" `
        -Method POST `
        -Headers @{
        "Authorization" = "Bearer $ApiKey"
        "Content-Type"  = "application/json"
    } `
        -Body $body `
        -ErrorAction Stop

    $reviewText = $response.choices[0].message.content

    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "  GGA — GUARDIAN ANGEL REVIEW REPORT" -ForegroundColor White
    Write-Host "  Modelo: $Model (GitHub Models)" -ForegroundColor DarkGray
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host $reviewText
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

    if ($reviewText -match "🚫 BLOQUEADO") {
        Write-Host "  ⛔ GGA bloqueó este commit. Corrige antes de continuar." -ForegroundColor Red
        exit 1
    }
    elseif ($reviewText -match "⚠️ CON ADVERTENCIAS") {
        Write-Host "  ⚠️  GGA detectó advertencias. Revisa antes de continuar." -ForegroundColor Yellow
        exit 0
    }
    else {
        Write-Host "  ✅ GGA aprobó. Puedes hacer commit." -ForegroundColor Green
        exit 0
    }

}
catch {
    Write-Host "❌ Error al llamar a GitHub Models API:" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Verifica que tu GITHUB_TOKEN sea válido y tenga acceso a GitHub Models." -ForegroundColor Yellow
    Write-Host "  Acceso en: https://github.com/marketplace/models" -ForegroundColor Yellow
    exit 1
}
