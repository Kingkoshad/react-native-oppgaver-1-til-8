import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';

type WeatherData = {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
};

function getWeatherDescription(code: number): string {
  if (code === 0) return 'Klart vær';
  if (code <= 3) return 'Delvis skyet';
  if (code <= 48) return 'Tåke';
  if (code <= 57) return 'Yr';
  if (code <= 67) return 'Regn';
  if (code <= 77) return 'Snø';
  if (code <= 82) return 'Regnbyger';
  if (code <= 86) return 'Snøbyger';
  if (code <= 99) return 'Tordenvær';
  return 'Ukjent vær';
}

function getWeatherIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 3) return '🌤️';
  if (code <= 48) return '🌫️';
  if (code <= 57) return '🌦️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  if (code <= 86) return '🌨️';
  return '⛈️';
}

function getWeatherBackground(code?: number) {
  if (code === undefined || code <= 1) {
    return require('@/assets/images/Sol-bakgrunn.png');
  }

  if (code <= 3 || (code >= 45 && code <= 48)) {
    return require('@/assets/images/Skytet-bakgrunn.png');
  }

  if (
    (code >= 71 && code <= 77) ||
    (code >= 85 && code <= 86)
  ) {
    return require('@/assets/images/Snø-bakgrunn.png');
  }

  if (
    (code >= 51 && code <= 67) ||
    (code >= 80 && code <= 82) ||
    code >= 95
  ) {
    return require('@/assets/images/Regn-bakgrunn.png');
  }

  return require('@/assets/images/Sol-bakgrunn.png');
}

export default function WeatherScreen() {
  const [city, setCity] = useState('');
  const [searchedCity, setSearchedCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function searchWeather(): Promise<void> {
    const cityName = city.trim();

    if (!cityName) {
      setError('Skriv inn navnet på en by først.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=no&format=json`
      );

      if (!geoResponse.ok) {
        throw new Error('Kunne ikke søke etter byen.');
      }

      const geoData = await geoResponse.json();
      const place = geoData.results?.[0];

      if (!place) {
        setError('Fant ikke byen. Prøv et annet stedsnavn.');
        return;
      }

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
      );

      if (!weatherResponse.ok) {
        throw new Error('Kunne ikke hente værdata.');
      }

      const weatherData = await weatherResponse.json();
      const current = weatherData.current;

      setWeather({
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        weatherCode: current.weather_code,
      });

      setSearchedCity(
        `${place.name}${place.country ? `, ${place.country}` : ''}`
      );
    } catch {
      setError('Kunne ikke hente data. Sjekk internett og prøv igjen.');
    } finally {
      setLoading(false);
    }
  }

  const temperatureColor =
    weather && weather.temperature < 0 ? '#D62828' : '#243B64';

  return (
    <ImageBackground
      source={getWeatherBackground(weather?.weatherCode)}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.header}>Værvarsel</Text>

          <Text style={styles.subtitle}>
            Sjekk været hvor som helst i verden
          </Text>

          <View style={styles.searchBox}>
            <TextInput
              style={styles.input}
              placeholder="Skriv inn en by..."
              placeholderTextColor="#8A94A6"
              value={city}
              onChangeText={setCity}
              onSubmitEditing={() => void searchWeather()}
              returnKeyType="search"
              editable={!loading}
            />

            <Pressable
              style={[
                styles.searchButton,
                loading && styles.disabledButton,
              ]}
              onPress={() => void searchWeather()}
              disabled={loading}
            >
              <Text style={styles.searchButtonText}>Søk</Text>
            </Pressable>
          </View>

          {loading && (
            <ActivityIndicator size="large" color="#243B64" />
          )}

          {!!error && <Text style={styles.error}>{error}</Text>}

          {weather && !loading && (
            <View style={styles.weatherCard}>
              <Text style={styles.weatherIcon}>
                {getWeatherIcon(weather.weatherCode)}
              </Text>

              <Text style={styles.cityName}>{searchedCity}</Text>

              <Text
                style={[
                  styles.temperature,
                  { color: temperatureColor },
                ]}
              >
                {Math.round(weather.temperature)}°C
              </Text>

              <Text style={styles.description}>
                {getWeatherDescription(weather.weatherCode)}
              </Text>

              <View style={styles.details}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>💧</Text>
                  <Text style={styles.detailLabel}>
                    Luftfuktighet
                  </Text>
                  <Text style={styles.detailValue}>
                    {weather.humidity}%
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>💨</Text>
                  <Text style={styles.detailLabel}>Vind</Text>
                  <Text style={styles.detailValue}>
                    {Math.round(weather.windSpeed)} km/t
                  </Text>
                </View>
              </View>
            </View>
          )}

          {!weather && !loading && !error && (
            <View style={styles.weatherCard}>
              <Text style={styles.weatherIcon}>🌍</Text>
              <Text style={styles.cityName}>
                Din neste destinasjon
              </Text>
              <Text style={styles.description}>
                Søk etter en by for å se det aktuelle været.
              </Text>
            </View>
          )}

          <Text style={styles.footer}>
            Værdata levert av Open-Meteo
          </Text>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.48)',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#243B64',
  },
  subtitle: {
    fontSize: 14,
    color: '#243B64',
    marginTop: 8,
    marginBottom: 28,
    textAlign: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 28,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#243B64',
  },
  searchButton: {
    backgroundColor: '#4169A1',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 14,
  },
  disabledButton: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  weatherCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    width: '100%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#243B64',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  weatherIcon: {
    fontSize: 64,
    marginBottom: 8,
  },
  cityName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#243B64',
    textAlign: 'center',
  },
  temperature: {
    fontSize: 64,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  description: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 28,
    textAlign: 'center',
  },
  details: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E8EEF7',
    paddingTop: 20,
  },
  detailItem: {
    alignItems: 'center',
    gap: 6,
  },
  detailIcon: {
    fontSize: 24,
  },
  detailLabel: {
    color: '#64748B',
    fontSize: 12,
  },
  detailValue: {
    color: '#243B64',
    fontSize: 17,
    fontWeight: 'bold',
  },
  error: {
    color: '#B00020',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  footer: {
    marginTop: 22,
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    textShadowColor: '#243B64',
    textShadowRadius: 4,
  },
});