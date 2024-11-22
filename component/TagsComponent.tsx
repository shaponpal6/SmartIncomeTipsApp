import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { useNavigation } from "expo-router";

interface Tag {
  term_id: number;
  name: string;
}

interface TagsComponentProps {
  tags: Tag[];
  maxItemsToDisplay?: number;
}

// const categoryImage = require('../assets/images/category/category_6.jpg');
const categoryImage = require('../assets/images/bg.jpg');

// Constants for layout calculation
const MAX_CHARACTERS_PER_ROW = 80;

// Function to distribute tags into rows with long names at the end and avoid gaps
const arrangeTagsForMaxFit = (tags: Tag[]) => {
  // Sort tags by name length in ascending order to place long names last
  const sortedTags = [...tags].sort((a, b) => a.name.length - b.name.length);

  const rows: Tag[][] = [];
  let currentRow: Tag[] = [];
  let currentRowCharCount = 0;

  sortedTags.forEach((tag) => {
    const tagCharLength = tag.name.length;

    // Try to add the tag to the current row if it fits
    if (currentRowCharCount + tagCharLength <= MAX_CHARACTERS_PER_ROW && currentRow.length < 3) {
      currentRow.push(tag);
      currentRowCharCount += tagCharLength;
    } else {
      // Push current row to rows array and reset for the next row
      rows.push(currentRow);
      currentRow = [tag];
      currentRowCharCount = tagCharLength;
    }
  });

  // Push any remaining tags in the last row
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return rows;
};

const TagsComponent: React.FC<TagsComponentProps> = ({ tags, maxItemsToDisplay = 20 }) => {
  const navigation = useNavigation();
  const displayedTags = tags.slice(0, maxItemsToDisplay);
  const rows = arrangeTagsForMaxFit(displayedTags);

  return (
    <View style={styles.container}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item) => (
            <TouchableOpacity
              key={item.term_id}
              activeOpacity={0.9}
              onPress={() => navigation.push('category/categoriesScreen', { id: item.term_id, category: item.name })}
              style={[styles.tagBox, { flexBasis: `${100 / row.length}%` }]} // Dynamically set width
            >
              {/* <ImageBackground source={categoryImage} style={styles.imageBackground} imageStyle={styles.imageStyle}> */}
                <Text style={styles.tagText}>{item.name.replace(/<\/?[^>]+(>|$)|&\w+;/g, '')}</Text>
              {/* </ImageBackground> */}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginHorizontal: 8,
    marginVertical: 6,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2,
    gap: 2
  },
  tagBox: {
    marginBottom: 1,
    borderRadius: 12,
    overflow: 'hidden',
    padding: 1,
    backgroundColor: '#235758',
    paddingHorizontal: 1,
    paddingVertical: 10,
  },
  imageBackground: {
    paddingHorizontal: 1,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  imageStyle: {
    borderRadius: 12,
  },
  tagText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TagsComponent;
