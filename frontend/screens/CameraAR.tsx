import {
  Viro3DObject,
  ViroARScene,
  ViroARSceneNavigator,
  ViroAmbientLight,
} from '@viro-community/react-viro';
import React, {useEffect, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {BarCodeReadEvent} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';

const CARD_SIGNATURE = 'CARD_';

interface WorkHistory {
  company: string;
  position: string;
  startDate: Date;
  endDate: Date;
  description: string;
}

interface qualification {
  level: string;
  name: string;
  grade: string;
}

interface educationHistory {
  institution: string;
  qualifications: qualification[];
  startDate: Date;
  endDate: Date;
  description: string;
}

interface userDetails {
  overview?: string;
  workHistory?: WorkHistory[];
  educationHistory?: educationHistory[];
  interests?: string[];
}

interface SceneARProps {
  sceneNavigator: {
    viroAppProps: {
      cardId: string;
      user: userDetails;
      setUser: (user: userDetails) => void;
    };
  };
}

const dateToReadable = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
  };

  return date.toLocaleDateString('en-US', options);
};

const playText = async (text: string) => {
  const response = await fetch(
    'https://bef0-143-52-33-95.ngrok-free.app/api/tts',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        voice: 'en-GB_JamesV3Voice',
      }),
    },
  );

  const {audio, timings} = await response.json();
  if (!audio || !timings) return;

  const path = `${RNFS.TemporaryDirectoryPath}/audio.mp3`;
  await RNFS.writeFile(path, audio, 'base64');

  const sound = new Sound(path, '', error => {
    if (error) {
      console.log('failed to load sound', error);
      return;
    }

    sound.play();
  });
};

const SceneAR: React.FC<SceneARProps> = ({sceneNavigator}) => {
  const {user, setUser, cardId} = sceneNavigator.viroAppProps;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://bef0-143-52-33-95.ngrok-free.app/api/user/${cardId}`,
        {
          method: 'GET',
        },
      );

      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user && Object.keys(user).length !== 0) {
      //playText(user.overview!);
    }
  }, [user]);

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" />
      <Viro3DObject
        source={require('./../res/r2d2.obj')}
        resources={[require('./../res/r2d2.mtl')]}
        highAccuracyEvents={true}
        position={[0, -0.5, -1]}
        scale={[1, 1, 1]}
        rotation={[0, -90, 0]}
        type="OBJ"
      />
    </ViroARScene>
  );
};

export default function Camera() {
  const [cardId, setCardId] = useState('');
  const [user, setUser] = useState<userDetails>({});

  const onRead = (e: BarCodeReadEvent) => {
    var data = e.data;
    var position = CARD_SIGNATURE.length;

    if (data.indexOf(CARD_SIGNATURE) == -1) {
      console.log(`QR code is not valid: ${data}`);
    } else {
      console.log(data);
      var id = data.substring(position);
      setCardId(id);
      console.log(`Found card identifier from QR code: ${id}`);
    }
  };

  if (cardId.length == 0) {
    return <QRCodeScanner reactivate={true} onRead={onRead} />;
  } else {
    return (
      <>
        <ViroARSceneNavigator
          autofocus={true}
          initialScene={{scene: SceneAR}}
          viroAppProps={{
            cardId: cardId,
            user: user,
            setUser,
          }}
        />
        <View style={{position: 'absolute', left: 0, bottom: -10}}>
          <MoreInfo user={user} />
        </View>
      </>
    );
  }
}

function MoreInfo({user}: {user: userDetails}) {
  const windowWidth = useWindowDimensions().width;
  const margin = 10;
  const width = windowWidth - 2 * margin;

  return (
    <View
      style={[
        styles.menuBackground,
        {width, marginHorizontal: margin, paddingBottom: 10},
      ]}>
      <Text style={styles.menuHeading}>Want more information about me?</Text>
      <CustomButton
        text="Work History"
        onPress={() => {
          var text = '';

          user.workHistory!.forEach(entry => {
            text += `I worked as a ${entry.position} at ${entry.company} for ${
              new Date(entry.endDate).getFullYear() -
              new Date(entry.startDate).getFullYear()
            } years. ${entry.description !== null ? entry.description : ''}`;
          });

          playText(text);
        }}
      />
      <CustomButton
        text="Education History"
        onPress={() => {
          var text = '';

          user.educationHistory!.forEach(entry => {
            text += `I attended ${entry.institution} from ${dateToReadable(
              new Date(entry.startDate),
            )} to ${dateToReadable(new Date(entry.endDate))}.`;
          });

          playText(text);
        }}
      />
      <CustomButton
        text="Hobbies and Interests"
        onPress={() => {
          var text = "I'm interested in ";

          user.interests!.forEach(entry => {
            text += entry;
          });

          playText(text);
        }}
      />
    </View>
  );
}

function CustomButton({text, onPress}: {text: string; onPress: () => void}) {
  return (
    <Pressable
      style={({pressed}) => [
        {
          backgroundColor: pressed ? 'rgb(100, 100, 100)' : 'rgb(30, 30, 30)',
        },
        styles.button,
      ]}
      onPress={onPress}
      //hitSlop is used to increase the touchable area of the button
      hitSlop={10}
      //pressRetentionOffset is used to increase the distance that you need to move your finger before the button is unpressed
      pressRetentionOffset={20}>
      <Text style={styles.buttonText}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 10,
    padding: 10,
    elevation: 2,
    opacity: 1,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  menuBackground: {
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuHeading: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
  },
});