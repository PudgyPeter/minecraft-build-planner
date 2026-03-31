import { PrismaClient } from '@prisma/client';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

// Use persistent storage path in Railway, fallback to local
const persistentPath = process.env.RAILWAY_VOLUME_MOUNT_PATH || '/data';
const databaseUrl = process.env.DATABASE_URL || `file:${persistentPath}/minecraft-planner.db`;
const databasePath = databaseUrl.replace('file:', '');

console.log(`🗄️ Using SQLite database`);
console.log(`📡 Database URL: ${databaseUrl}`);
console.log(`📁 Database path: ${databasePath}`);

// Ensure database directory exists
const dbDir = dirname(databasePath);
if (!existsSync(dbDir)) {
  console.log(`📁 Creating database directory: ${dbDir}`);
  mkdirSync(dbDir, { recursive: true });
}

// Check if database file exists
if (existsSync(databasePath)) {
  console.log(`✅ Database file exists: ${databasePath}`);
} else {
  console.log(`⚠️ Database file not found, will be created: ${databasePath}`);
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  },
  log: process.env.NODE_ENV === 'production' ? ['warn', 'error'] : ['query', 'info', 'warn', 'error'],
});

// Test connection and create database if needed
async function initializeDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Prisma connected to SQLite database');
    
    // Test if database is initialized by checking if we can query
    const count = await prisma.project.count();
    console.log(`📊 Database initialized, found ${count} projects`);
  } catch (error) {
    console.error('❌ Database connection error:', error);
    
    if (error.message.includes('no such table') || error.message.includes('does not exist')) {
      console.log('🔄 Database exists but tables missing, running migrations...');
      try {
        const { execSync } = await import('child_process');
        // Set DATABASE_URL for the migration command
        const env = { ...process.env, DATABASE_URL: databaseUrl };
        execSync('npx prisma migrate deploy', { stdio: 'inherit', env });
        console.log('✅ Migrations completed');
        
        // Retry the connection test
        const count = await prisma.project.count();
        console.log(`📊 Database ready after migrations, found ${count} projects`);
      } catch (migrationError) {
        console.error('❌ Migration failed:', migrationError.message);
        
        // Try to create tables manually using Prisma client
        console.log('🔧 Attempting to create database schema manually...');
        try {
          // This will fail if tables don't exist, but let's try a simple approach
          await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Project" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "name" TEXT NOT NULL,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
          )`;
          
          await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Material" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "projectId" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "quantity" INTEGER NOT NULL,
            "category" TEXT NOT NULL,
            "collected" BOOLEAN NOT NULL DEFAULT FALSE,
            FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
          )`;
          
          await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Template" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "name" TEXT NOT NULL,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
          )`;
          
          await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "TemplateMaterial" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "templateId" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "quantity" INTEGER NOT NULL,
            "category" TEXT NOT NULL,
            FOREIGN KEY ("templateId") REFERENCES "Template" ("id") ON DELETE CASCADE ON UPDATE CASCADE
          )`;
          
          console.log('✅ Database schema created manually');
          
          // Test connection again
          const count = await prisma.project.count();
          console.log(`📊 Database ready, found ${count} projects`);
        } catch (manualError) {
          console.error('❌ Manual schema creation failed:', manualError.message);
        }
      }
    }
  }
}

initializeDatabase();

export default prisma;
export { databaseUrl };
