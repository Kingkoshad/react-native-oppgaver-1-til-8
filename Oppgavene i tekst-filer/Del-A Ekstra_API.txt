
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
} from 'react-native';

// Definerer strukturen til et innlegg fra API-et.
type Post = {
  id: number;
  title: string;
  body: string;
};

// Kontrollerer at dataene fra API-et har riktig struktur.
function isPost(data: unknown): data is Post {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  if (!('id' in data) || !('title' in data) || !('body' in data)) {
    return false;
  }

  return (
    typeof data.id === 'number' &&
    typeof data.title === 'string' &&
    typeof data.body === 'string'
  );
}

export default function ApiScreen() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [postId, setPostId] = useState<number>(1);
  const [error, setError] = useState<string>('');

  // Henter et nytt innlegg når postId endres.
  useEffect(() => {
    let active = true;

    async function fetchPost(): Promise<void> {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${postId}`
        );

        if (!response.ok) {
          throw new Error('Kunne ikke hente innlegget.');
        }

        const data: unknown = await response.json();

        if (!isPost(data)) {
          throw new Error('API-et returnerte ugyldige data.');
        }

        if (active) {
          setPost(data);
        }
      } catch {
        if (active) {
          setError('Kunne ikke hente data fra internett.');
          setPost(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void fetchPost();

    return () => {
      active = false;
    };
  }, [postId]);

  // Går fra innlegg 1 til 10, og deretter tilbake til 1.
  function nextPost(): void {
    setPostId((currentId) => (currentId >= 10 ? 1 : currentId + 1));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>API-eksempel</Text>

      <Text style={styles.progress}>
        Innlegg {postId} av 10
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#487281" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : post ? (
        <View style={styles.card}>
          <Text style={styles.id}>Hentet fra API-et</Text>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.body}>{post.body}</Text>
        </View>
      ) : null}

      <View style={styles.button}>
        <Button
          title="Hent neste innlegg"
          onPress={nextPost}
          disabled={loading}
          color="#487281"
        />
      </View>
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
    marginBottom: 15,
    color: '#373F51',
  },
  progress: {
    fontSize: 16,
    marginBottom: 20,
    color: '#487281',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  id: {
    color: '#487281',
    marginBottom: 8,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#373F51',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
  },
  error: {
    color: '#B00020',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
});