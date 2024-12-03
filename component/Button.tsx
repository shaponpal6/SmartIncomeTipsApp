import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  title: string;
  onPress: () => void;
  gradientColors?: string[]; // Gradient colors
  textColor?: string;
  borderRadius?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const GradientButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  gradientColors = ['#4CAF50', '#2E7D32'], // Default gradient colors
  textColor = '#FFFFFF',
  borderRadius = 30,
  paddingHorizontal = 20,
  paddingVertical = 10,
  style,
  textStyle,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={0.9}
      style={[styles.buttonWrapper, style]}
    >
      <LinearGradient
        colors={isPressed ? gradientColors.reverse() : gradientColors} // Reverse colors on press
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.gradient,
          {
            borderRadius,
            paddingHorizontal,
            paddingVertical,
          },
        ]}
      >
        <Text style={[styles.buttonText, { color: textColor }, textStyle]}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    shadowColor: '#000', // Adds shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GradientButton;
