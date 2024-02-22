import {useNavigation} from '@react-navigation/native';
import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Image,
  ImageProps,
  Pressable,
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

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <CustomButton
        text="Camera"
        onPress={() => {
          navigation.navigate('Camera');
        }}
      />
    </SafeAreaView>
  );
}

function CustomButton({
  text,
  onPress,
}: {
  text: string;
  onPress: () => void;
}): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <Pressable
      style={({pressed}) => [
        {
          backgroundColor: pressed
            ? 'rgb(255, 255, 255)'
            : 'rgb(200, 200, 200)',
        },
        styles.button,
      ]}
      onPress={onPress}
      //hitSlop is used to increase the touchable area of the button
      hitSlop={10}
      //pressRetentionOffset is used to increase the distance that you need to move your finger before the button is unpressed
      pressRetentionOffset={20}>
      <Text
        style={[
          styles.buttonText,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    padding: 20,
    margin: 'auto',
  },
  button: {
    marginTop: 32,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 100,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    fontSize: 18,
    fontWeight: '400',
  },
});
