import {useNavigation} from '@react-navigation/native';
import {API_URL} from '@env';
import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Image,
  ImageProps,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import EncryptedStorage from 'react-native-encrypted-storage';
import {check} from 'react-native-permissions';

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
function MainPage() {
  const navigation = useNavigation();

  //This is using state to check if the user is logged in or not,
  //This should be changed to context ideally
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const token = await EncryptedStorage.getItem('token');
      console.log(token);
      if (token) {
        const response = await fetch(`${API_URL}/api/auth/check`, {
          method: 'GET',
          headers: {
            Authorization: token,
          },
        });
        if (response.ok) {
          setIsLoggedIn(true);
        }
      }
    });

    return unsubscribe;
  });

  // useEffect(() => {
  //   const checkLoggedIn = async () => {
  //     const token = await EncryptedStorage.getItem('token');
  //     console.log(token);
  //     if (token) {
  //       const response = await fetch(`${API_URL}/api/auth/check`, {
  //         method: 'GET',
  //         headers: {
  //           Authorization: token,
  //         },
  //       });
  //       if (response.ok) {
  //         setIsLoggedIn(true);
  //       }
  //     }
  //   };

  //   checkLoggedIn();
  // }, []);
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
        <Section
          title="Scan card"
          image={require('../res/scan-qr-code.png')}
          onPress={() => navigation.navigate('Camera')}>
          Click here to scan the card
        </Section>
        {!isLoggedIn && (
          <>
            <Section
              title="Create Account"
              image={require('../res/Create.png')}
              onPress={() => navigation.navigate('CreateAccount')}>
              Click here to create an Account
            </Section>
            <Section
              title="Log in to account"
              image={require('../res/log-in.png')}
              onPress={() => navigation.navigate('Login')}>
              Click here to Log in to account
            </Section>
          </>
        )}

        {isLoggedIn && (
          <>
            <Section
              title="Create card"
              image={require('../res/hand-card.png')}>
              Click here to create a card
            </Section>
            <Section
              title="Logout"
              image={require('../res/logout.png')}
              onPress={async () => {
                await EncryptedStorage.removeItem('token');
                setIsLoggedIn(false);
              }}>
              Click here to logout
            </Section>
          </>
        )}
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

export default MainPage;
