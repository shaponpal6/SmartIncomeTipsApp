import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Image from './LazyImage';
import { Colors, Fonts, Sizes, CommonStyles } from "../constant/styles";
import HorizontalScrollComponent from './HorizontalScrollComponent';
import VerticalScrollComponent from './VerticalScrollComponent';

import PostCard from './PostCard';

const width = Dimensions.get('window').width;

interface TagData {
  ID: number;
  post_title?: string;
  post_image?: string;
}

interface CategoryGridProps {
  data: TagData[];
  title?: string;
  route?: string;
  scroll?: string;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  data,
  title,
  route,
  scroll="vertical"
}) => {
  if (!data || data.length <= 0) return <Text>No items</Text>
  const image = require('../assets/images/category/category_1.jpg');
  const navigation = useNavigation();

  const renderItem = ({ item, index }: { item: TagData; index: number }) => {
    return (
      <PostCard
        key={index}
        // title={item.post_title || "No Title"}
        subtitle={item.post_title}
        desc={item.post_title}
        image={item?.post_image ?? image}
        width={(width / 2)}
        style={{}}
        onPress={() => navigation.push(route, { id: item.ID })}
      />

    );
  };

  return  scroll === "vertical" ? (
      <VerticalScrollComponent<TagData>
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.ID.toString()}
      grid={2}
      leftItem={<Text style={styles.title}>{title}</Text>}
      rightItem={<Text style={styles.title}></Text>}
      isRandom={true}
    />
    ) : (
    <HorizontalScrollComponent<TagData>
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.ID.toString()}
      portraitWidth={3}
      landscapeWidth={1.5}
      fullWidth={true}
      leftItem={<Text style={styles.title}>{title}</Text>}
      rightItem={<Text style={styles.title}></Text>}
      isRandom={true}
    />);
};

const styles = StyleSheet.create({
  title: {
    color: 'black',
    fontSize: 20.0,
    fontFamily: 'SignikaNegative_Bold'
  }
});

export default CategoryGrid;
