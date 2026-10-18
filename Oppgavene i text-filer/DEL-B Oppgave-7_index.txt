
import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import EditableTimer from '../components/EditableTimer';
import ToggleableTimerForm from '../components/ToggleableTimerForm';

type TimerItem = {
  id: string;
  title: string;
  project: string;
  elapsed: number;
  isRunning: boolean;
  startedAt?: number;
  editFormOpen?: boolean;
};

export default function App() {
  const [timers, setTimers] = useState<TimerItem[]>([
    {
      id: '1',
      title: 'Klippe plenen',
      project: 'Hageaktivitet',
      elapsed: 8986300,
      isRunning: false,
    },
    {
      id: '2',
      title: 'Bake kake',
      project: 'Kjøkkenaktivitet',
      elapsed: 3890985,
      isRunning: false,
    },
  ]);

  function addTimer(data: {
    title: string;
    project: string;
  }) {
    setTimers((current) => [
      ...current,
      {
        id: Date.now().toString(),
        title: data.title,
        project: data.project,
        elapsed: 0,
        isRunning: false,
      },
    ]);
  }

  function updateTimer(data: {
    id?: string;
    title: string;
    project: string;
  }) {
    if (!data.id) return;

    setTimers((current) =>
      current.map((timer) =>
        timer.id === data.id
          ? {
              ...timer,
              title: data.title,
              project: data.project,
              editFormOpen: false,
            }
          : timer
      )
    );
  }

  function toggleTimer(id: string) {
    const now = Date.now();

    setTimers((current) =>
      current.map((timer) => {
        if (timer.id !== id) return timer;

        if (timer.isRunning) {
          return {
            ...timer,
            elapsed:
              timer.elapsed +
              (timer.startedAt ? now - timer.startedAt : 0),
            startedAt: undefined,
            isRunning: false,
          };
        }

        return {
          ...timer,
          startedAt: now,
          isRunning: true,
        };
      })
    );
  }

  function cancelEdit(id: string) {
    setTimers((current) =>
      current.map((timer) =>
        timer.id === id ? { ...timer, editFormOpen: false } : timer
      )
    );
  }

  return (
    <View style={styles.appContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Tidsmålere</Text>
      </View>

      <ScrollView style={styles.timerList}>
        <ToggleableTimerForm onSave={addTimer} />

        {timers.map((timer) => {
          const elapsed =
            timer.elapsed +
            (timer.isRunning && timer.startedAt
              ? Date.now() - timer.startedAt
              : 0);

          return (
            <EditableTimer
              key={timer.id}
              id={timer.id}
              title={timer.title}
              project={timer.project}
              elapsed={elapsed}
              isRunning={timer.isRunning}
              editFormOpen={timer.editFormOpen}
              onToggle={() => toggleTimer(timer.id)}
              onEdit={() =>
                setTimers((current) =>
                  current.map((item) =>
                    item.id === timer.id
                      ? { ...item, editFormOpen: true }
                      : item
                  )
                )
              }
              onDelete={() =>
                setTimers((current) =>
                  current.filter((item) => item.id !== timer.id)
                )
              }
              onSave={updateTimer}
              onCancel={() => cancelEdit(timer.id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  titleContainer: {
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D6D7DA',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timerList: {
    flex: 1,
  },
});
