
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Bildegalleri</Text>
      <Text style={styles.subtitle}>
        Lokale bilder og bilder fra internett
      </Text>

      <View style={styles.card}>
        <Text style={styles.title}>Bil</Text>
        <Image
          source={require('@/assets/images/bilde1.png')}
          style={styles.image}
          contentFit="cover"
        />
        <Text style={styles.description}>
          Dette bildet er lagret lokalt i prosjektet.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Natur</Text>
        <Image
          source={{
            uri: 'https://w0.peakpx.com/wallpaper/675/304/HD-wallpaper-lovely-view-glow-riverbank-shore-sun-grass-clouds-sea-mountain-flowers-river-sunrise-reflection-view-sky-lake-water-summer-nature-lakeshore-meadow.jpg',
          }}
          style={styles.image}
          contentFit="cover"
        />
        <Text style={styles.description}>
          Dette bildet lastes fra internett.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#D8DBE2',
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#373F51',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 15,
    color: '#487281',
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#373F51',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#eeeeee',
  },
  description: {
    fontSize: 14,
    color: '#487281',
    marginTop: 12,
  },
});