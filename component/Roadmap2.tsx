import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, TextInput, Alert, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "expo-router";

// Updated arrow image sources
const arrow1 = require('../assets/images/arrow1.png');
const arrow2 = require('../assets/images/arrow2.png');
const arrow3 = require('../assets/images/arrow3.png');
const arrow4 = require('../assets/images/arrow4.png');

// TypeScript types
interface RoadmapStep {
  id: number;
  name: string;
  desc: string;
  status: number;
  children: RoadmapStep[];
}

// Sample roadmap data with unique IDs
const roadmapData: RoadmapStep = {
  id: 1,
  name: "Step 1",
  desc: "step 1 desc",
  status: 1,
  children: [
    {
      id: 2,
      name: "Step 2.1",
      desc: "step 2.1 desc",
      status: 0,
      children: [
        {
          id: 3,
          name: "Step 3.1",
          desc: "step 3.1 desc",
          status: 1,
          children: [
            {
              id: 4,
              name: "Step 4.1",
              desc: "step 4.1 desc",
              status: 0,
              children: []
            },
            {
              id: 44,
              name: "Step 4.1",
              desc: "step 4.1 desc",
              status: 0,
              children: []
            },
            {
              id: 45,
              name: "Step 4.1",
              desc: "step 4.1 desc",
              status: 0,
              children: []
            },
          ]
        }
      ]
    },
    {
      id: 5,
      name: "Step 2.2",
      desc: "step 2.2 desc",
      status: 1,
      children: [
        {
          id: 4,
          name: "Step 4.1",
          desc: "step 4.1 desc",
          status: 0,
          children: []
        },
        {
          id: 44,
          name: "Step 4.1",
          desc: "step 4.1 desc",
          status: 0,
          children: []
        },
        {
          id: 45,
          name: "Step 4.1",
          desc: "step 4.1 desc",
          status: 0,
          children: []
        },
      ]
    }
  ]
};

// Function to get the appropriate arrow image based on the number of children
const getArrowImage = (numChildren: number) => {
  switch (numChildren) {
    case 1:
      return arrow1;
    case 2:
      return arrow2;
    case 3:
      return arrow3;
    case 4:
      return arrow4;
    default:
      return null; // No arrow for more than 4 children or 0 children
  }
};

const Roadmap: React.FC = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<RoadmapStep | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    parent_id: '',
    status: '',
    note: ''
  });

  const scrollViewRef = useRef<ScrollView>(null);

  // Set initial scroll to center when component mounts
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: Dimensions.get('window').width / 2, // Scroll horizontally to center
          y: Dimensions.get('window').height / 2, // Scroll vertically to center
          animated: true
        });
      }, 500); // Delay for smooth initial render
    }
  }, []);

  const handlePlusClick = (item: RoadmapStep) => {
    setCurrentItem(item);
    setModalVisible(true);
  };

  const handleSave = () => {
    Alert.alert('Form Values', JSON.stringify(formData));
    setModalVisible(false);
  };

  const renderRoadmap = (item: RoadmapStep, level = 0) => {
    const arrowImage = getArrowImage(item.children.length);

    return (
      <View key={item.id} style={[styles.container, level === 0 ? styles.mainContainer : {}]}>
        <View style={[styles.itemBox, item.status === 1 && styles.completedBox]}>
          <TouchableOpacity
            style={styles.itemBoxInner}
            onPress={() => navigation.push('roadmap/taskScreen', { id: item.id, name: item.name })}
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </TouchableOpacity>

          {/* Plus Icon */}
          <TouchableOpacity style={styles.plusIcon} onPress={() => handlePlusClick(item)}>
            <Ionicons name="add-circle" size={24} color="#007BFF" />
          </TouchableOpacity>
        </View>

        {arrowImage && (
          <Image source={arrowImage} style={styles.arrowImage} resizeMode="cover" />
        )}

        {item.children.length > 0 && (
          <ScrollView
            ref={scrollViewRef}
            horizontal={true}
            contentContainerStyle={styles.childrenContentContainer}
            nestedScrollEnabled={true}
          >
            {item.children.map((child) => renderRoadmap(child, level + 1))}
          </ScrollView>
        )}
      </View>
    );
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.fullScrollView}
      horizontal={true}
      nestedScrollEnabled={true}
    >
      <View style={styles.centeredContainer}>
        {renderRoadmap(roadmapData)}
        <View style={styles.goalContainer}>
          <Text style={styles.goalText}>🎉 Goal Achieved! Well Done! 🎉</Text>
        </View>

        {/* Modal for input */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)} />
          <View style={styles.modalContainer}>
            <Ionicons
              name="close"
              size={24}
              color="#000"
              style={styles.closeIcon}
              onPress={() => setModalVisible(false)}
            />
            <Text>Current Item ID: {currentItem?.id}</Text>
            <TextInput
              placeholder="Name"
              style={styles.input}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
            <TextInput
              placeholder="Description"
              style={styles.input}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
            />
            <TextInput
              placeholder="Type"
              style={styles.input}
              onChangeText={(text) => setFormData({ ...formData, type: text })}
            />
            <TextInput
              placeholder="Note"
              style={styles.input}
              onChangeText={(text) => setFormData({ ...formData, note: text })}
            />
            <Picker
              selectedValue={formData.status}
              onValueChange={(itemValue) => setFormData({ ...formData, status: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label="Select Status" value="" />
              <Picker.Item label="Todo" value="todo" />
              <Picker.Item label="In-progress" value="in-progress" />
              <Picker.Item label="Block" value="block" />
              <Picker.Item label="Done" value="done" />
            </Picker>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  fullScrollView: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Dimensions.get('window').height,
    minWidth: Dimensions.get('window').width,
  },
  container: {
    marginVertical: 8,
  },
  mainContainer: {
    borderLeftWidth: 0,
    borderColor: '#ccc',
    paddingLeft: 0,
  },
  itemBox: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    position: 'relative',
  },
  itemBoxInner: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  completedBox: {
    backgroundColor: '#d4edda',
    borderColor: '#28a745',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  desc: {
    fontSize: 14,
    color: '#555',
  },
  plusIcon: {
    position: 'absolute',
    bottom: -20,
    left: '50%',
    transform: [{ translateX: -12 }],
    zIndex: 1,
  },
  arrowImage: {
    width: '100%',
    height: 80,
    alignSelf: 'center',
    marginVertical: 5,
  },
  childrenContentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  goalContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#cce5ff',
    borderRadius: 8,
    alignItems: 'center',
  },
  goalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004085',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 10,
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 8,
  },
  picker: {
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Roadmap;
