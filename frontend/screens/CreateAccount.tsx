import React, {useState} from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {useAuth} from '../context/AuthContext';

export default function CreateAccount() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const {onRegister} = useAuth();

  const register = async () => {
    const response = await onRegister!(email, password);
    if (response && response.error) {
      setErrorMessage(response.message);
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
          secureTextEntry={true}
          onChangeText={text => {
            setPassword(text);
          }}
        />
        <Button
          title="Create Account"
          onPress={() => {
            register();
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
