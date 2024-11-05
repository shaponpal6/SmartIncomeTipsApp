import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const Button = ({
    title,
    onPress,
    backgroundColor = '#4CAF50',
    textColor = '#FFFFFF',
    borderRadius = 30,
    paddingHorizontal = 20,
    paddingVertical = 10,
    style,
}) => {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <TouchableOpacity
            onPress={onPress}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            activeOpacity={0.9}
            style={[
                styles.button,
                {
                    backgroundColor: isPressed ? '#3E8E41' : backgroundColor, // Darker shade on press
                    borderRadius,
                    paddingHorizontal,
                    paddingVertical,
                },
                style,
            ]}
        >
            <Text style={[styles.buttonText, { color: textColor }]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000', // Adds shadow for depth effect
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // Shadow for Android
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Button;
