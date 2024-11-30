import * as React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface TagData {
  term_id: number;
  name: string;
}

interface TagGridProps {
  data: TagData[];
  title?: string; // Optional title prop
}

const TagGrid: React.FC<TagGridProps> = ({ data, title }) => {
  const navigation = useNavigation();
  const [currentTags, setCurrentTags] = React.useState<TagData[]>(data);

  // Randomize the tags
  const randomizeTags = () => {
    if (!data || data.length === 0) return; // Check if data is valid
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    setCurrentTags(shuffled);
  };

  const [containerWidth, setContainerWidth] = React.useState(calculateContainerWidth());

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setContainerWidth(calculateContainerWidth());
    });

    return () => {
      subscription?.remove(); // Properly remove the event listener
    };
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.titleWrapper}>
        {title && <Text style={styles.title}>{title}</Text>}
        <Ionicons
          name="shuffle"
          size={24}
          color="#6200ee"
          onPress={randomizeTags}
          style={styles.randomIcon}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          { width: containerWidth },
        ]}
      >
        {currentTags.map((item) => (
          <HoverableChip
            key={item.term_id}
            label={item.name}
            onPress={() =>
              navigation.push('category/categoriesScreen', {
                id: item.term_id,
                category: item.name,
              })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
};

const HoverableChip: React.FC<{
  label: string;
  onPress: () => void;
}> = ({ label, onPress }) => {
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
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[styles.chip, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={hovered ? ['#6200ee', '#9c27b0'] : ['#ffffff', '#f1f1f1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={[styles.chipText, { color: hovered ? '#fff' : '#333' }]}>
            {label}
          </Text>
        </LinearGradient>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const calculateContainerWidth = () => {
  const { width, height } = Dimensions.get('window');
  const isPortrait = height >= width;
  return isPortrait ? width * 4 : width * 2;
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  randomIcon: {
    padding: 5,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  chip: {
    margin: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
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

export default TagGrid;
