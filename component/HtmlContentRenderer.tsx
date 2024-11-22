import React from 'react';
import { ScrollView, StyleSheet, Image, View } from 'react-native';
import RenderHtml, { CustomRendererProps } from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';

interface HtmlContentRendererProps {
  htmlContent: string;
}

// Custom renderer function for 'img' tags
const customImgRenderer = ({ tnode }: CustomRendererProps<any>) => {
  const { attributes } = tnode;
  const { src, alt = 'Image' } = attributes;

  return (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: src }}
        style={styles.image}
        accessibilityLabel={alt}
        resizeMode="cover"
      />
    </View>
  );
};

const HtmlContentRenderer: React.FC<HtmlContentRendererProps> = ({ htmlContent }) => {
  const { width: contentWidth } = useWindowDimensions();

  // Custom renderers object for RenderHtml
  const customRenderers = {
    img: (props: CustomRendererProps<any>) => customImgRenderer(props),
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <RenderHtml
        contentWidth={contentWidth}
        source={{ html: htmlContent }}
        renderers={customRenderers}
        tagsStyles={styles.tagsStyles}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 8,
  },
  image: {
    width: '100%',
    height: 200, // Adjust as needed or remove to allow dynamic sizing
    objectFit: 'cover',
  },
  tagsStyles: {
    p: {
      fontSize: 16,
      marginVertical: 4,
      lineHeight: 24,
    },
    h1: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 8,
      color: '#333',
    },
    h2: {
      fontSize: 20,
      fontWeight: '600',
      marginVertical: 6,
      color: '#444',
    },
    ul: {
      paddingLeft: 20,
      marginVertical: 4,
    },
    li: {
      fontSize: 16,
      marginVertical: 2,
    },
    strong: {
      fontWeight: 'bold',
    },
    div: {
      marginVertical: 6,
    },
  },
});

export default HtmlContentRenderer;
