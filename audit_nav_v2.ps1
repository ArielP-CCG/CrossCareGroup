$rootPath = Get-Location
$files = Get-ChildItem -Path $rootPath -Recurse -Filter "*.html"

$report = @()

foreach ($file in $files) {
    if ($file.FullName -like "*node_modules*") { continue }
    
    $content = Get-Content -Raw $file.FullName
    
    # Ignore redirects
    if ($content -match '<meta http-equiv="refresh"') { continue }
    
    # Check for Mobile Menu Toggle
    $hasToggle = $content -match 'id="mobile-menu-toggle"'
    
    if ($hasToggle) {
        $hasScript = $content -match 'src=".*?js/script\.js"'
        $hasBack = $content -match 'id="mobile-menu-back"'
        $hasMenu = $content -match 'id="mobile-menu"'
        
        if (-not $hasScript -or -not $hasBack -or -not $hasMenu) {
            $report += [PSCustomObject]@{
                File = $file.FullName.Replace($rootPath.Path, '')
                MissingScript = -not $hasScript
                MissingBack = -not $hasBack
                MissingMenu = -not $hasMenu
            }
        }
    }
}

if ($report.Count -eq 0) {
    Write-Host "All pages with a mobile menu toggle are fully configured."
} else {
    $report | Format-Table -AutoSize
}
