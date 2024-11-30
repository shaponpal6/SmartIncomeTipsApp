import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import HorizontalScrollComponent from './HorizontalScrollComponent';

interface TagData {
  term_id: number;
  name: string;
}

interface CategoryGridProps {
  data: TagData[];
  title?: string;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  data,
  title
}) => {
  const navigation = useNavigation();

  const renderItem = ({ item, index }: { item: TagData; index: number }) => {
    const scale = React.useRef(new Animated.Value(1)).current;
    const [hovered, setHovered] = React.useState(false);

    const handlePressIn = () => {
      setHovered(true);
      Animated.timing(scale, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      setHovered(false);
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    };

    return (
      <TouchableWithoutFeedback
        key={item.term_id}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() =>
          navigation.push('category/categoriesScreen', {
            id: item.term_id,
            category: item.name,
          })
        }
      >
        <Animated.View style={[styles.chip, { transform: [{ scale }] }]}>
          <LinearGradient
            colors={hovered ? ['#6200ee', '#9c27b0'] : ['#ffffff', '#f1f1f1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={[styles.chipText, { color: hovered ? '#fff' : '#333' }]}>
              {item.name}
            </Text>
          </LinearGradient>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <HorizontalScrollComponent<TagData>
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.term_id.toString()}
      portraitWidth={6}
      landscapeWidth={2}
      leftItem={<Text style={styles.title}>{title}</Text>}
      // rightItem={<Text style={styles.title}>Hello</Text>}
      isRandom={true}
    />
  );
};

const styles = StyleSheet.create({
  chip: {
    margin: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    color: 'black',
    fontSize: 20.0,
    fontFamily: 'SignikaNegative_Bold'
  },
  gradient: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chipText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default CategoryGrid;
