import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Button,
  TextInput,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import TaskItem from '../components/TaskItem';
import {initDB} from '../database';
import SQLite from 'react-native-sqlite-storage';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const HomeScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [displayTasks, setDisplayTasks] = useState<Task[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);
  const dbRef = useRef<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    initDB().then(database => {
      dbRef.current = database;
      fetchTasks();
    });
  }, []);

  useEffect(() => {
    const filteredTasks = tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setDisplayTasks(filteredTasks);
  }, [tasks, searchQuery, filterCompleted]);

  const fetchTasks = () => {
    const db = dbRef.current;
    if (db) {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM Tasks', [], (tx, results) => {
          const tempTasks: Task[] = [];
          for (let i = 0; i < results.rows.length; i++) {
            let row = results.rows.item(i);
            tempTasks.push({
              id: row.id,
              title: row.title,
              completed: row.completed === 1,
            });
          }
          setTasks(tempTasks);
        });
      });
    }
  };

  const addTask = () => {
    const db = dbRef.current;
    if (db && newTask.trim()) {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO Tasks (title, completed) VALUES (?,?)',
          [newTask, 0],
          () => {
            fetchTasks(); // Refresh the tasks list
            setNewTask('');
          },
          error => console.log(error),
        );
      });
    }
  };

  const toggleCompletion = id => {
    const db = dbRef.current;
    if (db) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        const newCompletedValue = task.completed ? 0 : 1;
        db.transaction(tx => {
          tx.executeSql(
            'UPDATE Tasks SET completed = ? WHERE id = ?',
            [newCompletedValue, id],
            () => {
              fetchTasks(); // Refresh the tasks list
            },
            error => console.log(error),
          );
        });
      }
    }
  };

  const deleteTask = id => {
    const db = dbRef.current;
    if (db) {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM Tasks WHERE id = ?',
          [id],
          () => {
            fetchTasks(); // Refresh the tasks list
          },
          error => console.log(error),
        );
      });
    }
  };

  const onFilterPress = () => {
    setFilterModalVisible(true);
  };

  const applyFilter = completed => {
    setFilterCompleted(completed);
  };

  const resetFilter = () => {
    setFilterCompleted(null);
  };

  useEffect(() => {
    const filteredTasks = tasks.filter(task => {
      if (filterCompleted === null) {
        return true;
      }
      return task.completed === filterCompleted;
    });
    setDisplayTasks(filteredTasks);
  }, [tasks, filterCompleted]);

  const renderFilterModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => {
          setFilterModalVisible(!filterModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFilterModalVisible(false)}>
              <MaterialIcon name="close" size={24} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.modalText}>Filter Tasks</Text>

            <View style={styles.buttonContainer}>
              <Button
                title="All Tasks"
                onPress={resetFilter}
                color={filterCompleted === null ? 'skyblue' : '#000'}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Completed Tasks"
                onPress={() => applyFilter(true)}
                color={filterCompleted === true ? 'skyblue' : '#000'}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="In Progress Tasks"
                onPress={() => applyFilter(false)}
                color={filterCompleted === false ? 'skyblue' : '#000'}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={onFilterPress}>
          <MaterialIcon name="filter-list-alt" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Modal for Filters */}
      {renderFilterModal()}

      {/* Task Input */}
      <TextInput
        style={[
          styles.input,
          {height: Math.max(35, newTask.length ? newTask.length * 2 : 35)},
        ]}
        onChangeText={setNewTask}
        value={newTask}
        placeholder="Add a new task"
        multiline
      />
      <Button title="Add Task" onPress={addTask} />

      {/* Task List */}
      <FlatList
        data={displayTasks.length ? displayTasks : tasks}
        renderItem={({item}) => (
          <TaskItem
            task={item}
            onToggleCompletion={toggleCompletion}
            onDelete={deleteTask}
          />
        )}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Text>No tasks found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    flex: 1,
    marginRight: 10,
    borderRadius: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'black',
    borderRadius: 15,
    padding: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 10,
    width: '100%',
    paddingHorizontal: 20,
  },
});

export default HomeScreen;
