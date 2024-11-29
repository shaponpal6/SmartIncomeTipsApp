import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Roadmap } from "../types";
import { timelineData } from "../data/roadmap";
import { useDatabase } from "../store/SQLiteDatabaseContext";

const TaskModal = ({
  visible,
  task,
  onSave,
  onClose,
}: {
  visible: boolean;
  task?: Roadmap | null;
  onSave: (data: Roadmap) => void;
  onClose: () => void;
}) => {
  const [title, setTitle] = useState(task?.title || "");
  const [desc, setDesc] = useState(task?.desc || "");

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDesc(task.desc || "");
    }
  }, [task]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {task ? "Edit Task" : "Add Task"}
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Description"
            value={desc}
            onChangeText={setDesc}
            multiline
          />
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                if (title.trim()) {
                  onSave({ ...task, title, desc } as Roadmap);
                }
              }}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const TimelineComponent = ({ uid, pid }: { uid: number; pid: number }) => {
  const { getRoadmap, addRoadmap, updateRoadmap, deleteRoadmapTask } =
    useDatabase();
  const [tasks, setTasks] = useState<Roadmap[]>([]);
  const [selectedTask, setSelectedTask] = useState<Roadmap | null>(null);
  const [expandedTasks, setExpandedTasks] = useState<{
    [key: string]: boolean;
  }>({});
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadRoadmap = async () => {
      const dbTasks = await getRoadmap(pid);
      if (dbTasks.length === 0) {
        const initialData = timelineData.map((item) => ({
          ...item,
          uid,
          pid,
          id: Date.now().toString(),
        }));
        for (const task of initialData) {
          await addRoadmap(task);
        }
        setTasks(initialData);
      } else {
        setTasks(dbTasks);
      }
    };
    loadRoadmap();
  }, [uid, pid]);

  const handleToggleExpand = (id: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddTask = (parent: number = 0) => {
    setSelectedTask({
      id: "",
      uid,
      pid,
      parent,
      title: "",
      desc: "",
      progress: "0%",
      status: 1,
      input: 0,
      answer: "",
    });
    setModalVisible(true);
  };

  const handleSaveTask = async (task: Roadmap) => {
    if (task.id) {
      await updateRoadmap(task);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, title: task.title, desc: task.desc } : t
        )
      );
    } else {
      const newTask = { ...task, id: Date.now().toString() };
      await addRoadmap(newTask);
      setTasks((prev) => [...prev, newTask]);
    }
    setModalVisible(false);
  };

  const handleDeleteTask = async (id: string) => {
    await deleteRoadmapTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const renderTasks = (taskList: Roadmap[], parent: number = 0, level: number = 1,) => {
    let count = 1;
    return taskList
      .filter((task) => task.parent === parent)
      .map((task) => (
        <View key={task.id} style={[styles.taskContainer, task.parent !== 0 && styles.contentWrapper, { marginLeft: task.parent === 0 ? 2 * 10 : 10 }, { minHeight: task.parent === 0 ? 60 : 10 }]}>
          {task.parent === 0 ? (<View style={styles.iconWrapper}>
            <Text style={styles.iconText}>{count++}</Text>
          </View>):(<View style={styles.iconWrapper2}>
            <Text style={styles.iconText}>{}</Text>
          </View>)}
          <TouchableOpacity
            style={[styles.taskHeader]}
            onPress={() => handleToggleExpand(task.id)}
          >
            <Text style={[
              styles.taskTitle,
              { color: task.status === 1 ? "green" : "black" },
              { marginLeft: task.parent === 0 ? 10 : 0 },
              styles.taskTitle]}>{task.title}</Text>
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => {
                  setSelectedTask(task);
                  setModalVisible(true);
                }}
              >
                <Text>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleDeleteTask(task.id)}
              >
                <Text>🗑️</Text>
              </TouchableOpacity>
              <Text style={styles.caret}>{expandedTasks[task.id] ? "▲" : "▼"}</Text>
            </View>
          </TouchableOpacity>
          {expandedTasks[task.id] && (
            <View style={styles.taskContent}>
              <Text style={styles.desc}>{task.desc}</Text>
              {renderTasks(tasks, parseInt(task.id))}
              <TouchableOpacity
                style={styles.addSubtaskButton}
                onPress={() => handleAddTask(parseInt(task.id))}
              >
                <Text style={styles.addSubtaskText}>+ Add Subtask</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ));
  };

  return (
    <ScrollView>
      {renderTasks(tasks)}
      <TouchableOpacity
        style={styles.addTaskButton}
        onPress={() => handleAddTask()}
      >
        <Text style={styles.addTaskText}>+ Add Parent Task</Text>
      </TouchableOpacity>
      <TaskModal
        visible={modalVisible}
        task={selectedTask}
        onSave={handleSaveTask}
        onClose={() => setModalVisible(false)}
      />
    </ScrollView>
  );
};

export default TimelineComponent;
const styles = StyleSheet.create({
  taskContainer: {
    // margin: 10,
    // borderBottomWidth: 1,
    // paddingBottom: 10,
    paddingTop: 4,
    paddingBottom: 25,
    // minHeight: 60,
    borderLeftWidth: 2,
    borderColor: "red",
    paddingLeft: 10,
  },
  desc: {
    // backgroundColor: "#fff",
    // padding: 10,
    // marginVertical: 6,
    paddingBottom: 10,
    // borderRadius: 5,
  },
  contentWrapper: {
    // backgroundColor: "#fff",
    padding: 10,
    // marginVertical: 6,
    paddingBottom: 10,
    // borderRadius: 5,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskTitle: { fontSize: 16, fontWeight: "bold" },
  activeTask: { color: "green" },
  taskContent: { marginLeft: 20, marginTop: 10 },
  addTaskButton: {
    marginHorizontal: 10,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 0,
  },
  addTaskText: { color: "white", textAlign: "center" },
  addSubtaskButton: {
    // marginTop: 10,
    backgroundColor: "red",
    padding: 2,
    // borderRadius: 5,
  },
  addSubtaskText: { 
    color: "white", 
    textAlign: "center",
    margin: 0,
    padding: 0,
    backgroundColor: "red"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: { fontWeight: "bold", fontSize: 18 },
  textInput: {
    borderWidth: 1,
    marginVertical: 10,
    padding: 5,
    borderRadius: 5,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  saveButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5

  },
  saveButtonText: { color: "white" },
  cancelButton: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5
  },
  cancelButtonText: { color: "white" },
  actionsContainer: { flexDirection: "row" },
  iconButton: { marginHorizontal: 5 },

  container: {
    padding: 10,
    backgroundColor: "#fff",
  },
  caret: {
    // fontSize: 18,
    color: "gray",
    marginHorizontal: 5
  },
  taskDetails: {
    marginTop: 5,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
  },
  taskDesc: {
    color: "#555",
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  subTasks: {
    marginTop: 10,
  },
  addParentButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  taskTitleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconWrapper: {
    backgroundColor: "red",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: -15,
    top: 0,
  },
  iconWrapper2: {
    backgroundColor: "red",
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: -8,
    top: 10,
  },
  iconText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },

  // textInput: {
  //   flex: 1,
  //   borderWidth: 1,
  //   borderColor: "#ddd",
  //   padding: 5,
  //   borderRadius: 5,
  // },
  // saveButton: {
  //   backgroundColor: "blue",
  //   paddingVertical: 5,
  //   paddingHorizontal: 10,
  //   marginLeft: 5,
  //   borderRadius: 5,
  // },
  // saveButtonText: {
  //   color: "#fff",
  //   fontWeight: "bold",
  // },

  // addTaskButton: {
  //   marginTop: 5,
  //   padding: 10,
  //   backgroundColor: "#eee",
  //   borderRadius: 5,
  //   alignSelf: "flex-start",
  // },
  // addTaskText: {
  //   color: "blue",
  //   fontWeight: "bold",
  // },

  // taskContainer: {
  //   marginBottom: 15,
  //   borderLeftWidth: 2,
  //   borderColor: "red",
  //   paddingLeft: 10,
  // },

  // taskTitle: {
  //   fontWeight: "bold",
  //   fontSize: 16,
  // },
});
