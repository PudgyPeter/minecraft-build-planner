import { PrismaClient } from '@prisma/client';

// Use PostgreSQL in production, SQLite fallback for development/issues
const isProduction = process.env.NODE_ENV === 'production';
const hasDatabaseUrl = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgresql://');

let databaseUrl, databaseProvider;

if (hasDatabaseUrl) {
  // Use PostgreSQL if DATABASE_URL is properly set
  databaseUrl = process.env.DATABASE_URL;
  databaseProvider = 'postgresql';
  console.log(`🗄️ Using PostgreSQL database`);
} else {
  // Fallback to SQLite
  databaseUrl = 'file:./dev.db';
  databaseProvider = 'sqlite';
  console.log(`🗄️ Using SQLite database (fallback)`);
  console.log(`⚠️ DATABASE_URL not properly configured for PostgreSQL`);
}

console.log(`📡 Database URL: ${databaseUrl.replace(/\/\/.*@/, '//***@')}`);

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  },
  log: isProduction ? ['warn', 'error'] : ['query', 'info', 'warn', 'error'],
});

// Test connection
prisma.$connect()
  .then(() => console.log('✅ Prisma connected to database'))
  .catch(err => console.error('❌ Prisma connection error:', err));

export default prisma;
export { databaseProvider };
