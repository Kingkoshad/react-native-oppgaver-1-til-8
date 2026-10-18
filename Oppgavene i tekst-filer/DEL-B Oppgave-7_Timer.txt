
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { millisecondsToHuman } from '../utils/TimerUtils';
import TimerButton from './TimerButton';

export default function Timer({
  title,
  project,
  elapsed = 0,
  isRunning = false,
  onToggle,
  onEdit,
  onDelete,
}) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTick((value) => value + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const currentElapsed =
    Number(elapsed) + (isRunning ? tick * 1000 : 0);

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text>{project}</Text>
      <Text style={styles.elapsedTime}>
        {millisecondsToHuman(currentElapsed)}
      </Text>

      <View style={styles.buttonGroup}>
        <TimerButton
          color="blue"
          small
          title="Endre"
          toggleChange={onEdit}
        />
        <TimerButton
          color="red"
          small
          title="Fjern"
          toggleChange={onDelete}
        />
      </View>

      <TimerButton
        color="#21BA45"
        title={isRunning ? 'Stopp' : 'Start'}
        toggleChange={onToggle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    backgroundColor: 'white',
    borderColor: '#d6d7da',
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    margin: 15,
    marginBottom: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  elapsedTime: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 15,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
