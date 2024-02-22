import {
  Viro3DObject,
  ViroARScene,
  ViroARSceneNavigator,
  ViroAmbientLight,
} from '@viro-community/react-viro';
import React, {useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {BarCodeReadEvent} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

const CARD_SIGNATURE = 'CARD_';

const SceneAR = () => {
  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" />
      <Viro3DObject
        source={require('./res/r2d2.obj')}
        resources={[require('./res/r2d2.mtl')]}
        highAccuracyEvents={true}
        position={[0, -0.5, -1]}
        scale={[1, 1, 1]}
        rotation={[0, -90, 0]}
        type="OBJ"
      />
    </ViroARScene>
  );
};

export default () => {
  const [cardId, setCardId] = useState(-1);

  const onRead = (e: BarCodeReadEvent) => {
    var data = e.data;
    var position = CARD_SIGNATURE.length;

    if (data.indexOf(CARD_SIGNATURE) == -1) {
      console.log(`QR code is not valid: ${data}`);
    } else {
      var id = parseInt(data.substring(position));
      setCardId(id);
      console.log(`Found card identifier from QR code: ${id}`);
    }
  };

  if (cardId == -1) {
    return <QRCodeScanner reactivate={true} onRead={onRead} />;
  } else {
    return (
      <>
        <ViroARSceneNavigator
          autofocus={true}
          initialScene={{scene: SceneAR}}
        />
        <View style={{position: 'absolute', left: 0, bottom: 0}}>
          <MoreInfo />
        </View>
      </>
    );
  }
};

function MoreInfo() {
  const windowWidth = useWindowDimensions().width;
  const margin = 10;

  return (
    <View
      style={[
        styles.menuBackground,
        {width: windowWidth - 2 * margin, margin},
      ]}>
      <Text style={styles.menuHeading}>Want more information about me?</Text>
      <CustomButton
        text="Work History"
        onPress={() => console.log('Pressed')}
      />
      <CustomButton
        text="Education History"
        onPress={() => console.log('Pressed')}
      />
      <CustomButton
        text="Hobbies and Interests"
        onPress={() => console.log('Pressed')}
      />
      <CustomButton
        text="Contact Info"
        onPress={() => console.log('Pressed')}
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
      hitSlop={15}
      //pressRetentionOffset is used to increase the distance that you need to move your finger before the button is unpressed
      pressRetentionOffset={25}>
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
