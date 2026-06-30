import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'data', 'readme-forge.db');

try {
  const db = new Database(dbPath);
  console.log('Connecting to database...');
  
  // Disable foreign key constraint checks during drop operations
  db.prepare('PRAGMA foreign_keys = OFF').run();
  
  db.prepare('DROP TABLE IF EXISTS generations').run();
  db.prepare('DROP TABLE IF EXISTS projects').run();
  db.prepare('DROP TABLE IF EXISTS users').run();
  db.prepare('DROP TABLE IF EXISTS sessions').run();
  db.prepare('DROP TABLE IF EXISTS generation_history').run();
  db.prepare('DROP TABLE IF EXISTS repository_cache').run();
  
  console.log('✅ Dropped old database tables successfully');
  db.close();
} catch (e) {
  console.error('❌ Database drop failed:', e.message);
}
