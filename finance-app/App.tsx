import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import Chart1 from "./Charts/Chart1"

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.scrolling}>
      <View style={styles.container}>
        <Image
          style={styles.logoImage}
          source={require('./assets/favicon.png')}
        />
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
    </ScrollView>
  );
}

function LoginScreen() {
  const navigation = useNavigation();
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('')
  const [showHidePassword, setshowHidePassword] = useState(true);
  const [isValid, setIsValid] = React.useState(true);

  const togglePassword = () => {
    setshowHidePassword(!showHidePassword);
  };

  function validateEmail(text: string) {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(text.toLowerCase());
  }

  return (
    <ScrollView style={styles.scrolling}>
      <View style={styles.container}>
        <Image
          style={styles.logoImage}
          source={require('./assets/favicon.png')}
        />

        <Text style={styles.menuText1}>Finance App</Text>

        <Text style={styles.menuText2}>Log In</Text>

        <TextInput
          style={[
            styles.inputField,
            {
              borderColor: isValid ? "green" : "red",
              borderWidth: 2,
            }
          ]}
          onChangeText={(text) => {
            onChangeEmail(text);
            setIsValid(validateEmail(text));
          }}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Email"
        />
        
        {!isValid && <Text style={{color: "red"}}>Invalid email</Text>}

        <TextInput
          style={styles.inputField}
          onChangeText={onChangePassword}
          value={password}
          autoCapitalize="none"
          placeholder="Password"
          spellCheck={false}
          secureTextEntry={showHidePassword}
        />

        <TouchableOpacity onPress={togglePassword} style={styles.smallButton}>
          <Text style={styles.smallButtonText}>Toggle Password</Text>
        </TouchableOpacity>

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
            const response = await fetch("http://192.168.20.122:5000/login", {
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

              if (response.status != 201) {
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
    </ScrollView>
  );
}

function SignUpScreen() {
  const navigation = useNavigation();
  const [email, onChangeEmail] = React.useState('');
  const [firstName, onChangeFirstName] = React.useState('');
  const [lastName, onChangeLastName] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [rPassword, onChangeRPassword] = React.useState('');
  const [key, onChangeKey] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('')
  const [showHidePassword, setshowHidePassword] = useState(true);
  const [showHideRPassword, setshowHideRPassword] = useState(true);
  const [isValid, setIsValid] = React.useState(true);

  const togglePassword = () => {
    setshowHidePassword(!showHidePassword);
  };
  const toggleRPassword = () => {
    setshowHideRPassword(!showHideRPassword);
  };

  function validateEmail(text: string) {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(text.toLowerCase());
  }

  return (
    <ScrollView style={styles.scrolling}>
      <View style={styles.container}>
        <Image
          style={styles.logoImage}
          source={require('./assets/favicon.png')}
        />

        <Text style={styles.menuText1}>Finance App</Text>
        
        <Text style={styles.menuText2}>Sign Up</Text>

        <TextInput
          style={[
            styles.inputField,
            {
              borderColor: isValid ? "green" : "red",
              borderWidth: 2,
            }
          ]}
          onChangeText={(text) => {
            onChangeEmail(text);
            setIsValid(validateEmail(text));
          }}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Email"
        />
        
        {!isValid && <Text style={{color: "red"}}>Invalid email</Text>}

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
          autoCapitalize="none"
          placeholder="Password"
          spellCheck={false}
          secureTextEntry={showHidePassword}
        />

        <TouchableOpacity onPress={togglePassword} style={styles.smallButton}>
          <Text style={styles.smallButtonText}>Toggle Password</Text>
        </TouchableOpacity>
        
        <TextInput
          style={styles.inputField}
          onChangeText={onChangeRPassword}
          value={rPassword}
          autoCapitalize="none"
          placeholder="Repeat Password"
          spellCheck={false}
          secureTextEntry={showHideRPassword}
        />

        <TouchableOpacity onPress={toggleRPassword} style={styles.smallButton}>
          <Text style={styles.smallButtonText}>Toggle Password</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.inputField}
          onChangeText={onChangeKey}
          value={key}
          placeholder="Key"
        />
        <Pressable
          style={styles.button}
          onPress={async () => {
            setErrorMessage("");
            if (password != rPassword) {
              setErrorMessage("The passwords do not match.");
              return;
            } else if (!email || !firstName || !lastName || !password || !rPassword || !key) {
              setErrorMessage("Please fill in all fields.");
              return;
            } else {
              setErrorMessage("");
            }

          try {
            const response = await fetch("http://192.168.20.122:5000/register", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email,
                name: {
                  firstName: firstName,
                  lastName: lastName,
                },
                password: password,
                key: key,
              }),
            });

              if (response.status != 201) {
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
    </ScrollView>
  );
}

function HomePageScreen() {
  const navigation = useNavigation();

    return (
    <ScrollView style={styles.scrolling}>
      <View style={styles.container}>
        <Image
          style={styles.logoImage}
          source={require('./assets/favicon.png')}
        />
        <Text style={styles.menuText1}>Finance App</Text>
        <Text style={styles.menuText2}>Choose your app:</Text>

        <View style={styles.buttonGrid}>
          <Pressable style={styles.gridButton} onPress={() => navigation.navigate('Graphs')}>
            <Text style={styles.buttonText}>Graphs -&gt;</Text>
            <Image
              style={styles.buttonImage}
              source={require('./assets/favicon.png')}
              resizeMode='center'
            />
          </Pressable>

          <Pressable style={styles.gridButton} onPress={() => Alert.alert('Todo app opened')}>
            <Text style={styles.buttonText}>Todo -&gt;</Text>
            <Image
              style={styles.buttonImage}
              source={require('./assets/todo.png')}
              resizeMode='center'
            />
          </Pressable>

          <Pressable style={styles.gridButton} onPress={() => Alert.alert('Payment app opened')}>
            <Text style={styles.buttonText}>Payment -&gt;</Text>
            <Image
              style={styles.buttonImage}
              source={require('./assets/payment.png')}
              resizeMode='center'
            />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

function GraphPageScreen() {
  return (
    <ScrollView style={styles.scrolling}>
      <View style={styles.container}>
        <Chart1 />
      </View>
    </ScrollView>
  )
}

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: HomeScreen,
    Login: LoginScreen,
    SignUp: SignUpScreen,
    HomePage: HomePageScreen,
    Graphs: GraphPageScreen
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}



const styles = StyleSheet.create({
  scrolling: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
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
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
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
  logoImage: {
    width: 150,
    height: 150,
    borderRadius: 5,
  },
  buttonImage: {
    borderRadius: 5,
  },
  smallButton: {
    backgroundColor: '#bdbdbdff',
    borderRadius: 5,
    padding: 7.5,
  },
  smallButtonText: {
    color: '#000000ff',
    textAlign: 'center',
    fontSize: 12.5,
  }
});