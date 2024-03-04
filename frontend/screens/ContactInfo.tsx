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
  return (
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
          ]}></Text>
      </View>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image source={require('../res/arrow.png')} />
      </View>
    </View>
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

function ContactInfo(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <Section title="LinkedIn" image={require('../res/link.png')}>
        13 Connections • 118 Posts
      </Section>
      <Section title="JohnDoe95@gmail.com" image={require('../res/email.png')}>
        Email us Mon-Fri • 9-17
      </Section>
      <Section title="+447878774536" image={require('../res/phone.png')}>
        Call us Mon-Fri • 9-17
      </Section>
    </SafeAreaView>
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

export default ContactInfo;
