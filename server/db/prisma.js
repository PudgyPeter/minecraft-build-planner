import { PrismaClient } from '@prisma/client';

// Always use SQLite for simplicity and reliability
const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';

console.log(`🗄️ Using SQLite database`);
console.log(`📡 Database URL: ${databaseUrl}`);

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  },
  log: process.env.NODE_ENV === 'production' ? ['warn', 'error'] : ['query', 'info', 'warn', 'error'],
});

// Test connection
prisma.$connect()
  .then(() => console.log('✅ Prisma connected to SQLite database'))
  .catch(err => console.error('❌ Prisma connection error:', err));

export default prisma;
