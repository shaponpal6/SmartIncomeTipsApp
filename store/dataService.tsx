import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { migrateDbIfNeeded } from './database'
import { Tag } from './types';
import {  Roadmap } from '../types';

const TABLE_PREFIX = 'wp_';

export interface SearchPostsArgs {
  search?: string;
  tags?: number[];
  categories?: number[];
  profession?: number[];
  interests?: number[];
  skills?: number[];
  postType?: string;
  page?: number;
  limit?: number;
}

export async function getPostById(db: SQLiteDatabase, id: number) {
  const postQuery = `
    SELECT ${TABLE_PREFIX}posts.*, 
      COALESCE(json_group_array(${TABLE_PREFIX}categories.name), '[]') AS categories,
      COALESCE(json_group_array(${TABLE_PREFIX}tags.name), '[]') AS tags
    FROM ${TABLE_PREFIX}posts
    LEFT JOIN ${TABLE_PREFIX}categories ON json_extract(${TABLE_PREFIX}posts.categories, '$') LIKE '%' || ${TABLE_PREFIX}categories.term_id || '%'
    LEFT JOIN ${TABLE_PREFIX}tags ON json_extract(${TABLE_PREFIX}posts.tags, '$') LIKE '%' || ${TABLE_PREFIX}tags.term_id || '%'
    WHERE ${TABLE_PREFIX}posts.ID = ?
    GROUP BY ${TABLE_PREFIX}posts.ID;
  `;

  const post = await db.getFirstAsync(postQuery, [id]);
  return post;
}

export async function getTags(db: SQLiteDatabase) {
  const tagsQuery = `SELECT * FROM ${TABLE_PREFIX}tags;`;
  const tags = await db.getAllAsync(tagsQuery);
  return tags;
}

export async function getConfigs(db: SQLiteDatabase) {
  const configsQuery = `SELECT * FROM ${TABLE_PREFIX}configs;`;
  const configs = await db.getAllAsync(configsQuery);
  return configs;
}

export async function getCategories(db: SQLiteDatabase) {
  const categoriesQuery = `SELECT * FROM ${TABLE_PREFIX}taxonomies WHERE type='category' ;`;
  const categories = await db.getAllAsync(categoriesQuery);
  return categories;
}

export async function getUserChoose(db: SQLiteDatabase) {
  const query = `SELECT * FROM ${TABLE_PREFIX}taxonomies WHERE type IN ('profession', 'interests', 'skills');`;

  // Fetch all matching records
  const results: Tag[] = await db.getAllAsync(query);

  // Organize the results by type
  const organizedData: {
    profession: Tag[];
    interests: Tag[];
    skills: Tag[];
  } = {
    profession: [],
    interests: [],
    skills: []
  };

  // Group the results by type
  results.forEach((item: Tag) => {
    if (
      item.type === 'profession' ||
      item.type === 'interests' ||
      item.type === 'skills'
    ) {
      organizedData[item.type].push(item); // TypeScript now knows item.type is a key of organizedData
    }
  });

  return organizedData;
}


export async function searchPosts2(
  db: SQLiteDatabase,
  {
    search = '',
    tags = [],
    categories = [],
    postType = '',
    page = 1,
    limit = 10,
  }: SearchPostsArgs = {}
) {
  // Calculate the offset based on the page number and limit
  const offset = (page - 1) * limit;

  // Construct dynamic conditions for the query based on the provided arguments
  const tagsCondition = tags.length > 0 ? `AND json_extract(${TABLE_PREFIX}posts.tags, '$') LIKE '%' || ? || '%'` : '';
  const categoriesCondition = categories.length > 0 ? `AND json_extract(${TABLE_PREFIX}posts.categories, '$') LIKE '%' || ? || '%'` : '';
  const postTypeCondition = postType ? `AND post_type = ?` : '';
  const searchCondition = search ? `AND post_title LIKE '%' || ? || '%'` : '';

  // Build the SQL query to replace IDs with names in the categories and tags columns
  const searchQuery = `
    SELECT ${TABLE_PREFIX}posts.*, 
      COALESCE(
        (
          SELECT json_group_array(name)
          FROM ${TABLE_PREFIX}categories
          WHERE json_extract(${TABLE_PREFIX}posts.categories, '$') LIKE '%' || term_id || '%'
        ), '[]'
      ) AS categories,
      COALESCE(
        (
          SELECT json_group_array(name)
          FROM ${TABLE_PREFIX}tags
          WHERE json_extract(${TABLE_PREFIX}posts.tags, '$') LIKE '%' || term_id || '%'
        ), '[]'
      ) AS tags,
      COALESCE(
        (
          SELECT json_group_array(name)
          FROM ${TABLE_PREFIX}categories
          WHERE json_extract(${TABLE_PREFIX}posts.profession, '$') LIKE '%' || term_id || '%'
        ), '[]'
      ) AS profession,
      COALESCE(
        (
          SELECT json_group_array(name)
          FROM ${TABLE_PREFIX}categories
          WHERE json_extract(${TABLE_PREFIX}posts.interests, '$') LIKE '%' || term_id || '%'
        ), '[]'
      ) AS interests,
      COALESCE(
        (
          SELECT json_group_array(name)
          FROM ${TABLE_PREFIX}categories
          WHERE json_extract(${TABLE_PREFIX}posts.skills, '$') LIKE '%' || term_id || '%'
        ), '[]'
      ) AS skills
    FROM ${TABLE_PREFIX}posts
    WHERE 1 = 1
      ${searchCondition}
      ${tagsCondition}
      ${categoriesCondition}
      ${postTypeCondition}
    LIMIT ? OFFSET ?;
  `;

  // Build the params array based on the provided arguments
  const params: any[] = [];
  if (search) params.push(search);
  if (tags.length > 0) params.push(...tags);
  if (categories.length > 0) params.push(...categories);
  if (postType) params.push(postType);
  params.push(limit, offset);

  // Execute the query and return the results
  const posts = await db.getAllAsync(searchQuery, params);
  return posts;
}

// Function to check if the `posts` table is empty
export async function isDataEmpty(db: SQLiteDatabase) {
  if (!db) {
    console.warn('Database not initialized.');
    return false;
  }

  try {
    // Check if the table exists
    const tableCheck = await db.getFirstAsync<{ count: number }>(
      `SELECT count(*) AS count 
       FROM sqlite_master 
       WHERE type='table' AND name='${TABLE_PREFIX}posts'`
    );

    // Add a null check for tableCheck
    if (!tableCheck || tableCheck.count === 0) {
      console.log(`Table ${TABLE_PREFIX}posts does not exist. Creating it now...`);

      // Create the table if it does not exist
      // await db.executeAsync(`
      //   CREATE TABLE IF NOT EXISTS ${TABLE_PREFIX}posts (
      //     id INTEGER PRIMARY KEY,
      //     title TEXT,
      //     content TEXT,
      //     date TEXT,
      //     author TEXT
      //   );
      // `);
      console.log(`Table ${TABLE_PREFIX}posts created successfully.`);

      // Return true as the table is newly created and therefore empty
      return true;
    }

    // If the table exists, check if it's empty
    const posts = await db.getAllAsync(`SELECT * FROM ${TABLE_PREFIX}posts LIMIT 5`);
    return !posts || posts.length === 0;

  } catch (error) {
    console.error('Error checking or creating the posts table:', error);
    return false;
  }
}





// Fetch 5 posts, tags, and categories
export async function homePageData(db: SQLiteDatabase) {
  const posts = await searchPosts(db, { page: 1, limit: 10, postType: 'post' });
  const tags = await getTags(db);
  const categories = await getCategories(db);
  const configs = await getConfigs(db);
  // const categories = await db.getAllAsync(`SELECT * FROM ${TABLE_PREFIX}categories LIMIT 5`);
  return { posts, tags, categories, configs, courses: posts, featurePosts: posts, topPosts: posts, newPosts: posts, otherPosts: posts };
}



export async function searchPosts(
  db: SQLiteDatabase,
  {
    search = '',
    tags = [],
    categories = [],
    postType = '',
    profession = [],
    interests = [],
    skills = [],
    page = 1,
    limit = 10,
  }: SearchPostsArgs = {}
) {
  // Calculate the offset based on the page number and limit
  const offset = (page - 1) * limit;

  // Dynamic conditions for filtering
  const tagsCondition =
    tags.length > 0
      ? `AND (${tags
          .map(() => `json_extract(${TABLE_PREFIX}posts.tags, '$') LIKE '%' || ? || '%'`)
          .join(' OR ')})`
      : '';
  const categoriesCondition =
    categories.length > 0
      ? `AND (${categories
          .map(() => `json_extract(${TABLE_PREFIX}posts.categories, '$') LIKE '%' || ? || '%'`)
          .join(' OR ')})`
      : '';
  const postTypeCondition = postType ? `AND post_type = ?` : '';
  const searchCondition = search ? `AND post_title LIKE '%' || ? || '%'` : '';
  const professionCondition =
    profession.length > 0
      ? `AND (${profession
          .map(() => `json_extract(${TABLE_PREFIX}posts.profession, '$') LIKE '%' || ? || '%'`)
          .join(' OR ')})`
      : '';
  const interestsCondition =
    interests.length > 0
      ? `AND (${interests
          .map(() => `json_extract(${TABLE_PREFIX}posts.interests, '$') LIKE '%' || ? || '%'`)
          .join(' OR ')})`
      : '';
  const skillsCondition =
    skills.length > 0
      ? `AND (${skills
          .map(() => `json_extract(${TABLE_PREFIX}posts.skills, '$') LIKE '%' || ? || '%'`)
          .join(' OR ')})`
      : '';

  // Build the SQL query
  const searchQuery = `
    SELECT ${TABLE_PREFIX}posts.*, 
      COALESCE(
        (
          SELECT json_group_array(name)
          FROM ${TABLE_PREFIX}categories
          WHERE json_extract(${TABLE_PREFIX}posts.categories, '$') LIKE '%' || term_id || '%'
        ), '[]'
      ) AS categories,
      COALESCE(
        (
          SELECT json_group_array(name)
          FROM ${TABLE_PREFIX}tags
          WHERE json_extract(${TABLE_PREFIX}posts.tags, '$') LIKE '%' || term_id || '%'
        ), '[]'
      ) AS tags,
      COALESCE(
        (
          SELECT json_group_array(name)
          FROM ${TABLE_PREFIX}categories
          WHERE json_extract(${TABLE_PREFIX}posts.profession, '$') LIKE '%' || term_id || '%'
        ), '[]'
      ) AS profession,
      COALESCE(
        (
          SELECT json_group_array(name)
          FROM ${TABLE_PREFIX}categories
          WHERE json_extract(${TABLE_PREFIX}posts.interests, '$') LIKE '%' || term_id || '%'
        ), '[]'
      ) AS interests,
      COALESCE(
        (
          SELECT json_group_array(name)
          FROM ${TABLE_PREFIX}categories
          WHERE json_extract(${TABLE_PREFIX}posts.skills, '$') LIKE '%' || term_id || '%'
        ), '[]'
      ) AS skills
    FROM ${TABLE_PREFIX}posts
    WHERE 1 = 1
      ${searchCondition}
      ${tagsCondition}
      ${categoriesCondition}
      ${postTypeCondition}
      ${professionCondition}
      ${interestsCondition}
      ${skillsCondition}
    LIMIT ? OFFSET ?;
  `;

  // Build the params array dynamically
  const params: any[] = [];
  if (search) params.push(search);
  if (tags.length > 0) params.push(...tags);
  if (categories.length > 0) params.push(...categories);
  if (postType) params.push(postType);
  if (profession.length > 0) params.push(...profession);
  if (interests.length > 0) params.push(...interests);
  if (skills.length > 0) params.push(...skills);
  params.push(limit, offset);

  // Execute the query and return results
  const posts = await db.getAllAsync(searchQuery, params);
  return posts;
}











export async function getRoadmap(db: SQLiteDatabase, pid: number): Promise<Roadmap[]> {
  const query = `SELECT * FROM ${TABLE_PREFIX}roadmap WHERE pid = ?`;
  const result = await db.getAllAsync(query, [pid]);
  return result as Roadmap[];
}

export async function getRoadmapTask(db: SQLiteDatabase, id: number): Promise<Roadmap | undefined> {
  const query = `SELECT * FROM ${TABLE_PREFIX}roadmap WHERE id = ?`;
  const result = await db.getAllAsync(query, [id]);
  return (result.length > 0 ? result[0] : undefined) as Roadmap;
}

export async function addRoadmap(db: SQLiteDatabase, data: Roadmap): Promise<void> {
  const query = `
    INSERT INTO ${TABLE_PREFIX}roadmap 
    (id, uid, pid, parent, title, desc, progress, status, input, answer)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
  await db.getAllAsync(query, [
    data.id,
    data.uid,
    data.pid,
    data.parent,
    data.title,
    data.desc,
    data.progress ?? '0%',
    data.status ?? 1,
    data.input ?? 0,
    data.answer ?? '',
  ]);
}

export async function updateRoadmap(db: SQLiteDatabase, data: Roadmap): Promise<void> {
  const query = `
    UPDATE ${TABLE_PREFIX}roadmap
    SET title = ?, desc = ?, progress = ?, status = ?, input = ?, answer = ?
    WHERE id = ?;
  `;
  await db.getAllAsync(query, [
    data.title,
    data.desc,
    data.progress,
    data.status,
    data.input,
    data.answer,
    data.id,
  ]);
}

export async function deleteRoadmapTask(db: SQLiteDatabase, id: string): Promise<void> {
  const query = `DELETE FROM ${TABLE_PREFIX}roadmap WHERE id = ?`;
  await db.getAllAsync(query, [id]);
}
