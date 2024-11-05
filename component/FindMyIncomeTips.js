// FindMyIncomeTips.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions } from 'react-native';
import CustomButton from './Button';
import CustomSelect from './CustomSelect';

const FindMyIncomeTips = () => {
    const [profession, setProfession] = useState('Developer');
    const [interest, setInterest] = useState('Technology');
    const [skills, setSkills] = useState('JavaScript');

    const handleButtonPress = () => {
        console.log('Profession:', profession);
        console.log('Interest:', interest);
        console.log('Skills:', skills);
        Alert.alert("Form Values", `Profession: ${profession}, Interest: ${interest}, Skills: ${skills}`);
    };

    const professionOptions = [
        { label: 'Developer', value: 'Developer' },
        { label: 'Designer', value: 'Designer' },
        { label: 'Marketer', value: 'Marketer' },
    ];

    const interestOptions = [
        { label: 'Technology', value: 'Technology' },
        { label: 'Art', value: 'Art' },
        { label: 'Marketing', value: 'Marketing' },
    ];

    const skillsOptions = [
        { label: 'JavaScript', value: 'JavaScript' },
        { label: 'UI/UX Design', value: 'UI/UX Design' },
        { label: 'SEO', value: 'SEO' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.inlineContainer}>
                <Text style={styles.inlineText}>My Profession is </Text>
                <CustomSelect
                    selectedValue={profession}
                    onValueChange={(itemValue) => setProfession(itemValue)}
                    options={professionOptions}
                />
                <Text style={styles.inlineText}> and my interest in </Text>
                <CustomSelect
                    selectedValue={interest}
                    onValueChange={(itemValue) => setInterest(itemValue)}
                    options={interestOptions}
                />
                <Text style={styles.inlineText}> and my Skills in </Text>
                <CustomSelect
                    selectedValue={skills}
                    onValueChange={(itemValue) => setSkills(itemValue)}
                    options={skillsOptions}
                />
                <Text style={styles.inlineText}></Text>
            </View>
            <CustomButton
                title="Find My Income Tips"
                onPress={handleButtonPress}
                backgroundColor="#007BFF"
                textColor="#FFFFFF"
                borderRadius={20}
                paddingHorizontal={20}
                paddingVertical={12}
                style={styles.button}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    inlineContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inlineText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    button: {
        marginTop: 20,
        alignSelf: 'center',
    },
});

export default FindMyIncomeTips;
