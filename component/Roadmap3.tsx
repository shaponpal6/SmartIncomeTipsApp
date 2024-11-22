import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { Text, Button, IconButton, Card, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

interface RoadmapStep {
  id: number;
  name: string;
  desc: string;
  status: number;
  children: RoadmapStep[];
}

const roadmapData: RoadmapStep = {
  id: 1,
  name: "Step 1",
  desc: "Description for step 1",
  status: 1,
  children: [
    {
      id: 2,
      name: "Step 1.1",
      desc: "Description for step 1.1",
      status: 0,
      children: [
        {
          id: 3,
          name: "Step 1.1.1",
          desc: "Description for step 1.1.1",
          status: 1,
          children: []
        }
      ]
    },
    {
      id: 4,
      name: "Step 1.2",
      desc: "Description for step 1.2",
      status: 1,
      children: []
    }
  ]
};

const Roadmap: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<RoadmapStep | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const theme = useTheme();

  const handlePlusClick = (item: RoadmapStep) => {
    setCurrentItem(item);
    setModalVisible(true);
  };

  const handleSave = () => {
    Alert.alert('Form Saved', `Name: ${formData.name}\nDescription: ${formData.description}`);
    setModalVisible(false);
  };

  const renderRoadmap = (item: RoadmapStep, indexPrefix = '', level = 0) => {
    const currentIndex = `${indexPrefix}${level > 0 ? '.' : ''}${item.id}`;

    return (
      <View key={item.id}>
        <View style={[styles.rowContainer, { marginLeft: level * 20 }]}>
          <View style={styles.indexContainer}>
            <Text style={styles.indexText}>{currentIndex}</Text>
            <View style={styles.dottedLine} />
          </View>
          <Card style={[styles.card, item.status === 1 && { backgroundColor: theme.colors.primaryContainer }]}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text variant="titleMedium" style={styles.stepText}>{item.name}</Text>
                <Text variant="bodySmall" style={styles.descText}>{item.desc}</Text>
              </View>
              <IconButton
                icon="plus-circle"
                size={24}
                iconColor={theme.colors.primary}
                onPress={() => handlePlusClick(item)}
              />
            </Card.Content>
          </Card>
        </View>
        {/* Recursively render child items */}
        {item.children.map((child, index) => renderRoadmap(child, currentIndex, level + 1))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderRoadmap(roadmapData)}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Ionicons
              name="close"
              size={24}
              color="#000"
              style={styles.closeIcon}
              onPress={() => setModalVisible(false)}
            />
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
            <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
              Save
            </Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  indexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  indexText: {
    fontSize: 14,
    marginRight: 4,
  },
  dottedLine: {
    borderWidth: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#555',
    height: '100%',
    borderStyle: 'dotted',
    marginRight: 8,
    width: 2,
    backgroundColor: 'transparent',
  },
  dottedBorder: {
    position: 'absolute',
    left: 20,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'transparent',
    borderLeftWidth: 2,
    borderLeftColor: '#CCC',
    borderStyle: 'dotted',
  },
  indexCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#D1D1D1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -15,
    zIndex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  stepText: {
    fontWeight: '600',
    color: '#333',
  },
  descText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
  },
  closeIcon: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  saveButton: {
    marginTop: 8,
  },
});

export default Roadmap;
