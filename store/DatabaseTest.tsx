import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useDatabase} from './SQLiteDatabaseContext';
// import { getPostById, getCategories,getTags, searchPosts, homePageData } from './dataService';

export default function DatabaseTest() {
  return (
    <View style={styles.container}>
      {/* <SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded}> */}
        {/* <SQLiteDatabaseProvider> */}
        <Header />
        <Content />
        {/* </SQLiteDatabaseProvider> */}
      {/* </SQLiteProvider> */}
    </View>
  );
}

export function Header() {
  // const db = useSQLiteContext();
  const { db } = useDatabase();
  const [version, setVersion] = useState('');
  useEffect(() => {
    async function setup() {
      const result = await db.getFirstAsync<{ 'sqlite_version()': string }>(
        'SELECT sqlite_version()'
      );
      setVersion(result['sqlite_version()']);
    }
    setup();
  }, []);
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>SQLite version: {version}</Text>
    </View>
  );
}

export function Content() {
  // const db = useSQLiteContext();
  const { insertDataWithTransaction, getPostById, getCategories, getTags, searchPosts, homePageData } = useDatabase();
  // const { db, fetchPostsTagsCategories } = useDatabase();
  const [data, setData] = useState({ posts: [], tags: [], categories: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
       

        const [postsResponse, categoriesResponse, tagsResponse] = await Promise.all([
          fetch('https://smartincome.tips/wp-json/wp/v2/posts?per_page=100&orderby=date&order=desc&status=publish'),
          fetch('https://smartincome.tips/wp-json/wp/v2/categories'),
          fetch('https://smartincome.tips/wp-json/wp/v2/tags')
        ]);
        // const [courseResponse, pageResponse] = await Promise.all([
        //   fetch('https://smartincome.tips/wp-json/wp/v2/mto-course?per_page=100&orderby=date&order=desc&status=publish'),
        //   fetch('https://smartincome.tips/wp-json/wp/v2/pages?per_page=100&orderby=date&order=desc&status=publish')
        // ]);
    
        const posts = await postsResponse.json();
        const categories = await categoriesResponse.json();
        const tags = await tagsResponse.json();
        // const courses = await courseResponse.json();
        // const pages = await pageResponse.json();
        const courses = posts;
        const pages = posts;
        const configs = [
          {id: 1, key: 'site_title', type: 'config', value: 'Smart Income Tips'},
          {id: 2, key: 'site_url', type: 'config', value: 'https://smartincome.tips'},
        ];

        // // Insert data into the database
        // await insertDataWithTransaction({posts, tags, categories, courses, pages, configs});
        setLoading(false)

        // Fetch 5 posts, tags, and categories
        const fetchedData = await homePageData();
        const post = await searchPosts({ page: 1, limit: 1, postType: 'post' });
        // const post = await getPostById(db, 255);
        console.log('fetchedData :>> ', post);
        setData(fetchedData);
      } catch (error) {
        setLoading(false)
        console.error('Error loading data:', error);
      }
    }
    loadData();
  }, []);

  return (
    <View style={styles.contentContainer}>

      <Text style={styles.sectionTitle}>{loading ? 'Fetching ....' : 'Done'}</Text>
      <Text style={styles.sectionTitle}>Posts</Text>
      <FlatList
        data={data.posts}
        keyExtractor={(item) => item.ID.toString() || "333"}
        renderItem={({ item }) => <Text>{item.post_title || "No Title"}</Text>}
      />

      <Text style={styles.sectionTitle}>Tags</Text>
      <FlatList
        data={data.tags}
        keyExtractor={(item) => item.term_id.toString()}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />

      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        data={data.categories}
        keyExtractor={(item) => item.term_id.toString()}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerContainer: { padding: 10 },
  headerText: { fontSize: 16, fontWeight: 'bold' },
  contentContainer: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
});
