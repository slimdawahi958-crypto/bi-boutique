param(
    [string]$Api = "http://localhost:5000",
    [string]$Web = "http://localhost:80",
    [string]$Out = "reports\smoke-result.txt"
)
$status = "PASSED"
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Out) | Out-Null
"=== SMOKE TEST BI BOUTIQUE $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') ===" | Set-Content -Encoding UTF8 $Out
"API : $Api | WEB : $Web" | Add-Content $Out

# Renvoie le code HTTP d'une requête (0 si le serveur ne répond pas)
function Get-Code([string]$Method, [string]$Url, [string]$Body = "") {
    try {
        $p = @{ Uri = $Url; Method = $Method; UseBasicParsing = $true; TimeoutSec = 10 }
        if ($Body -ne "") { $p.Body = $Body; $p.ContentType = "application/json" }
        return [int](Invoke-WebRequest @p).StatusCode
    } catch {
        if ($_.Exception.Response) { return [int]$_.Exception.Response.StatusCode }
        return 0
    }
}

# Un cas de test : écrit PASSED ou FAILED dans le fichier résultat
function Check([string]$Name, [string]$Method, [string]$Url, [int]$Expected, [string]$Body = "") {
    $code = Get-Code $Method $Url $Body
    if ($code -eq $Expected) { "[PASSED] $Name -> HTTP $code" | Add-Content $Out }
    else { "[FAILED] $Name -> HTTP $code (attendu $Expected)" | Add-Content $Out; $script:status = "FAILED" }
}

# Attente active : la base PostgreSQL démarre lentement (20 essais x 3 s)
for ($i = 1; $i -le 20; $i++) {
    if ((Get-Code "GET" "$Api/api/produits") -eq 200) { break }
    Start-Sleep -Seconds 3
}

Check "API GET /api/produits" "GET" "$Api/api/produits" 200
Check "API GET /api/clients"  "GET" "$Api/api/clients"  200
Check "API GET /api/ventes"   "GET" "$Api/api/ventes"   200
Check "API GET /api/stats"    "GET" "$Api/api/stats"    200
Check "WEB GET / (frontend)"  "GET" "$Web/"             200

# Cycle CRUD : créer, modifier, supprimer un produit
try {
    $r = Invoke-RestMethod -Method Post -Uri "$Api/api/produits" -ContentType "application/json" -Body '{"nom":"smoke-test","prix":1,"stock":1}'
    $id = @($r)[0].id
} catch { $id = $null }
if ($id) {
    "[PASSED] API POST /api/produits -> id $id" | Add-Content $Out
    Check "API PUT /api/produits/$id"    "PUT"    "$Api/api/produits/$id" 200 '{"nom":"smoke-test","prix":2,"stock":3}'
    Check "API DELETE /api/produits/$id" "DELETE" "$Api/api/produits/$id" 200
} else {
    "[FAILED] API POST /api/produits -> aucun id reçu" | Add-Content $Out
    $status = "FAILED"
}

"RESULTAT GLOBAL: $status" | Add-Content $Out
Get-Content $Out
if ($status -eq "PASSED") { exit 0 } else { exit 1 }   # code 1 = stage rouge dans Jenkins