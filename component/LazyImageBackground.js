import React, { useEffect, useState } from 'react';
import { View, ImageBackground, StyleSheet, SafeAreaView } from 'react-native';
import * as FileSystem from 'expo-file-system';

// Default fallback image
const defaultFallbackImage = require('../assets/images/bg.jpg');

const LazyImageBackground = ({
  source, // Accepts `require` or `{ uri: '...' }`
  fallbackUrl = '', // Optional fallback URL
  style = {}, // Additional styles for the container
  imageStyle = {}, // Additional styles for the image
  children = null, // Children to render inside the background
  resizeMode = 'cover', // Default resizeMode
  ...otherProps // Other props for ImageBackground
}) => {
  const [localUri, setLocalUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const folderPath = `${FileSystem.documentDirectory}smartincometips/`;

  const isRemoteSource = (src) => src && typeof src === 'object' && src.uri;

  const getFileName = (url) => url.split('/').pop();

  const ensureFolderExists = async () => {
    const folderInfo = await FileSystem.getInfoAsync(folderPath);
    if (!folderInfo.exists) {
      await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      if (!isRemoteSource(source)) {
        setLocalUri(source); // Local asset, no download needed
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(false);

      const fileName = getFileName(source.uri);
      const fileUri = `${folderPath}${fileName}`;

      try {
        await ensureFolderExists();

        const fileExists = await FileSystem.getInfoAsync(fileUri);
        if (fileExists.exists) {
          setLocalUri(fileUri); // Use the cached image
        } else {
          const downloadResult = await FileSystem.downloadAsync(source.uri, fileUri);
          setLocalUri(downloadResult.uri);
        }
      } catch (downloadError) {
        console.error('Error downloading the image:', downloadError);
        setError(true);
        setLocalUri(fallbackUrl || defaultFallbackImage); // Use fallback on error
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [source, fallbackUrl]);

  
    const fallBackImageUri = {uri: 'https://legacy.reactjs.org/logo-og.png'};
    const fallBackImage = 'https://legacy.reactjs.org/logo-og.png';
    const finalSource = error || !localUri
    ? fallBackImage
      ? fallBackImage
      : defaultFallbackImage
    : isRemoteSource(source)
    ? { uri: localUri || source.uri }
    : source;

    // console.log('finalSource :>> ', finalSource);

    
  return (
    <SafeAreaView style={[styles.container, style]} edges={['left', 'right']}>
      <ImageBackground
        source={finalSource}
        style={[styles.image, imageStyle]}
        resizeMode={resizeMode}
        {...otherProps}
      >
        <View style={styles.centerContent}>{children}</View>
      </ImageBackground>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Fill the parent container
    width: '100%',
    // aspectRatio: 16 / 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    // height: 200,
    width: '100%',
    height: '100%',
    // height: '100%',
    // justifyContent: 'center',// Fills the parent container
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8, // Add padding for children
    backgroundColor: '#000000c0',
  },
});

export default LazyImageBackground;
