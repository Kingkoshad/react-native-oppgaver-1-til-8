import React, { useState } from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  ScrollView,
} from 'react-native';

const smaaBokstaver = 'abcdefghijklmnopqrstuvwxyz'.split('');
const storeBokstaver = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const tall = '0123456789'.split('');
const symboler = ['#', '$', '%', '&', '*'];

export default function App() {
  const [antallTegn, setAntallTegn] = useState('12');
  const [minimumSymboler, setMinimumSymboler] = useState('2');
  const [passord, setPassord] = useState('');

  const [isEnabledStoreBokstaver, setIsEnabledStoreBokstaver] = useState(false);
  const [isEnabledSmaaBokstaver, setIsEnabledSmaaBokstaver] = useState(false);
  const [isEnabledTall, setIsEnabledTall] = useState(false);
  const [isEnabledSymboler, setIsEnabledSymboler] = useState(false);

  function genererPassord(): void {
    const lengde = Number(antallTegn);
    const minSymboler = Number(minimumSymboler);

    if (!Number.isInteger(lengde) || lengde < 1 || lengde > 128) {
      Alert.alert('Ugyldig lengde', 'Velg mellom 1 og 128 tegn.');
      return;
    }

    if (
      minimumSymboler.trim() === '' ||
      !Number.isInteger(minSymboler) ||
      minSymboler < 0 ||
      minSymboler > lengde
    ) {
      Alert.alert(
        'Ugyldig antall symboler',
        'Velg et antall mellom 0 og passordlengden.'
      );
      return;
    }

    const eksisterendeSymboler = passord
      .split('')
      .filter((tegn) => symboler.includes(tegn)).length;

    if (passord !== '' && eksisterendeSymboler >= minSymboler) {
      Alert.alert(
        'Passordet er allerede gyldig',
        'Det eksisterende passordet oppfyller minimumskravet. Passordet beholdes.'
      );
      return;
    }

    let lovligeTegn: string[] = [];

    if (isEnabledSmaaBokstaver) lovligeTegn = lovligeTegn.concat(smaaBokstaver);
    if (isEnabledStoreBokstaver) lovligeTegn = lovligeTegn.concat(storeBokstaver);
    if (isEnabledTall) lovligeTegn = lovligeTegn.concat(tall);
    if (isEnabledSymboler) lovligeTegn = lovligeTegn.concat(symboler);

    if (lovligeTegn.length === 0 && minSymboler < lengde) {
      Alert.alert('Velg tegn', 'Slå på minst én tegnkategori.');
      return;
    }

    const nyePassordTegn: string[] = [];

    for (let i = 0; i < minSymboler; i++) {
      nyePassordTegn.push(
        symboler[Math.floor(Math.random() * symboler.length)]
      );
    }

    const tilgjengeligeTegn =
      lovligeTegn.length > 0 ? lovligeTegn : symboler;

    for (let i = minSymboler; i < lengde; i++) {
      nyePassordTegn.push(
        tilgjengeligeTegn[
          Math.floor(Math.random() * tilgjengeligeTegn.length)
        ]
      );
    }

    for (let i = nyePassordTegn.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nyePassordTegn[i], nyePassordTegn[j]] = [
        nyePassordTegn[j],
        nyePassordTegn[i],
      ];
    }

    setPassord(nyePassordTegn.join(''));
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.container1}>
        <Text style={styles.text_heading}>Passordgenerator</Text>
      </View>

      <View style={styles.container2}>
        <View style={styles.line}>
          <Text style={styles.text_line}>Store bokstaver</Text>
          <Switch value={isEnabledStoreBokstaver} onValueChange={setIsEnabledStoreBokstaver} />
        </View>

        <View style={styles.line}>
          <Text style={styles.text_line}>Små bokstaver</Text>
          <Switch value={isEnabledSmaaBokstaver} onValueChange={setIsEnabledSmaaBokstaver} />
        </View>

        <View style={styles.line}>
          <Text style={styles.text_line}>Tall</Text>
          <Switch value={isEnabledTall} onValueChange={setIsEnabledTall} />
        </View>

        <View style={styles.line}>
          <Text style={styles.text_line}>Symboler</Text>
          <Switch value={isEnabledSymboler} onValueChange={setIsEnabledSymboler} />
        </View>

        <View style={styles.line}>
          <Text style={styles.text_line}>Antall tegn</Text>
          <TextInput
            style={styles.input}
            value={antallTegn}
            onChangeText={setAntallTegn}
            keyboardType="number-pad"
            placeholder="12"
          />
        </View>

        <View style={styles.line}>
          <Text style={styles.text_line}>Min. spesialtegn</Text>
          <TextInput
            style={styles.input}
            value={minimumSymboler}
            onChangeText={setMinimumSymboler}
            keyboardType="number-pad"
            placeholder="2"
          />
        </View>

        <View style={styles.button}>
          <Button title="Generer passord" onPress={genererPassord} />
        </View>

        <Text style={styles.resultHeading}>Passord:</Text>
        <Text selectable style={styles.password}>
          {passord || 'Passordet vises her'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: '#f2f2f2',
    paddingBottom: 30,
  },
  container1: {
    backgroundColor: '#555555',
    padding: 24,
    alignItems: 'center',
  },
  text_heading: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  container2: {
    padding: 20,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    gap: 12,
  },
  text_line: {
    fontSize: 16,
    flex: 1,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 6,
    padding: 10,
    width: 100,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
  },
  resultHeading: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: 'bold',
  },
  password: {
    marginTop: 10,
    padding: 14,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    fontSize: 18,
    overflow: 'hidden',
  },
});