#!/bin/bash

# Database Migration Script for SnackStack Stripe Integration
# This script helps you migrate the database with the new subscription schema

echo "🚀 SnackStack Database Migration Script"
echo "========================================"
echo ""

# Check if Prisma is installed
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx not found. Please install Node.js and npm first."
    exit 1
fi

# Function to run migration
run_migration() {
    echo "📊 Generating Prisma migration..."
    echo ""
    
    npx prisma migrate dev --name add_subscription_model
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Migration completed successfully!"
        echo ""
        echo "📦 Generating Prisma Client..."
        npx prisma generate
        echo ""
        echo "✅ Prisma Client generated!"
    else
        echo ""
        echo "❌ Migration failed. Please check the error messages above."
        exit 1
    fi
}

# Function to reset database
reset_database() {
    echo "⚠️  WARNING: This will DELETE ALL DATA in your database!"
    read -p "Are you sure you want to continue? (yes/no): " confirm
    
    if [ "$confirm" = "yes" ]; then
        echo ""
        echo "🔄 Resetting database..."
        npx prisma migrate reset --force
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Database reset completed!"
            echo ""
            echo "📦 Generating Prisma Client..."
            npx prisma generate
            echo ""
            echo "✅ Prisma Client generated!"
        else
            echo ""
            echo "❌ Reset failed. Please check the error messages above."
            exit 1
        fi
    else
        echo "❌ Reset cancelled."
        exit 0
    fi
}

# Main menu
echo "Choose an option:"
echo "1) Run migration (recommended for existing data)"
echo "2) Reset database (WARNING: deletes all data)"
echo "3) Cancel"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        run_migration
        ;;
    2)
        reset_database
        ;;
    3)
        echo "❌ Operation cancelled."
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 All done! Your database is ready."
echo ""
echo "Next steps:"
echo "1. Restart your development server"
echo "2. Configure Stripe webhooks"
echo "3. Test the subscription flow"





