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
          Go to Login
        </Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.buttonText}>
          Go to Sign Up
        </Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigation.navigate('HomePage')}>
        <Text style={styles.buttonText}>
          Go to Home Page
        </Text>
      </Pressable>
    </View>
  );
}

function LoginScreen() {
  const navigation = useNavigation();
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  return (
    <View style={styles.container}>
      <Text style={styles.menuText1}>Log In</Text>
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
      <Pressable style={styles.button} onPress={() => navigation.navigate('HomePage')}>
        <Text style={styles.buttonText}>
          Log In
        </Text>
      </Pressable>
    </View>
  );
}

function SignUpScreen() {
  const navigation = useNavigation();
  const [email, onChangeEmail] = React.useState('');
  const [firstName, onChangeFirstName] = React.useState('');
  const [lastName, onChangeLastName] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  return (
    <View style={styles.container}>
      <Text style={styles.menuText1}>Sign Up</Text>
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
      <Pressable style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>
          Sign Up
        </Text>
      </Pressable>
    </View>
  );
}

function HomePageScreen() {
    return (
    <View style={styles.container}>
      <Text style={styles.menuText1}>Choose your app:</Text>

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
    flex: 1,
    backgroundColor: '#ffffffff',
    padding: 15,
  },
  button: {
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  inputField: {
    color: '#ffffffff',
    fontSize: 17.5,
    backgroundColor: '#ff7300ff',
    padding: 15,
    margin: 10,
    borderRadius: 5,
  },
});