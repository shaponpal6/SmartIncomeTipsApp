import { type SQLiteDatabase } from 'expo-sqlite';
// const DB_NAME = 'wordpress_clone.db';
const TABLE_PREFIX = 'wp_';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let { user_version: currentDbVersion } = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );

  // if (currentDbVersion >= DATABASE_VERSION) {
  //   return;
  // }

  if (currentDbVersion !== 0) {
    // Drop existing tables
    // await db.execAsync(`DROP TABLE IF EXISTS ${TABLE_PREFIX}posts`);
    // await db.execAsync(`DROP TABLE IF EXISTS ${TABLE_PREFIX}tags`);
    // await db.execAsync(`DROP TABLE IF EXISTS ${TABLE_PREFIX}categories`);
    // await db.execAsync(`DROP TABLE IF EXISTS ${TABLE_PREFIX}configs`);
    // Create tables
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS ${TABLE_PREFIX}posts (
        ID INTEGER PRIMARY KEY,
        post_author INTEGER,
        post_date TEXT,
        post_content TEXT,
        post_title TEXT,
        post_status TEXT,
        comment_status TEXT,
        ping_status TEXT,
        post_name TEXT,
        post_modified TEXT,
        post_type TEXT,
        excerpt TEXT,
        categories TEXT,
        tags TEXT,
        profession TEXT,
        interests TEXT,
        skills TEXT
      );

      CREATE TABLE IF NOT EXISTS ${TABLE_PREFIX}taxonomies (
        term_id INTEGER PRIMARY KEY,
        name TEXT,
        type TEXT,
        image TEXT,
        count INTEGER,
        slug TEXT,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS ${TABLE_PREFIX}categories (
        term_id INTEGER PRIMARY KEY,
        name TEXT,
        count INTEGER,
        slug TEXT,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS ${TABLE_PREFIX}tags (
        term_id INTEGER PRIMARY KEY,
        name TEXT,
        count INTEGER,
        slug TEXT,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS ${TABLE_PREFIX}configs (
        id INTEGER PRIMARY KEY,
        key TEXT UNIQUE,
        type TEXT,
        value TEXT
      );

      CREATE TABLE IF NOT EXISTS ${TABLE_PREFIX}postmeta (
        meta_id INTEGER PRIMARY KEY,
        post_id INTEGER,
        meta_key TEXT,
        meta_value TEXT,
        FOREIGN KEY(post_id) REFERENCES ${TABLE_PREFIX}posts(ID)
      );

      CREATE TABLE IF NOT EXISTS ${TABLE_PREFIX}post_to_category (
        post_id INTEGER,
        category_id INTEGER,
        FOREIGN KEY(post_id) REFERENCES ${TABLE_PREFIX}posts(ID),
        FOREIGN KEY(category_id) REFERENCES ${TABLE_PREFIX}categories(term_id)
      );
    `);

    currentDbVersion = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
