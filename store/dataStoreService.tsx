import { type SQLiteDatabase } from 'expo-sqlite';
const TABLE_PREFIX = 'wp_';
import {insertDataWithTransactionType} from './types'

// Insert multiple records with transaction handling
export async function insertDataWithTransaction(db: SQLiteDatabase, {posts, tags, categories, courses, pages, configs}: insertDataWithTransactionType) {
  await db.withTransactionAsync(async () => {
    // Insert Posts
    for (let post_type of ['posts', 'courses', 'pages']){
      let data = [];
      if (post_type==="posts") data = posts;
      if (post_type==="courses") data = courses;
      if (post_type==="pages") data = pages;
      if( !data || !data.length ) continue; 
      for (let post of data) {
        await db.runAsync(
          `INSERT OR REPLACE INTO ${TABLE_PREFIX}posts 
          (ID, post_author, post_date, post_content, post_title, post_status, comment_status, ping_status, post_name, post_modified, post_type, excerpt, categories, tags, profession, interests, skills) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            post.id, post.author, post.date, post.content.rendered, post.title.rendered, post.status,
            post.comment_status, post.ping_status, post.slug, post.modified, post.type,  post.excerpt.rendered, post.categories, post.tags, post.profession, post.interests, post.skills
          ]
        );
      }
  }

    // Insert Categories
    for (let category of categories) {
      await db.runAsync(
        `INSERT OR REPLACE INTO ${TABLE_PREFIX}categories 
        (term_id, name, slug, description, count) 
        VALUES (?, ?, ?, ?, ?);`,
        [category.id, category.name, category.slug, category.description, category.count]
      );
    }

    // Insert Tags
    for (let tag of tags) {
      await db.runAsync(
        `INSERT OR REPLACE INTO ${TABLE_PREFIX}tags 
        (term_id, name, slug, description, count) 
        VALUES (?, ?, ?, ?, ?);`,
        [tag.id, tag.name, tag.slug, tag.description, tag.count]
      );
    }

    // Insert configs
    for (let config of configs) {
      await db.runAsync(
        `INSERT OR REPLACE INTO ${TABLE_PREFIX}configs 
        (id, key, type, value) 
        VALUES (?, ?, ?, ?);`,
        [config.id, config.key, config.type, config.value]
      );
    }
  });
}

