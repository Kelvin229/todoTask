import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

interface TaskItemProps {
  task: {
    id: number;
    title: string;
    completed: boolean;
  };
  onToggleCompletion: (id: number) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleCompletion,
  onDelete,
}) => {
  return (
    <View style={styles.item}>
      <CheckBox
        value={task.completed}
        onValueChange={() => onToggleCompletion(task.id)}
      />
      <Text style={[styles.title, task.completed && styles.completed]}>
        {task.title}
      </Text>
      <TouchableOpacity onPress={() => onDelete(task.id)}>
        <Text style={styles.delete}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    flex: 1,
    marginLeft: 10,
  },
  completed: {
    textDecorationLine: 'line-through',
  },
  delete: {
    color: 'red',
  },
});

export default TaskItem;
