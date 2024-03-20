import React, {useState} from 'react';
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
export default function Login() {
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
        <Section title="Log in to account" image={require('../res/log-in.png')}>
          Click here to Log in to account
        </Section>
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
