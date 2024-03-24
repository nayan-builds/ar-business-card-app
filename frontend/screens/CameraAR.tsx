import {API_URL} from '../utilities/api';
import {
  Viro3DObject,
  ViroARScene,
  ViroARSceneNavigator,
  ViroAmbientLight,
  ViroAnimations,
  ViroNode,
  ViroText,
} from '@viro-community/react-viro';
import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageSourcePropType,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {BarCodeReadEvent} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import {IUserDetails, getUser} from '../utilities/api';

const CARD_SIGNATURE = 'CARD_';

interface SceneARProps {
  sceneNavigator: {
    viroAppProps: {
      cardId: string;
      user: IUserDetails;
      setUser: (user: IUserDetails) => void;
      setWord: (word: string) => void;
      setTalking: (talking: boolean) => void;
      talking: boolean;
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

const playText = async (
  text: string,
  setTalking: (talking: boolean) => void,
  onWord: (word: string) => void,
) => {
  const response = await fetch(API_URL + '/api/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      voice: 'en-GB_JamesV3Voice',
    }),
  });
  const {audio, timings} = await response.json();
  if (!audio || !timings) return;
  const path = `${RNFS.TemporaryDirectoryPath}/audio.mp3`;
  await RNFS.writeFile(path, audio, 'base64');
  const sound = new Sound(path, '', error => {
    if (error) {
      console.log('failed to load sound', error);
      return;
    }
    //This is the length of each block of time in seconds,
    //If a word starts inside the current block, it will be
    //included in the subtitles
    const timeBlockLength = 1.5;
    let time = 0;
    setInterval(() => {
      sound.getCurrentTime((seconds, isPlaying) => {
        //This seems to keep playing even after the sound is finished?,
        //may need fixing somehow as may be repeating unnecessary code
        let words = '';
        if (seconds > time) {
          time += timeBlockLength;
        }
        for (const timing of timings) {
          if (time - timeBlockLength <= timing[1] && time > timing[1]) {
            words += timing[0] + ' ';
          }
        }
        words = words.trim();
        //For some reason, this fixes the subtitles keeping the last word
        if (seconds >= sound.getDuration() - 0.01) words = '';
        if (isPlaying) onWord(words);
      });
    }, 300);
    setTalking(true);
    sound.play(() => {
      //onEnd() callback
      setTalking(false);
      onWord('');
    });
  });
};

const SceneAR: React.FC<SceneARProps> = ({sceneNavigator}) => {
  const {user, setUser, cardId, setWord, talking, setTalking} =
    sceneNavigator.viroAppProps;

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUser(cardId);
      if (data.success) {
        setUser(data.user);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user && Object.keys(user).length !== 0) {
      playText(user.overview!, setTalking, word => setWord(word));
    }
  }, [user]);

  const models = [
    {
      source: require('./../res/r2d2.obj'),
      resources: [require('./../res/r2d2.mtl')],
    },
    {
      source: require('./../res/floatingrobot.obj'),
      resources: [require('./../res/floatingrobot.mtl')],
    },
  ];

  const [currentAnimation, setCurrentAnimation] = useState(idleAnimations[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTalkingAnimationPlaying, setIsTalkingAnimationPlaying] =
    useState(false);
  const [modelId, setModelId] = useState(0);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      if (!isAnimating && !isTalkingAnimationPlaying) {
        setIsAnimating(true);
        const randomIndex = Math.floor(Math.random() * idleAnimations.length);
        setCurrentAnimation(idleAnimations[randomIndex]);
        setIsAnimating(false);
      }
    }, randomInterval(5000, 10000));

    return () => clearInterval(animationInterval);
  }, [isAnimating, isTalkingAnimationPlaying]);

  useEffect(() => {
    setIsTalkingAnimationPlaying(talking);
    setCurrentAnimation('talk');
  }, [talking]);

  const randomInterval = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" />
      <ViroNode
        position={[0, -0.2, -0.3]}
        animation={{
          name: currentAnimation,
          run: true,
          loop: false,
        }}>
        <ViroNode
          animation={{
            name: 'talk',
            run: isTalkingAnimationPlaying,
            loop: true,
          }}>
          <Viro3DObject
            source={models[modelId].source}
            resources={models[modelId].resources.map(resource => resource)}
            highAccuracyEvents={true}
            scale={[0, 0, 0]}
            rotation={[0, 0, 0]}
            type="OBJ"
            animation={{name: 'grow', run: true, loop: false, delay: 1500}}
            onClick={() => {
              setModelId(prevState => (prevState + 1) % models.length);
            }}
          />
        </ViroNode>
      </ViroNode>
      <ViroText
        text="Tap on the robot to change the model!"
        color="#ff0000"
        style={{fontSize: 20, textAlignVertical: 'center'}}
        width={2}
        height={4}
        position={[0, 1, -3]}
      />
    </ViroARScene>
  );
};

const idleAnimations = ['spin', 'spinAndJump', 'walk'];

ViroAnimations.registerAnimations({
  spin: {
    properties: {
      rotateY: '+=360',
    },
    duration: 1000,
    easing: 'EaseInEaseOut',
  },
  jumpUp: {
    properties: {
      positionY: '+=0.1',
    },
    duration: 500,
    easing: 'EaseInEaseOut',
  },
  fallFromJump: {
    properties: {
      positionY: '-=0.1',
    },
    duration: 500,
    easing: 'EaseInEaseOut',
  },
  jump: [['jumpUp', 'fallFromJump']],
  spinAndJump: [['spin'], ['jump']],
  rotateRight: {
    properties: {
      rotateY: '+=5',
    },
    duration: 50,
    easing: 'EaseInEaseOut',
  },
  rotateLeft: {
    properties: {
      rotateY: '-=10',
    },
    duration: 100,
    easing: 'EaseInEaseOut',
  },
  talk: [['rotateRight', 'rotateLeft', 'rotateRight']],
  grow: {
    properties: {
      scaleX: '0.8',
      scaleY: '0.8',
      scaleZ: '0.8',
    },
    duration: 1500,
    easing: 'EaseInEaseOut',
  },
  walkForward: {
    properties: {
      positionZ: '+=0.1',
    },
    duration: 1000,
  },
  walkBackward: {
    properties: {
      positionZ: '-=0.1',
    },
    duration: 1000,
  },
  walk: [['walkForward', 'walkBackward', 'walkBackward', 'walkForward']],
});

export default function Camera() {
  const [cardId, setCardId] = useState('');
  const [user, setUser] = useState<IUserDetails>({});
  const [word, setWord] = useState('');
  const [talking, setTalking] = useState(false);

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
            setWord,
            setTalking,
            talking,
          }}
        />
        <View style={{position: 'absolute', left: 0, bottom: -10}}>
          {word.length !== 0 && (
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}>
              <Text
                style={{
                  backgroundColor: 'black',
                  fontSize: 20,
                  display: 'flex',
                  padding: 5,
                  color: 'white',
                  textAlign: 'center',
                }}>
                {word}
              </Text>
            </View>
          )}

          <MoreInfo
            user={user}
            setWord={setWord}
            setTalking={setTalking}
            talking={talking}
          />
        </View>
      </>
    );
  }
}

function MoreInfo({
  user,
  setWord,
  setTalking,
  talking,
}: {
  user: IUserDetails;
  setWord: (word: string) => void;
  setTalking: (talking: boolean) => void;
  talking: boolean;
}) {
  const windowWidth = useWindowDimensions().width;
  const margin = 10;
  const width = windowWidth - 2 * margin;
  const [disableButtons, setDisableButtons] = useState(true);

  useEffect(() => {
    if (talking) {
      setDisableButtons(true);
    } else {
      setDisableButtons(false);
    }
  }, [talking]);
  return (
    <>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        {user.contact?.linkedIn && (
          <TouchableOpacity
            onPress={() => Linking.openURL(user.contact!.linkedIn!)}>
            <Image
              source={require('./../res/link.png')}
              style={{
                width: 50,
                height: 50,
                margin: 10,
                backgroundColor: 'white',
                borderRadius: 15,
              }}
            />
          </TouchableOpacity>
        )}
        {user.contact?.email && (
          <TouchableOpacity
            onPress={() => Linking.openURL(`mailto:${user.contact!.email}`)}>
            <Image
              source={require('./../res/email.png')}
              style={{
                width: 50,
                height: 50,
                margin: 10,
                backgroundColor: 'white',
                borderRadius: 15,
              }}
            />
          </TouchableOpacity>
        )}
        {user.contact?.phone && (
          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${user.contact!.phone!}`)}>
            <Image
              source={require('./../res/phone.png')}
              style={{
                width: 50,
                height: 50,
                margin: 10,
                backgroundColor: 'white',
                borderRadius: 15,
              }}
            />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={[
          styles.menuBackground,
          {width, marginHorizontal: margin, paddingBottom: 10},
        ]}>
        {/* <Text style={styles.menuHeading}>Want more information about me?</Text> */}
        <CustomButton
          text="Work"
          image={require('./../res/work.png')}
          disabled={disableButtons}
          onPress={() => {
            setDisableButtons(true);
            var text = '';

            user.workHistory!.forEach(entry => {
              text += `I worked as a ${entry.position} at ${
                entry.company
              } for ${
                new Date(entry.endDate).getFullYear() -
                new Date(entry.startDate).getFullYear()
              } years. ${entry.description !== null ? entry.description : ''} `;
            });

            playText(text, setTalking, word => setWord(word));
          }}
        />
        <CustomButton
          text="Education"
          image={require('./../res/education.png')}
          disabled={disableButtons}
          onPress={() => {
            setDisableButtons(true);
            var text = '';

            user.educationHistory!.forEach(entry => {
              var qualificationText = '';
              entry.qualifications.forEach(qualification => {
                if (qualificationText.length !== 0) qualificationText += ', ';
                qualificationText += `a ${qualification.level} in ${qualification.name} and ended with a ${qualification.grade}`;
              });
              qualificationText += '.';
              text += `I attended ${entry.institution} from ${dateToReadable(
                new Date(entry.startDate),
              )} to ${dateToReadable(
                new Date(entry.endDate),
              )}. While there, I studied ${qualificationText}`;
            });

            playText(text, setTalking, word => setWord(word));
          }}
        />
        <CustomButton
          text="Interests"
          image={require('./../res/hobbies.png')}
          disabled={disableButtons}
          onPress={() => {
            setDisableButtons(true);
            var text = "I'm interested in ";

            user.interests!.forEach(entry => {
              text += entry;
            });

            playText(text, setTalking, word => setWord(word));
          }}
        />
      </View>
    </>
  );
}

function CustomButton({
  text,
  onPress,
  image,
  disabled,
}: {
  text: string;
  onPress: () => void;
  image: ImageSourcePropType;
  disabled?: boolean;
}) {
  return (
    <Pressable
      style={({pressed}) => [
        {
          backgroundColor: pressed ? '#aaa' : disabled ? '#888' : '#333',
        },
        styles.button,
      ]}
      onPress={onPress}
      disabled={disabled}
      //hitSlop is used to increase the touchable area of the button
      hitSlop={10}
      //pressRetentionOffset is used to increase the distance that you need to move your finger before the button is unpressed
      pressRetentionOffset={20}>
      <Image source={image} style={styles.buttonImage} />
      <Text style={styles.buttonText}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
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
  buttonImage: {
    width: 25,
    height: 25,
  },
  menuBackground: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',
    // borderRadius: 10,
    // borderWidth: 3,
    // borderColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuHeading: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
  },
});
