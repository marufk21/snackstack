#!/usr/bin/env node

/**
 * Database Seeding Script
 *
 * This script seeds your database with sample data including:
 * - Sample users with different profiles
 * - Sample notes with markdown content covering various tech topics
 * - Random image associations for some notes
 *
 * Usage:
 * npm run db:seed
 *
 * Or run directly:
 * npx ts-node server/db/seed.ts
 */

require("dotenv").config();
require("./seed.ts");
