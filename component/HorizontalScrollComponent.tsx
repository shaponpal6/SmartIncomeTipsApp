import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type HorizontalScrollComponentProps<T> = {
  data: T[];
  renderItem: ({ item, index }: { item: T; index: number }) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  portraitWidth?: number;
  landscapeWidth?: number;
  style?: object;
  leftItem?: React.ReactNode;
  rightItem?: React.ReactNode;
  isRandom?: boolean;
  fullWidth?: boolean;
};

const HorizontalScrollComponent = <T extends unknown>({
  data = [],
  renderItem,
  keyExtractor,
  portraitWidth = 4,
  landscapeWidth = 2,
  style = {},
  leftItem,
  rightItem,
  isRandom = false,
  fullWidth = false,
}: HorizontalScrollComponentProps<T>) => {
  if (!data || data?.length <= 0) return null;
  const [items, setItems] = useState<T[]>(data);
  const [containerWidth, setContainerWidth] = useState(
    calculateContainerWidth(portraitWidth, landscapeWidth)
  );

  const randomizeItems = () => {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setItems(shuffled);
  };

  useEffect(() => {
    const handleOrientationChange = () => {
      setContainerWidth(calculateContainerWidth(portraitWidth, landscapeWidth));
    };

    const subscription = Dimensions.addEventListener('change', handleOrientationChange);
    return () => {
      subscription?.remove?.();
    };
  }, [portraitWidth, landscapeWidth]);

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.titleWrapper}>
        {leftItem}
        <View style={styles.rightWrapper}>
          {isRandom && (
            <Ionicons
              name="shuffle"
              size={24}
              color="#6200ee"
              onPress={randomizeItems}
              style={styles.randomIcon}
            />
          )}
          {rightItem}
        </View>
      </View>
      {fullWidth ? (
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          contentContainerStyle={[
            {
              paddingHorizontal: 10,
            }, style]}
        />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContainer, { width: containerWidth }]}
        >
          {items.map((item, index) => (
            <React.Fragment key={keyExtractor(item, index)}>
              {renderItem({ item, index })}
            </React.Fragment>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const calculateContainerWidth = (portraitWidth: number, landscapeWidth: number) => {
  const { width, height } = Dimensions.get('window');
  const isPortrait = height >= width;
  return isPortrait ? width * portraitWidth : width * landscapeWidth;
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  rightWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  randomIcon: {
    padding: 5,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
});

export default HorizontalScrollComponent;
