// ColorChanger.js
import React, { useState } from 'react';
import { SafeAreaView, View, Button, StyleSheet } from 'react-native';

export default function ColorChanger() {
  const [bgColor, setBgColor] = useState('#ffffff');

  const changeColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    setBgColor(randomColor);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <Button title="Change Background Color" onPress={changeColor} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
