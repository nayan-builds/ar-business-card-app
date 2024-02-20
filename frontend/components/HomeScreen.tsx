/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Image,
  ImageProps,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
  image?: ImageProps;
}>;

function ContactDetails() {
  const isDarkMode = useColorScheme() === 'dark';
    const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={()=> {
        navigation.navigate('ContactInfo');
    }}> 
        <View style={styles.contactDetailsContainer}>
            <View>
            <Text
                style={[
                styles.sectionTitle,
                {
                    color: isDarkMode ? Colors.white : Colors.black,
                },
                ]}>
                Contact Details
            </Text>
            <Text
                style={[
                styles.sectionDescription,
                {
                    color: isDarkMode ? Colors.light : Colors.dark,
                },
                ]}>

            </Text>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require("../res/arrow.png")} />
            </View>
        </View>
    </TouchableOpacity>
  );
}

function Section({children, title, image}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image source={image} />
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
  );
}

function HomeScreen() {
    return (
      <SafeAreaView style={styles.backgroundStyle}>
            <Section title="Work History" image={require('../res/work.png')}>
              Listen to a more detailed work{'\n'}history
            </Section>
            <Section title="Interests and Hobbies" image={require('../res/hobbies.png')}>
              Listen to interests and hobbies
            </Section>
            <Section title="Education History" image={require('../res/education.png')}>
              Listen to a more detailed education history
            </Section>
            <ContactDetails />
      </SafeAreaView>
    );
  }

const styles = StyleSheet.create({
  backgroundStyle: {
    padding: 20,
  },
  sectionContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 32,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  contactDetailsContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 32,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
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

export default HomeScreen;
