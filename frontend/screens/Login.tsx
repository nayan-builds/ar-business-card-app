import React, {useState} from 'react';
import {API_URL} from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import type {PropsWithChildren} from 'react';
import {
  Button,
  Image,
  ImageProps,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useNavigation} from '@react-navigation/native';

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const login = async () => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    });
    const data = await response.json();
    if (!response.ok) {
      //Display error message
      console.log(data.message);
      return setErrorMessage(data.message);
    } else {
      await EncryptedStorage.setItem('token', data.token);
      navigation.navigate('Home');
    }
  };

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../res/ibm.png')}
          style={{flex: 1}}
          resizeMode="contain"
        />
      </View>
      <View>
        <TextInput
          placeholder="Please enter your email..."
          style={styles.inputBox}
          onChangeText={text => {
            setEmail(text);
          }}
        />
        <TextInput
          placeholder="Please enter your password..."
          style={styles.inputBox}
          onChangeText={text => {
            setPassword(text);
          }}
        />
        <Button
          title="Login"
          onPress={() => {
            login();
          }}
        />
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
    width: '100%',
  },
  imageStyle: {
    width: 80,
    height: 80,
  },
  backgroundStyle: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: '90%',
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
  },
  highlight: {
    fontWeight: '700',
  },
  inputBox: {
    width: 300,
    height: 50,
    backgroundColor: '#d3d3d3',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    marginVertical: 10,
  },
  errorMessage: {
    color: 'red',
  },
});
