import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons'; // Ensure this package is installed

const CustomSelect = ({ selectedValue, onValueChange, options, title="" }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handlePress = () => {
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{title}</Text>
            <TouchableOpacity onPress={handlePress} style={styles.selectBox}>
                <Text style={styles.selectedText}>{selectedValue || 'Select an option'}</Text>
                <Ionicons name="chevron-down" size={20} color="#000" />
            </TouchableOpacity>

            {/* Modal for Picker */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Picker
                            selectedValue={selectedValue}
                            onValueChange={(itemValue) => {
                                onValueChange(itemValue);
                                setModalVisible(false);
                            }}
                        >
                            {options.map((option) => (
                                <Picker.Item key={option.value} label={option.label} value={option.value} />
                            ))}
                        </Picker>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    selectBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    selectedText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 5,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default CustomSelect;
