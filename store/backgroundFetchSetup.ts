import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { updateData } from './fetchLiveDataService'; // Function that fetches and updates data in SQLite

const TASK_NAME = 'FETCH_LIVE_DATA2';

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    // Call the function to fetch and update data
    const isUpdated = await updateData();

    if (isUpdated) {
      console.log('New data fetched and updated.');
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } else {
      console.log('No new data available.');
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }
  } catch (error) {
    console.error('Background fetch failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const registerBackgroundFetch = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 2, // Run once a day (in seconds)
    //   minimumInterval: 24 * 60 * 60, // Run once a day (in seconds)
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log('Background fetch registered successfully.');
  } catch (error) {
    console.error('Error registering background fetch:', error);
  }
};
