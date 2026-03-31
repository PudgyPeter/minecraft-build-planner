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
    
    if (error.message.includes('no such table')) {
      console.log('🔄 Database exists but tables missing, running migrations...');
      try {
        const { execSync } = await import('child_process');
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
        console.log('✅ Migrations completed');
      } catch (migrationError) {
        console.error('❌ Migration failed:', migrationError.message);
      }
    }
  }
}

initializeDatabase();

export default prisma;
