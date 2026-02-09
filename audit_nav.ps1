$rootPath = Get-Location
$files = Get-ChildItem -Path $rootPath -Recurse -Filter "*.html"

$report = @()

foreach ($file in $files) {
    if ($file.FullName -like "*node_modules*") { continue }
    
    $content = Get-Content -Raw $file.FullName
    $hasScript = $content -match 'src=".*?js/script\.js"'
    $hasToggle = $content -match 'id="mobile-menu-toggle"'
    $hasBack = $content -match 'id="mobile-menu-back"'
    $hasHeaderId = $content -match 'id="site-header"'
    
    if (-not $hasScript -or -not $hasToggle -or -not $hasBack -or -not $hasHeaderId) {
        $report += [PSCustomObject]@{
            File = $file.FullName.Replace($rootPath.Path, '')
            HasScript = $hasScript
            HasToggle = $hasToggle
            HasBack = $hasBack
            HasHeaderId = $hasHeaderId
        }
    }
}

$report | Format-Table -AutoSize
