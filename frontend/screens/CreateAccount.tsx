import React, {useState} from 'react';
import {API_URL} from '@env';
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

type SectionProps = PropsWithChildren<{
  title: string;
  image?: ImageProps;
  onPress?: () => void;
}>;

function Section({
  children,
  title,
  image,
  onPress,
}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.sectionContainer}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image source={image} style={styles.imageStyle} />
        </View>
        <View>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: isDarkMode ? Colors.white : Colors.black,
              },
            ]}>
            {title}
          </Text>
          <Text
            style={[
              styles.sectionDescription,
              {
                color: isDarkMode ? Colors.light : Colors.dark,
              },
            ]}>
            {children}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
export default function CreateAccount() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async () => {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    });
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
          onChangeText={text => {
            setEmail(text);
          }}
        />
        <TextInput
          placeholder="Please enter your password..."
          onChangeText={text => {
            setPassword(text);
          }}
        />
        <Button
          title="Create Account"
          onPress={() => {
            submit();
          }}
        />
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
  sectionContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 32,
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
  },
  sectionImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
  },

  contactDetailsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 32,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
