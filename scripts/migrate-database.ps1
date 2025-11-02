# Database Migration Script for SnackStack Stripe Integration (PowerShell)
# This script helps you migrate the database with the new subscription schema

Write-Host "🚀 SnackStack Database Migration Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if npm is installed
$npmExists = Get-Command npx -ErrorAction SilentlyContinue
if (-not $npmExists) {
    Write-Host "❌ Error: npx not found. Please install Node.js and npm first." -ForegroundColor Red
    exit 1
}

# Function to run migration
function Run-Migration {
    Write-Host "📊 Generating Prisma migration..." -ForegroundColor Yellow
    Write-Host ""
    
    npx prisma migrate dev --name add_subscription_model
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Migration completed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📦 Generating Prisma Client..." -ForegroundColor Yellow
        npx prisma generate
        Write-Host ""
        Write-Host "✅ Prisma Client generated!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Migration failed. Please check the error messages above." -ForegroundColor Red
        exit 1
    }
}

# Function to reset database
function Reset-Database {
    Write-Host "⚠️  WARNING: This will DELETE ALL DATA in your database!" -ForegroundColor Yellow
    $confirm = Read-Host "Are you sure you want to continue? (yes/no)"
    
    if ($confirm -eq "yes") {
        Write-Host ""
        Write-Host "🔄 Resetting database..." -ForegroundColor Yellow
        npx prisma migrate reset --force
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Database reset completed!" -ForegroundColor Green
            Write-Host ""
            Write-Host "📦 Generating Prisma Client..." -ForegroundColor Yellow
            npx prisma generate
            Write-Host ""
            Write-Host "✅ Prisma Client generated!" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "❌ Reset failed. Please check the error messages above." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "❌ Reset cancelled." -ForegroundColor Red
        exit 0
    }
}

# Main menu
Write-Host "Choose an option:" -ForegroundColor Cyan
Write-Host "1) Run migration (recommended for existing data)"
Write-Host "2) Reset database (WARNING: deletes all data)"
Write-Host "3) Cancel"
Write-Host ""
$choice = Read-Host "Enter your choice (1-3)"

switch ($choice) {
    "1" {
        Run-Migration
    }
    "2" {
        Reset-Database
    }
    "3" {
        Write-Host "❌ Operation cancelled." -ForegroundColor Red
        exit 0
    }
    default {
        Write-Host "❌ Invalid choice. Please run the script again." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🎉 All done! Your database is ready." -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Restart your development server"
Write-Host "2. Configure Stripe webhooks"
Write-Host "3. Test the subscription flow"





