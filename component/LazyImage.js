import React, { useEffect, useState } from 'react';
import { Image, View, StyleSheet, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';

const LazyImage = ({ imageUrl, fallbackUrl = 'https://placehold.co/600x400' }) => {
  const [localUri, setLocalUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const downloadDirectory = FileSystem.documentDirectory;

  const getFileName = (url) => {
    return url.split('/').pop();
  };

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      setError(false);

      const fileName = getFileName(imageUrl);
      const fileUri = `${downloadDirectory}${fileName}`;

      try {
        // Check if the image is already downloaded
        const fileExists = await FileSystem.getInfoAsync(fileUri);
        if (fileExists.exists) {
          setLocalUri(fileUri); // Load from local storage
        } else {
          // Download the image
          const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);
          setLocalUri(downloadResult.uri);
        }
      } catch (error) {
        console.error("Error fetching the image: ", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [imageUrl]);

  return (
    <View style={styles.container}>
      {loading ? (
        <Image
          source={{ uri: 'https://placehold.co/600x400?text=Loading...' }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <Image
          source={{ uri: error ? fallbackUrl : localUri }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default LazyImage;
