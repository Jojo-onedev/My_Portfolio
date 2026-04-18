import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

const runMigration = async () => {
  const migrationPath = path.resolve('scripts/migrate_analytics.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');
  
  // Split by semicolon and filter empty lines (basic splitter)
  const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
  
  console.log(`🚀 Running ${statements.length} migration statements...`);
  
  try {
    for (const statement of statements) {
      await turso.execute(statement);
    }
    console.log('✅ Migration completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
};

runMigration();
