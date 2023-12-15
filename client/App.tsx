import React from 'react';
import {View, StyleSheet} from 'react-native';
import HomeScreen from './screens/HomeScreen';

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <HomeScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(184,227,145,0)',
  },
});

export default App;
