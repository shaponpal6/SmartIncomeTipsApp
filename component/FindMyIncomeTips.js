import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Animated } from 'react-native';
import CustomButton from './Button';
import CustomSelect from './CustomSelect';
import { Ionicons } from '@expo/vector-icons';

// Utility function to generate a random ID
const generateRandomId = () => Math.floor(Math.random() * 1000);
const FindMyIncomeTips = () => {
    const [step, setStep] = useState(1);
    const [selectedProfession, setSelectedProfession] = useState(null);
    const [selectedInterest, setSelectedInterest] = useState(null);
    const [selectedSkills, setSelectedSkills] = useState(null);
    const [showInterest, setShowInterest] = useState(false);
    const [showSkills, setShowSkills] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));

    const handleReset = () => {
        setStep(1);
        setSelectedProfession(null);
        setSelectedInterest(null);
        setSelectedSkills(null);
        setShowInterest(false);
        setShowSkills(false);
    };

    const handleButtonPress = () => {
        Alert.alert(
            "Form Values",
            `Profession: ${selectedProfession}, Interest: ${selectedInterest}, Skills: ${selectedSkills}`
        );
    };

    const professionOptions = [
        { label: 'Developer', value: 'Developer', term_id: generateRandomId() },
        { label: 'Designer', value: 'Designer', term_id: generateRandomId() },
        { label: 'Marketer', value: 'Marketer', term_id: generateRandomId() },
    ];

    const interestOptions = [
        { label: 'Technology', value: 'Technology', term_id: generateRandomId() },
        { label: 'Art', value: 'Art', term_id: generateRandomId() },
        { label: 'Marketing', value: 'Marketing', term_id: generateRandomId() },
    ];

    const skillsOptions = [
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
                                    setSelectedProfession(option.value);
                                    setStep(2);
                                    setShowInterest(true);
                                }}
                            >
                                <Text style={styles.optionText}>{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    </>
                )}
                {selectedProfession && (
                    <CustomSelect
                        title="My Profession is:"
                        selectedValue={selectedProfession}
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
                                {interestOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.term_id}
                                        style={styles.option}
                                        onPress={() => {
                                            setSelectedInterest(option.value);
                                            setStep(3);
                                            setShowSkills(true);
                                        }}
                                    >
                                        <Text style={styles.optionText}>{option.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            </>
                        )}
                        {selectedInterest && (
                            <CustomSelect
                                title="and my interest in:"
                                selectedValue={selectedInterest}
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
                                        onPress={() => setSelectedSkills(option.value)}
                                    >
                                        <Text style={styles.optionText}>{option.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            </>
                        )}
                        {selectedSkills && (
                            <CustomSelect
                                title="and my skills in:"
                                selectedValue={selectedSkills}
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
