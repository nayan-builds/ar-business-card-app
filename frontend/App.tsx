import {
  Viro3DObject,
  ViroARScene,
  ViroARSceneNavigator,
  ViroAmbientLight,
  ViroText,
} from '@viro-community/react-viro';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
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
      <ViroARSceneNavigator autofocus={true} initialScene={{scene: SceneAR}} />
    );
  }
};

const styles = StyleSheet.create({});
