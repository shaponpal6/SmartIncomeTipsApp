// import { insertDataWithTransaction } from './SQLiteDatabaseContext';
// import { useDatabase} from './SQLiteDatabaseContext';

export async function updateData() {
    // const { insertDataWithTransaction } = useDatabase();
  try {
    const [postsResponse, taxonomiesResponse, configResponse] = await Promise.all([
      fetch('https://smartincome.tips/wp-json/sit/v2/posts'),
      fetch('https://smartincome.tips/wp-json/sit/v2/taxonomies'),
      fetch('https://smartincome.tips/wp-json/sit/v2/configs')
    ]);

    const posts = await postsResponse.json();
    const categories = await taxonomiesResponse.json();
    const configs = await configResponse.json();
    const courses = posts;
    const pages = posts;
    const tags = posts;

    // Check if the data is different from what is currently in SQLite (implement comparison logic)
    const hasUpdates = true; // Replace with actual comparison logic if needed

    if (hasUpdates) {
      // const configs = [
      //   { id: 1, key: 'site_title', type: 'config', value: 'Smart Income Tips' },
      //   { id: 2, key: 'site_url', type: 'config', value: 'https://smartincome.tips' },
      // ];

      // Update the SQLite database
    //   await insertDataWithTransaction({posts, tags, categories, courses, pages, configs});
      return {posts, tags, categories, courses, pages, configs};

    //   return true; // Indicates new data was fetched and updated
    }
    return null; // No new data
  } catch (error) {
    console.error('Error updating data:', error);
    return null;
  }
}
