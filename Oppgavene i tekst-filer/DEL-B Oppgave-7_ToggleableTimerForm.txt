
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import TimerButton from './TimerButton';
import TimerForm from './TimerForm';

export default function ToggleableTimerForm({ onSave }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleSave(data) {
    if (typeof onSave === 'function') {
      onSave(data);
    }

    setIsOpen(false);
  }

  return (
    <View style={[styles.container, !isOpen && styles.buttonPadding]}>
      {isOpen ? (
        <TimerForm
          onSave={handleSave}
          onCancel={() => setIsOpen(false)}
        />
      ) : (
        <TimerButton
          title="+ Ny tidsmåler"
          color="black"
          toggleChange={() => setIsOpen(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  buttonPadding: {
    paddingHorizontal: 15,
  },
});
