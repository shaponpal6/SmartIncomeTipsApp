import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import { useNavigation } from 'expo-router';
import { useDatabase } from '../store/SQLiteDatabaseContext';
import { provide } from 'vue';

const { height } = Dimensions.get('window');

type DataItem = { ID: number; post_title: string; [key: string]: any };

type PreparingInput = {
  answer1: DataItem[] | null | undefined;
  answer2: DataItem[] | null | undefined;
  answer3: DataItem[] | null | undefined;
};

type Section = {
  title: string;
  data: { ID: number; post_title: string }[];
};

type AnswerData = {
  intro: string;
  answer1: Section;
  answer2?: Section | null;
  answer3?: Section | null;
  summery: string;
};

const BotResponse: React.FC = ({queryData}:any) => {
  const navigation = useNavigation();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [renderedText, setRenderedText] = useState<string[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const [query, setQuery] = useState({ search: '', page: 1, limit: 20, postType: 'post'});

  useEffect(() => {
    console.log('queryData :>> ', queryData);
    setQuery({...query, ...queryData});
  }, [queryData])
  
  const answer: AnswerData = {
    intro: 'Here is the answer.....',
    answer1: {
      title: 'This is the Title 1',
      data: Array.from({ length: 10 }, (_, i) => ({ ID: i + 1, post_title: `This is Item ${i + 1}` })),
    },
    // answer2: {
    //   title: 'This is the Title 2',
    //   data: Array.from({ length: 10 }, (_, i) => ({ ID: i + 10, post_title: `This is Item ${i + 10}` })),
    // },
    // answer3: {
    //   title: 'This is the Title 3',
    //   data: Array.from({ length: 10 }, (_, i) => ({ ID: i + 20, post_title: `This is Item ${i + 20}` })),
    // },
    summery: 'This is the summary text.',
  };

  const { searchPosts } = useDatabase();

    const [state, setState] = useState({
        isTextFieldFocus: false
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const { isTextFieldFocus } = state;

    const preparingData = ({ answer1, answer2, answer3 }: PreparingInput): AnswerData => {
        const formatSection = (title: string, data: DataItem[] | null | undefined): Section | null => {
          if (!data || !Array.isArray(data) || data.length === 0) return null;
          return {
            title,
            data: data.slice(0, 10).map((item) => ({
              ID: item.ID,
              post_title: item.post_title,
            })),
          };
        };
        return {
          intro: 'Here is the answer.....',
          answer1: formatSection('This is the Title 1', answer1) as Section,
          answer2: formatSection('This is the Title 2', answer2),
          answer3: formatSection('This is the Title 3', answer3),
          summery: 'This is the summary text.',
        };
      };
      

    async function loadData() {
        try{
            const data = await searchPosts(query);
              
              const dynamicData = preparingData({
                answer1: data || null,
                answer2: null, // Handles null gracefully
                answer3: undefined, // Handles undefined gracefully
              });
              console.log('dynamicData :>> ', dynamicData);
            startTyping((dynamicData));
            setIsAnalyzing(false);
        }catch(err){
            setIsAnalyzing(false);
            console.error('err :>> ', err);
        }
    }

    useEffect(() => {
        loadData();
    }, [query]);

//   useEffect(() => {
//     // Simulate analyzing phase
//     const timeout = setTimeout(() => {
//       setIsAnalyzing(false);
//       startTyping(answer);
//     }, 3000);
//     return () => clearTimeout(timeout);
//   }, []);

  const startTyping = (data: AnswerData) => {
    const keys = Object.keys(data) as (keyof AnswerData)[];
    let delay = 0;

    keys.forEach((key) => {
      const value = data[key];
      if (typeof value === 'string') {
        // Type text for intro or summary
        delay += value.length * 50;
        typeText(value, delay);
      } else if (typeof value === 'object') {
        // Type section title
        delay += value?.title ? value.title.length * 50 : 0;
        value?.title ? typeText(value.title, delay): null;

        // Type list items
        value?.data?.length && value.data.forEach((item) => {
          delay += 300;
          typeText(`- ${item.ID} : ${item.post_title}`, delay, () => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          });
        });
      }
    });
  };

  const typeText = (text: string, delay: number, callback?: () => void) => {
    setTimeout(() => {
      setRenderedText((prev) => [...prev, text]);
      if (callback) callback();
    }, delay);
  };

  const parseText = (text: string) => {
    const regex = /^-\s(\d+)\s:\s(.+)$/; // Regex to match "- {number} : {title}"
    const match = text.match(regex);
  
    if (match) {
      const id = parseInt(match[1], 10); // Extracted number as ID
      const title = match[2]; // Extracted title
      return { id, title };
    }
  
    return null; // Return null if text does not match the pattern
  };

  const renderTextContent = () => {
    return renderedText.map((line, index) => {
        // console.log('line :>> ', line);
      const row = parseText(line);
      if (row) {
        const id = row.id;
        // console.log('id :>> ', id);
        const postTitle = row.title;
        return (
          <TouchableOpacity
            key={index}
            style={styles.itemContainer}
            onPress={() =>
              navigation.push('postDetail/postDetailScreen', {
                id: id, // Replace with actual item ID when dynamic
              })
            }
          >
            <Text style={styles.itemText}>{postTitle}</Text>
          </TouchableOpacity>
        );
      }
      return (
        <Text key={index} style={styles.text}>
          {line}
        </Text>
      );
    });
  };

  if (isAnalyzing) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Analyzing...</Text>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {renderTextContent()}
      </ScrollView>
      {/* <Text style={{textAlign: 'center'}}>We will provide only our experiences</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: height * 0.6,
    backgroundColor: 'transparent', // Transparent background
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  scrollView: {
    flexGrow: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    padding: 10,
    backgroundColor: 'transparent',
    borderRadius: 10,
    marginVertical: 5,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default BotResponse;
