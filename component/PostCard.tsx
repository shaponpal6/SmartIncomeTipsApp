import React, { useRef, useState } from 'react';
import {
  View,
  Text,
//   Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Image from './LazyImage';
import { LinearGradient } from 'expo-linear-gradient';

interface PostCardProps {
  title?: string;
  subtitle?: string;
  desc?: string;
  image: string;
  width: number;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
  title,
  subtitle,
  desc,
  image,
  width,
  style,
  onPress,
}) => {
  const { height } = Dimensions.get('window');
  const cardHeight = height * 0.4; // Standard card height, around 40% of screen height

  const scale = useRef(new Animated.Value(1)).current;
  const [hovered, setHovered] = useState(false);

  const handlePressIn = () => {
    setHovered(true);
    Animated.timing(scale, {
      toValue: 1.05,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setHovered(false);
    Animated.timing(scale, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View
        style={[styles.card, { width, height: cardHeight, transform: [{ scale }] }, style]}
      >
        <LinearGradient
          colors={hovered ? ['#6200ee', '#9c27b0'] : ['#ffffff', '#f1f1f1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Title */}
          {title && (<Text style={[styles.title, { color: hovered ? '#fff' : '#333' }]} numberOfLines={3}>
            {title}
          </Text>)}

          {/* Image */}
          <Image source={image} style={styles.image} />

          {/* Subtitle */}
          {subtitle && (
            <Text
              style={[styles.subtitle, { color: hovered ? '#f1f1f1' : '#555' }]}
              numberOfLines={4}
            >
              {subtitle}
            </Text>
          )}

          {/* Description */}
          {desc && (
            <Text
              style={[styles.description, { color: hovered ? '#e1e1e1' : '#777' }]}
              numberOfLines={6}
            >
              {desc}
            </Text>
          )}
        </LinearGradient>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
    overflow: 'hidden',
    marginVertical: 10,
    marginRight: 10,
  },
  gradient: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },
  image: {
    width: '100%',
    height: '50%', // Ensures it takes 50% of the card height
    resizeMode: 'cover',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  description: {
    fontSize: 14,
    marginHorizontal: 10,
    marginVertical: 5,
  },
});

export default PostCard;
