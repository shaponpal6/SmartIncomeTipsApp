import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Animated } from 'react-native';
import CustomButton from './Button';
import CustomSelect from './CustomSelect';
import { Ionicons } from '@expo/vector-icons';
import { useDatabase } from '../store/SQLiteDatabaseContext';

// Utility function to generate a random ID
const generateRandomId = () => Math.floor(Math.random() * 1000);
const FindMyIncomeTips = ({onChange=null}) => {
    const [step, setStep] = useState(1);
    const [selectedProfession, setSelectedProfession] = useState(null);
    const [selectedInterest, setSelectedInterest] = useState(null);
    const [selectedSkills, setSelectedSkills] = useState(null);
    const [showInterest, setShowInterest] = useState(false);
    const [showSkills, setShowSkills] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const { getUserChoose } = useDatabase();

    const [data, setData] = useState({posts:[], tags:[], configs: [{key: 'site_title', value: 'Smart Income Tips'}], categories:[], courses: [], featurePosts: [], topPosts: [], newPosts: [], otherPosts: []});
    const [loading, setLoading] = useState(true);

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

    //   console.log('data :>> ', data);


    const handleReset = () => {
        setStep(1);
        setSelectedProfession(null);
        setSelectedInterest(null);
        setSelectedSkills(null);
        setShowInterest(false);
        setShowSkills(false);
    };

    const handleButtonPress = () => {
        if( onChange){
            onChange({profession: selectedProfession, interest: selectedInterest, skills: selectedSkills})
        }
        // Alert.alert(
        //     "Form Values",
        //     `Profession: ${selectedProfession}, Interest: ${selectedInterest}, Skills: ${selectedSkills}`
        // );
    };

    const professionOptions = !loading ? data.profession :
    [
        { label: 'Developer', value: 'Developer', term_id: generateRandomId() },
        { label: 'Designer', value: 'Designer', term_id: generateRandomId() },
        { label: 'Marketer', value: 'Marketer', term_id: generateRandomId() },
    ];
    console.log('professionOptions :>> ', professionOptions);

    const interestOptions = !loading ? data.interests :[
        { label: 'Technology', value: 'Technology', term_id: generateRandomId() },
        { label: 'Art', value: 'Art', term_id: generateRandomId() },
        { label: 'Marketing', value: 'Marketing', term_id: generateRandomId() },
    ];

    const skillsOptions = !loading ? data.skills :[
        { label: 'JavaScript', value: 'JavaScript', term_id: generateRandomId() },
        { label: 'UI/UX Design', value: 'UI/UX Design', term_id: generateRandomId() },
        { label: 'SEO', value: 'SEO', term_id: generateRandomId() },
    ];

    const startAnimation = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    // Trigger the animation on component mount
    React.useEffect(() => {
        startAnimation();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {!selectedProfession && (
                    <>
                    <Text style={styles.label}>My Profession is:</Text>
                    <View style={styles.optionsContainer}>
                        {professionOptions.map((option) => (
                            <TouchableOpacity
                                key={option.term_id}
                                style={styles.option}
                                onPress={() => {
                                    setSelectedProfession(option);
                                    setStep(2);
                                    setShowInterest(true);
                                }}
                            >
                                <Text style={styles.optionText}>{option.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    </>
                )}
                {selectedProfession && (
                    <CustomSelect
                        title="My Profession is:"
                        selectedValue={selectedProfession.name}
                        onValueChange={(itemValue) => setSelectedProfession(itemValue)}
                        options={professionOptions}
                    />
                )}
                

                {showInterest && (
                    <>
                        {!selectedInterest && (
                            <>
                        <Text style={styles.label}>and my interest in:</Text>
                            <View style={styles.optionsContainer}>
                                {interestOptions && interestOptions.length && interestOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.term_id}
                                        style={styles.option}
                                        onPress={() => {
                                            setSelectedInterest(option);
                                            setStep(3);
                                            setShowSkills(true);
                                        }}
                                    >
                                        <Text style={styles.optionText}>{option.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            </>
                        )}
                        {selectedInterest && (
                            <CustomSelect
                                title="and my interest in:"
                                selectedValue={selectedInterest.name}
                                onValueChange={(itemValue) => setSelectedInterest(itemValue)}
                                options={interestOptions}
                            />
                        )}
                    </>
                )}

                {showSkills && (
                    <>
                        {!selectedSkills && (
                            <>
                        <Text style={styles.label}>and my skills in:</Text>
                            <View style={styles.optionsContainer}>
                                {skillsOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.term_id}
                                        style={styles.option}
                                        onPress={() => setSelectedSkills(option)}
                                    >
                                        <Text style={styles.optionText}>{option.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            </>
                        )}
                        {selectedSkills && (
                            <CustomSelect
                                title="and my skills in:"
                                selectedValue={selectedSkills.name}
                                onValueChange={(itemValue) => setSelectedSkills(itemValue)}
                                options={skillsOptions}
                            />
                        )}
                    </>
                )}
            </Animated.View>

            <View style={styles.buttonContainer}>
                <CustomButton
                    title="Find My Income Tips"
                    onPress={handleButtonPress}
                    backgroundColor="#007BFF"
                    textColor="#FFFFFF"
                    borderRadius={20}
                    paddingHorizontal={20}
                    paddingVertical={12}
                    style={styles.inlineButton}
                />
                <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                    <Ionicons name="refresh" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 15,
    },
    content: {
        alignItems: 'center',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 10,
    },
    option: {
        backgroundColor: '#e0e0e0',
        padding: 10,
        borderRadius: 8,
        margin: 5,
    },
    optionText: {
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 20,
    },
    inlineButton: {
        marginRight: 10,
    },
    resetButton: {
        backgroundColor: '#FF0000',
        borderRadius: 20,
        padding: 12,
    },
});

export default FindMyIncomeTips;
