import {useNavigation} from '@react-navigation/native';
import React from 'react';
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
}>;

export default function MyDetails() {
  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <Section title="Work History" image={require('../res/work.png')}>
        Listen to a more detailed work history
      </Section>
      <Section
        title="Interests and Hobbies"
        image={require('../res/hobbies.png')}>
        Listen to interests and hobbies
      </Section>
      <Section
        title="Education History"
        image={require('../res/education.png')}>
        Listen to a more detailed education history
      </Section>
      <ContactDetails />
    </SafeAreaView>
  );
}

function ContactDetails() {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ContactInfo');
      }}>
      <View style={styles.contactDetailsContainer}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', minHeight: 50}}>
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
            ]}></Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image source={require('../res/arrow.png')} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function Section({children, title, image}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionImageContainer}>
        <Image source={image} />
      </View>
      <View style={{flexShrink: 1}}>
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
              flexGrow: 1,
              textAlignVertical: 'center',
            },
          ]}>
          {children}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    padding: 20,
  },
  sectionContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 32,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 100,
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
  sectionImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
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
