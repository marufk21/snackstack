# PowerShell script to fix database schema - adds missing emailVerified column
# Run this script to add the missing column to your database

Write-Host "🔧 Fixing database schema..." -ForegroundColor Cyan
Write-Host ""

# Check if DATABASE_URL is set
if (-not $env:DATABASE_URL) {
    Write-Host "❌ Error: DATABASE_URL environment variable is not set." -ForegroundColor Red
    Write-Host "Please set it in your .env file or environment variables." -ForegroundColor Yellow
    exit 1
}

Write-Host "📊 Adding emailVerified column to User table..." -ForegroundColor Yellow

# Extract database connection details from DATABASE_URL
# Format: postgresql://user:password@host:port/database
$dbUrl = $env:DATABASE_URL

# Use psql if available, otherwise provide instructions
$psqlExists = Get-Command psql -ErrorAction SilentlyContinue

if ($psqlExists) {
    # Try to execute the SQL using psql
    $sql = 'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP(3);'
    
    Write-Host "Executing SQL: $sql" -ForegroundColor Gray
    Write-Host ""
    
    # Execute via psql
    echo $sql | psql $dbUrl
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Successfully added emailVerified column!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Failed to add column. Please run the SQL manually:" -ForegroundColor Red
        Write-Host $sql -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  psql not found. Please run this SQL manually in your database:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host 'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP(3);' -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or use the Node.js script: npx ts-node scripts/add-email-verified-column.ts" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Done!" -ForegroundColor Green

