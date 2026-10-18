
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import TimerButton from './TimerButton';

export default function TimerForm({
  id,
  title = '',
  project = '',
  onSave,
  onCancel,
}) {
  const [timerTitle, setTimerTitle] = useState(title);
  const [timerProject, setTimerProject] = useState(project);

  function handleSave() {
    if (!timerTitle.trim() || !timerProject.trim()) {
      return;
    }

    if (typeof onSave === 'function') {
      onSave({
        id,
        title: timerTitle.trim(),
        project: timerProject.trim(),
      });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Navn</Text>
      <TextInput
        style={styles.input}
        value={timerTitle}
        onChangeText={setTimerTitle}
        placeholder="Navn på gjøremål"
      />

      <Text style={styles.label}>Kategori</Text>
      <TextInput
        style={styles.input}
        value={timerProject}
        onChangeText={setTimerProject}
        placeholder="Kategori eller prosjekt"
      />

      <View style={styles.buttons}>
        <TimerButton
          small
          color="#21BA45"
          title={id ? 'Oppdater' : 'Opprett'}
          toggleChange={handleSave}
        />
        <TimerButton
          small
          color="#DB2828"
          title="Avbryt"
          toggleChange={onCancel}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D6D7DA',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D6D7DA',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
