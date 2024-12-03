import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Search from './Search'
import { FAB } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';
import BotResponse from './BotResponse';
import { useDatabase } from '../store/SQLiteDatabaseContext';

const { width, height } = Dimensions.get('window');

const _stepsData = {
  1: {
    text: "Hello! I’m WOALA, your AI assistant. My goal is to help you explore ways to earn money online. Do you want to proceed?",
    options: [
      { id: 1, label: "Yes, guide me!", field: "confirm", nextStep: 2 },
      { id: 1, label: "No, thank you", field: "confirm", nextStep: 0 },
    ],
  },
  2: {
    text: "Fantastic! To better assist you, I need some details. First, can you tell me which profession aligns with you the most?",
    options: [
      { id: 1, label: "Student", field: "profession", nextStep: 3 },
      { id: 1, label: "Freelancer", field: "profession", nextStep: 3 },
      { id: 1, label: "Employee", field: "profession", nextStep: 3 },
    ],
  },
  3: {
    text: "Great! Now, could you share your primary interests?",
    options: [
      { id: 1, label: "Technology", field: "interests", nextStep: 4 },
      { id: 1, label: "Art", field: "interests", nextStep: 4 },
      { id: 1, label: "Finance", field: "interests", nextStep: 4 },
    ],
  },
  4: {
    text: "Thank you! Finally, what is your key skill or expertise?",
    options: [
      { id: 1, label: "Programming", field: "skills", nextStep: 5 },
      { id: 1, label: "Design", field: "skills", nextStep: 5 },
      { id: 1, label: "Marketing", field: "skills", nextStep: 5 },
    ],
  },
};

const ChatBot: React.FC = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState(0); // Tracks the current chatbot step
  const [botInit, setBotInit] = useState(false); // Controls the visibility of the chatbot
  const [visible, setVisible] = useState(true); // Controls the visibility of the chatbot
  const [botAnswer, setBotAnswer] = useState(false); // Controls the visibility of the chatbot
  const fadeAnim = new Animated.Value(0); // Animation for text fade-in
  const [botData, setBotData] = useState({ confirm: 'no', search: '', profession: '', interests: '', skills: '' });
  const isConfirm = botData?.confirm?.toLowerCase().includes('yes') || false
  const { getUserChoose } = useDatabase();

  const [stepsData, setStepsData] = useState(_stepsData);
  const [data, setData] = useState({ posts: [], tags: [], configs: [{ key: 'site_title', value: 'Smart Income Tips' }], categories: [], courses: [], featurePosts: [], topPosts: [], newPosts: [], otherPosts: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [queryData, setQueryData] = useState({ search: '', profession: [], interests: [], skills: [] });

  useEffect(() => {
    setQueryData({...queryData, search: search});
  }, [search])

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (isMounted) {
        setLoading(true);
        try {
          const fetchedData = await getUserChoose();
          setData(fetchedData);
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let newData = stepsData;
    // console.log('data?.profession :>> ', data?.profession);
    if(data?.profession){
      newData[2] = {text: newData[2].text, options: data?.profession?.map(profession =>({id: profession.term_id, label: profession.name, field: "profession", nextStep: 3 }))}
    }
    if(data?.interests){
      newData[3] = {text: newData[3].text, options: data?.interests?.map(interest =>(
        {id: interest.term_id, label: interest.name, field: "interests", nextStep: 4 }
     ))}
    }
    // console.log('data?.interest :>> ', data?.interests);
    if(data?.skills){
      newData[4] = {text: newData[4].text, options: data?.skills?.map(skills => (
        {id: skills.term_id, label: skills.name, field: "skills", nextStep: 5 }
     ))}
    }
    setStepsData(newData)

  }, [data])

  useEffect(() => {
    if (step === 0) {
      setTimeout(() => {
        setBotInit(true)
        setStep(1)
      }, botInit ? 100 : 3000);
    }
    // if (step === 1 && !isConfirm) cancelBot();
  }, [step]);

  useEffect(() => {
    if (!isConfirm) cancelBot();
  }, [botData.confirm]);

  useEffect(() => {
    // Fade-in animation for each new message
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const handleOptionPress = (field: string, value: string, nextStep: number, id: number) => {
    if (field) {
      setBotData({ ...botData, [field]: value });
      if(field !=='confirm') setQueryData({ ...queryData, [field]: [id] });
    }
    console.log('queryData :>> ', queryData);
    fadeAnim.setValue(0); // Reset fade animation
    setStep(nextStep); // Progress to the next step
  };

  const cancelBot = () => {
    setVisible(false);
    setBotData({ ...botData, confirm: 'no' });
    setStep(0); // Reset steps if the bot is canceled
  };

  const startBot = () => {
    console.log('bot click :>> ', visible);
    setVisible(!visible);
    setBotAnswer(false);
    setBotData({ ...botData, confirm: 'no' });
    setStep(0); // Reset steps if the bot is canceled
  };

  const renderOptions = (options) => {
    return options.map((option, index) => (
      <TouchableOpacity
        key={index}
        style={styles.option}
        onPress={() => handleOptionPress(option.field, option.label, option.nextStep, option.id)}
      >
        <LinearGradient
          colors={['#6a11cb', '#2575fc']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.optionGradient}
        >
          <Text style={styles.optionText}>{option.label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    ));
  };

  const submitHandler = () => {
    setBotAnswer(true);
  }
  const renderStepContent = () => {
    const stepData = stepsData[step];
    console.log('step 22:>> ', step);
    if (step === 1 && !isConfirm) {
      // setVisible(false);
      // setBotAnswer(true);
    }
    if (step === 5) {
      // setVisible(false);
      submitHandler();
    }
    if (!stepData) return null;

    const answer = {
      "intro": "Here is the answer.....", // Write a standard professional intro text
      "answer1": { // Write demo title and 10 demo data item  
        "title": "This is the Title 1", // As Title
        "data": [{ ID: 1, post_title: "This is the Title 1" }] // As list
      },
      "answer2": { // Write demo title and 10 demo data item 
        "title": "This is the Title 2",
        "data": [{ ID: 10, post_title: "This is the Title 2" }],
      },
      "answer3": { // Write demo title and 10 demo data item 
        "title": "This is the Title 3",
        "data": [{ ID: 122, post_title: "This is the Title 33" }],
      },
      "summery": "This is the Summery text" // Write a standard professional closing text
    }

    return (
      <>
        <Text style={styles.botText}>{stepData.text}</Text>
        <View style={styles.answerContainer}>
          {renderOptions(stepData.options)}
        </View>
      </>
    );
  };

  const makeBotResponse = () => {
    return <BotResponse queryData={queryData}/>
  }

  //   if (!visible) return null;

  return (
    <>
      {/* FAB to open chatbot */}
      <FAB
        icon="robot"
        style={styles.fab}
        onPress={startBot}
      />
      {/* Chatbot UI */}
      {visible && (
        <View style={styles.chatBotContainer}>

          <LinearGradient
            colors={['transparent', 'rgba(255, 255, 255, 0.9)']}
            style={styles.gradientContainer}
          >
            {/* Cancel Button */}
            <TouchableOpacity style={styles.cancelButton} onPress={cancelBot}>
              <MaterialIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
            {!botInit ? <Text>Loading...</Text> : <></>}
            {/* Animated Message Container */}
            <Animated.View style={[styles.messageContainer, { opacity: fadeAnim }]}>
              {botAnswer ? makeBotResponse() : renderStepContent()}

            </Animated.View>
            {isConfirm && (<Search
              placeholder="Write about your skills..."
              onSubmit={submitHandler}
              onChange={setSearch}
              containerStyle={{ backgroundColor: "#f9f9f9", paddingHorizontal: 10 }}
              inputStyle={{ fontSize: 16, color: "#333" }}
              buttonStyle={{ backgroundColor: "#f9f9f9" }}
              isLeftIcon={false}
            />)}
          </LinearGradient>

        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  chatBotContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: width * 0.9,
    maxHeight: height * 0.6,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  gradientContainer: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  messageContainer: {
    flex: 1,
  },
  botText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 20,
    marginTop: 10,
  },
  answerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    margin: 5,
  },
  optionGradient: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  optionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',

  },
  cancelButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6a11cb',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatBot;
