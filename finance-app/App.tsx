import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
} from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.menuText1}>Finance App</Text>
      <Text style={styles.menuText2}>Choose Option:</Text>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>
          Go to Login -&gt;
        </Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.buttonText}>
          Go to Sign Up -&gt;
        </Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigation.navigate('HomePage')}>
        <Text style={styles.buttonText}>
          Go to Home Page -&gt;
        </Text>
      </Pressable>
    </View>
  );
}

function LoginScreen() {
  const navigation = useNavigation();
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');
   const [errorMessage, setErrorMessage] = React.useState('')
  return (
    <View style={styles.container}>
      <Text style={styles.menuText1}>Finance App</Text>
      <Text style={styles.menuText2}>Log In</Text>
      <TextInput
        style={styles.inputField}
        onChangeText={onChangeEmail}
        value={email}
        placeholder="Email"
      />
      <TextInput
        style={styles.inputField}
        onChangeText={onChangePassword}
        value={password}
        placeholder="Password"
      />
      <Pressable
        style={styles.button}
        onPress={async () => {
          if (!email || !password) {
            setErrorMessage("Please fill in all fields.");
            return;
          } 
          else {
            setErrorMessage("");
          }

          try {
            const response = await fetch("http://192.168.20.74:45631/login", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email,
                password: password,
              }),
            });

            if (!response.ok) {
              console.log("Server error:", response.status);
              setErrorMessage("Server error: " + response.status);
              return;
            }

            const data = await response.json();
            console.log("Server response:", data);

            navigation.navigate("HomePage");
          } catch (err) {
            console.error("Network/Fetch error:", err);
            setErrorMessage("Network/Fetch error.");
          }
        }}
      >
        <Text style={styles.buttonText}>Log In -&gt;</Text>
      </Pressable>

      <Text>{errorMessage}</Text>
    </View>
  );
}

function SignUpScreen() {
  const navigation = useNavigation();
  const [email, onChangeEmail] = React.useState('');
  const [firstName, onChangeFirstName] = React.useState('');
  const [lastName, onChangeLastName] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [key, onChangeKey] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('')
  return (
    <View style={styles.container}>
      <Text style={styles.menuText1}>Finance App</Text>
      <Text style={styles.menuText2}>Sign Up</Text>
      <TextInput
        style={styles.inputField}
        onChangeText={onChangeEmail}
        value={email}
        placeholder="Email"
      />
      <TextInput
        style={styles.inputField}
        onChangeText={onChangeFirstName}
        value={firstName}
        placeholder="First Name"
      />
      <TextInput
        style={styles.inputField}
        onChangeText={onChangeLastName}
        value={lastName}
        placeholder="Last Name"
      />
      <TextInput
        style={styles.inputField}
        onChangeText={onChangePassword}
        value={password}
        placeholder="Password"
      />
      <TextInput
        style={styles.inputField}
        onChangeText={onChangeKey}
        value={key}
        placeholder="Key"
      />
      <Pressable
        style={styles.button}
        onPress={async () => {
          if (!email || !firstName || !lastName || !password || !key) {
            setErrorMessage("Please fill in all fields.");
            return;
          } 
          else {
            setErrorMessage("");
          }

          try {
            const response = await fetch("http://192.168.20.74:45631/register", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email,
                firstName: firstName,
                lastName: lastName,
                password: password,
                key: key,
              }),
            });

            if (!response.ok) {
              console.log("Server error:", response.status);
              setErrorMessage("Server error: " + response.status);
              return;
            }

            const data = await response.json();
            console.log("Server response:", data);

            navigation.navigate("Login");
          } catch (err) {
            console.error("Network/Fetch error:", err);
            setErrorMessage("Network/Fetch error.");
          }
        }}
      >
        <Text style={styles.buttonText}>Sign Up -&gt;</Text>
      </Pressable>

      <Text>{errorMessage}</Text>

    </View>
  );
}

function HomePageScreen() {
    return (
    <View style={styles.container}>
      <Text style={styles.menuText1}>Finance App</Text>
      <Text style={styles.menuText2}>Choose your app:</Text>

      <View style={styles.buttonGrid}>
        <Pressable style={styles.gridButton} onPress={() => Alert.alert('Graph app opened')}>
          <Text style={styles.buttonText}>Graphs -&gt;</Text>
        </Pressable>

        <Pressable style={styles.gridButton} onPress={() => Alert.alert('Todo app opened')}>
          <Text style={styles.buttonText}>Todo -&gt;</Text>
        </Pressable>

        <Pressable style={styles.gridButton} onPress={() => Alert.alert('Payment app opened')}>
          <Text style={styles.buttonText}>Payment -&gt;</Text>
        </Pressable>
      </View>
    </View>
  );
}

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: HomeScreen,
    Login: LoginScreen,
    SignUp: SignUpScreen,
    HomePage: HomePageScreen
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#ffffffff',
    padding: 15,
  },
  button: {
    minWidth: 300,
    maxWidth: 600,
    backgroundColor: '#ff7300ff',
    width: 'auto',
    height: 'auto',
    borderRadius: 5,
    margin: 10,
    padding: 12.5,
  },
  buttonText: {
    color: '#ffffffff',
    textAlign: 'center',
    fontSize: 20,
  },
  menuText1: {
    color: '#000000ff',
    textAlign: 'center',
    fontSize: 25,
  },
  menuText2: {
    color: '#000000ff',
    textAlign: 'center',
    fontSize: 20,
  },
  buttonGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
    gridButton: {
    flex: 1,
    height: 125,
    backgroundColor: '#ff7300ff',
    borderRadius: 5,
    margin: 10,
    padding: 12.5,
  },
  inputField: {
    minWidth: 300,
    maxWidth: 600,
    color: '#ffffffff',
    fontSize: 17.5,
    backgroundColor: '#ff7300ff',
    padding: 15,
    margin: 10,
    borderRadius: 5,
  },
});