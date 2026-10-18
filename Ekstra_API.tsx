import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

type Post = {
  id: number;
  title: string;
  body: string;
};

export default function ApiScreen() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts/1')
      .then((response) => response.json())
      .then((data: Post) => {
        setPost(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>API-eksempel</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : post ? (
        <View style={styles.card}>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.body}>{post.body}</Text>
        </View>
      ) : (
        <Text>Kunne ikke hente data.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D8DBE2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  body: {
    fontSize: 16,
  },
});