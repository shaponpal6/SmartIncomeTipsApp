// CustomSelect.js
import React from 'react';
import { View, StyleSheet, Picker } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure @expo/vector-icons is installed

const CustomSelect = ({ selectedValue, onValueChange, options }) => {
    return (
        <View style={styles.selectContainer}>
            <Picker
                selectedValue={selectedValue}
                onValueChange={onValueChange}
                style={styles.picker}
                mode="dropdown"
            >
                {options.map((option) => (
                    <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
            </Picker>
            <Ionicons name="chevron-down" size={20} color="#000" style={styles.icon} />
        </View>
    );
};

const styles = StyleSheet.create({
    selectContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        marginHorizontal: 5,
        flex: 1,
    },
    picker: {
        flex: 1,
        width: '100%',
        height: 40,
        color: '#000',
        backgroundColor: 'transparent', // No background color
        fontWeight: 'bold', // Bold text for better visibility
        borderWidth: 0,
        paddingRight: 2, 
    },
    icon: {
        position: 'absolute',
        right: 0,
    },
});

export default CustomSelect;
