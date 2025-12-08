// Greeting.js
import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, StyleSheet } from 'react-native';

export default function Greeting() {
  const [name, setName] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Hello, {name || 'Stranger'}!</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 24, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#aaa', borderRadius: 5, width: '100%', padding: 10 },
});
