import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  Pressable,
  Alert,
  View
} from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Choose your app:</Text>
      <StatusBar style="auto" />

      <View style={styles.buttonGrid}>
        <Pressable style={styles.button} onPress={() => Alert.alert('Graph app opened')}>
        <Text style={styles.buttonText}>Graphs</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => Alert.alert('Todo app opened')}>
        <Text style={styles.buttonText}>Todo</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => Alert.alert('Payment app opened')}>
        <Text style={styles.buttonText}>Payment</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    marginTop: 30,
    marginBottom: 30,
    marginLeft: 15,
    marginRight: 15,
  },
  button: {
    backgroundColor: '#ff7300ff',
    width: '25%',
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffffff',
    textAlign: 'center',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
