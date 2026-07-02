[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptDir

# Find the actual line where the orphan div is for privacy-policy.html
$path = Join-Path $scriptDir "privacy-policy.html"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
$lines = $content -split "`n"

# The first orphan is at position 1751, but we want to find the issue
# The legal-wrap div contains the article, and the structure should be:
# <div class="container legal-wrap">
#   <aside>...</aside>
#   <article>...</article>
# </div>
# But there might be an extra </div> inside somewhere

# Show context around line 1751
$bytePos = 1751
$lineNum = ($content.Substring(0, $bytePos) -split "`n").Count
Write-Host "Position 1751 is at line $lineNum"
Write-Host "Context around line $lineNum:"
for ($i = [Math]::Max(0, $lineNum - 5); $i -lt [Math]::Min($lines.Count, $lineNum + 5); $i++) {
    Write-Host ("  " + ($i+1) + ": " + $lines[$i])
}

Remove-Item $MyInvocation.MyCommand.Definition -Force
