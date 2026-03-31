import { PrismaClient } from '@prisma/client';

// Use PostgreSQL in production, SQLite fallback for development/issues
const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';
const isProduction = process.env.NODE_ENV === 'production';

console.log(`🗄️ Using database: ${isProduction ? 'PostgreSQL' : 'SQLite'}`);
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
