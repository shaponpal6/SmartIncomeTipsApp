import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  StyleProp,
  ViewStyle,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VerticalScrollComponentProps<T> {
  data: T[];
  renderItem: ({ item, index }: { item: T; index: number }) => React.ReactNode;
  keyExtractor: (item: T) => string;
  grid: 1 | 2; // Grid configuration: full width or half width
  leftItem?: React.ReactNode;
  rightItem?: React.ReactNode;
  isRandom?: boolean;
  style?: StyleProp<ViewStyle>;
}

const VerticalScrollComponent = <T,>({
  data,
  renderItem,
  keyExtractor,
  grid,
  leftItem,
  rightItem,
  isRandom = false,
  style,
}: VerticalScrollComponentProps<T>) => {
  const [currentData, setCurrentData] = useState<T[]>(data || []);
  const [numColumns, setNumColumns] = useState(calculateNumColumns());

  // Validate data prop
  useEffect(() => {
    if (!Array.isArray(data)) {
      console.warn('The `data` prop must be an array.');
    }
    setCurrentData(data || []);
  }, [data]);

  // Function to randomize data
  const randomizeData = () => {
    const shuffled = [...currentData].sort(() => Math.random() - 0.5);
    setCurrentData(shuffled);
  };

  // Calculate number of columns based on orientation and grid configuration
  function calculateNumColumns() {
    const { width, height } = Dimensions.get('window');
    const isPortrait = height >= width;
    if (grid === 1) {
      return isPortrait ? 1 : 2;
    } else {
      return isPortrait ? 2 : 3;
    }
  }

  useEffect(() => {
    const handleOrientationChange = () => {
      setNumColumns(calculateNumColumns());
    };

    Dimensions.addEventListener('change', handleOrientationChange);
    return () => {
      Dimensions.removeEventListener('change', handleOrientationChange);
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={[styles.container, style]}>
      {/* Header with left and right items */}
      <View style={styles.headerWrapper}>
        <View style={styles.leftItem}>{leftItem}</View>
        <View style={styles.rightItem}>
          {isRandom && (
            <TouchableOpacity onPress={randomizeData}>
              <Ionicons name="shuffle" size={24} color="#6200ee" />
            </TouchableOpacity>
          )}
          {rightItem}
        </View>
      </View>

      {/* Grid View */}
      <FlatList
        data={currentData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        scrollEnabled={false} 
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true} 
        key={numColumns} // Forces a re-render on orientation change
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  leftItem: {
    flex: 1,
  },
  rightItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridContainer: {
    paddingHorizontal: 10,
  },
});

export default VerticalScrollComponent;
