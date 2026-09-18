$envFile = Join-Path $PSScriptRoot ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#")) {
            $parts = $line.Split('=', 2)
            if ($parts.Length -eq 2) {
                [System.Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim(), [System.EnvironmentVariableTarget]::Process)
            }
        }
    }
}
Write-Host "Loaded environment. DB: $env:DB_URL | Redis: $env:REDIS_HOST:$env:REDIS_PORT | Port: $env:PORT"
& "$PSScriptRoot\mvnw.cmd" spring-boot:run
