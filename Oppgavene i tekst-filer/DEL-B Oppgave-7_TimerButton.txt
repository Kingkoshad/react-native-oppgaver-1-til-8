
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function TimerButton({
  color = 'black',
  title,
  small = false,
  toggleChange,
}) {
  return (
    <TouchableOpacity
      style={[styles.button, { borderColor: color }]}
      onPress={() => {
        if (typeof toggleChange === 'function') {
          toggleChange();
        }
      }}
    >
      <Text
        style={[
          styles.buttonText,
          small ? styles.small : styles.large,
          { color },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    minWidth: 100,
    borderWidth: 2,
    borderRadius: 3,
  },
  small: {
    fontSize: 14,
    padding: 5,
  },
  large: {
    fontSize: 16,
    padding: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
