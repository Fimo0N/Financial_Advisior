// CounterApp.js
import React, { useState } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet } from 'react-native';

export default function CounterApp() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Counter App</Text>

      <View style={styles.counterContainer}>
        <Button title="-" onPress={decrement} />
        <Text style={styles.count}>{count}</Text>
        <Button title="+" onPress={increment} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f7ff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 200,
  },
  count: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
});
