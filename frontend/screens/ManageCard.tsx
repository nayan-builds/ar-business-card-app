import React, {useEffect, useState} from 'react';
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {IUserDetails, getUser, updateUser} from '../utilities/api';

interface INotification {
  text?: string;
  color?: string;
}

const Input = ({
  text,
  value,
  multiline,
  onChangeText,
}: {
  text: string;
  value?: string;
  multiline?: boolean;
  onChangeText?: (text: string) => void;
}) => {
  return (
    <View style={{flexGrow: 1}}>
      <Text>{text}</Text>
      <TextInput
        style={{
          backgroundColor: 'white',
          height: multiline ? 100 : 50,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
        value={value}
        multiline={multiline}
        onChangeText={onChangeText}></TextInput>
    </View>
  );
};

const ManageCard = () => {
  const [user, setUser] = useState<IUserDetails>();
  const [notification, setNotification] = useState<INotification>({
    text: 'Fetching user details! 🚀',
    color: '#f1c40f',
  });
  const [id, setId] = useState('65d47f6b5ed28dd46bdf1e3e'); // TODO: fetch from authentication

  const updateUserState = (key: string, value: string) => {
    setUser(user => ({
      ...user,
      [key]: value,
    }));
  };

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUser(id);

      if (data.success) {
        setUser(data.user);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (notification.text && notification.text.length > 0) {
      timeout = setTimeout(() => {
        setNotification({});
      }, 1000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [notification, setNotification]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {user && (
          <View style={{gap: 10}}>
            <View style={{flexDirection: 'row', gap: 10}}>
              <Input
                text={'First Name'}
                value={user.firstName}
                onChangeText={text => updateUserState('firstName', text)}
              />
              <Input
                text={'Last Name'}
                value={user.lastName}
                onChangeText={text => updateUserState('lastName', text)}
              />
            </View>
            <Input
              text={'Overview'}
              value={user.overview}
              multiline={true}
              onChangeText={text => updateUserState('overview', text)}
            />
            <Button
              title="Update"
              onPress={() => {
                updateUser(id, user);
                setNotification({
                  text: 'The card has been updated!',
                  color: '#2ecc71',
                });
              }}
            />
          </View>
        )}
      </View>
      {notification != null && (
        <View
          style={[styles.notification, {backgroundColor: notification.color}]}>
          <Text style={{color: 'white'}}>{notification.text}</Text>
          <Text style={{color: 'white'}} onPress={() => setNotification({})}>
            X
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  notification: {
    position: 'absolute',
    bottom: 0,
    padding: 10,
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ManageCard;
