import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroText,
} from '@viro-community/react-viro';
import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {BarCodeReadEvent} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

const CARD_SIGNATURE = 'CARD_';

const SceneAR = () => {
  return (
    <ViroARScene>
      <ViroText text={'Hello :)'}></ViroText>
    </ViroARScene>
  );
};

export default () => {
  const [cardId, setCardId] = useState(-1);

  const onRead = (e: BarCodeReadEvent) => {
    var data = e.data;
    var position = data.indexOf(CARD_SIGNATURE) + CARD_SIGNATURE.length;

    if (position == -1) {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
