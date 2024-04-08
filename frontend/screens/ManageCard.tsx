import React, {useEffect, useState} from 'react';
import {
  Button,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  IEducationHistory,
  IUserDetails,
  IWorkHistory,
  getThisUser,
  updateUser,
} from '../utilities/api';
import {Picker} from '@react-native-picker/picker';

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
      <Text style={{textTransform: 'capitalize'}}>{text}</Text>
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

const ObjectViewer = <T extends object>({
  title,
  primary,
  data,
  updateState,
  type,
}: {
  title: string;
  primary?: string;
  data: T[];
  updateState: (key: string, value: any) => void;
  type?: {new (): object};
}) => {
  const [selected, setSelected] = useState(-1);

  const onAdd = () => {
    const object = type == undefined ? '' : new type();
    updateState((data.length + 1).toString(), object);
  };

  const onRemove = () => {
    updateState(selected.toString(), null);
  };

  return (
    <View>
      <Text>{title}</Text>
      <View style={{flexDirection: 'row', gap: 10}}>
        <Picker
          style={{backgroundColor: 'white', flexGrow: 0.7}}
          onValueChange={(value, index) => setSelected(value)}
          selectedValue={selected}>
          <Picker.Item label={'Select ' + title.toLowerCase()} value={-1} />
          {data.map(
            (entry: any, index) =>
              entry != null && (
                <Picker.Item
                  label={`${primary == undefined ? entry : entry[primary]} #${
                    index + 1
                  }`}
                  value={index}
                  key={index}
                />
              ),
          )}
        </Picker>
        <View style={{flexGrow: 0.15}}>
          <TouchableOpacity
            style={{
              backgroundColor: '#2ecc71',
              flex: 1,
              justifyContent: 'center',
            }}
            onPress={onAdd}>
            <Text style={{color: 'white', alignSelf: 'center'}}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexGrow: 0.15}}>
          <TouchableOpacity
            style={{
              backgroundColor: '#e74c3c',
              flex: 1,
              justifyContent: 'center',
            }}
            onPress={onRemove}>
            <Text style={{color: 'white', alignSelf: 'center'}}>-</Text>
          </TouchableOpacity>
        </View>
      </View>
      {selected != -1 && data[selected]
        ? Object.keys(data[selected]).map(
            key =>
              key !== '_id' &&
              (Array.isArray(data[selected][key]) ? (
                <ObjectViewer
                  key={key}
                  data={data[selected][key]}
                  title={key}
                  updateState={() => {}}
                />
              ) : (
                <Input
                  text={key}
                  value={(data[selected] as any)[key]}
                  key={key}
                  onChangeText={value =>
                    updateState(selected.toString() + '.' + key, value)
                  }
                />
              )),
          )
        : null}
    </View>
  );
};

const ManageCard = () => {
  const [user, setUser] = useState<IUserDetails>();
  const [notification, setNotification] = useState<INotification>({
    text: 'Fetching user details! 🚀',
    color: '#f1c40f',
  });

  const updateUserState = (key: string, value: any) => {
    setUser(user => {
      const keys = key.split('.');
      const nestedUser = {...user};
      let nestedObj: any = nestedUser;

      for (let i = 0; i < keys.length - 1; i++) {
        const currentKey = keys[i];
        if (nestedObj[currentKey] == null) {
          nestedObj[currentKey] = {};
        }

        nestedObj = nestedObj[currentKey];
      }

      nestedObj[keys[keys.length - 1]] = value;
      return nestedUser;
    });
  };

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getThisUser();

      if (data.success) {
        console.log(data.user);
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
      <ScrollView>
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
            <Input
              text={'Email'}
              value={user.contact?.email}
              onChangeText={text => updateUserState('contact.email', text)}
            />
            <Input
              text={'Phone Number'}
              value={user.contact?.phone}
              onChangeText={text => updateUserState('contact.phone', text)}
            />
            <ObjectViewer
              title={'Work History'}
              primary={'company'}
              data={user.workHistory!}
              updateState={(key, value) =>
                updateUserState('workHistory.' + key, value)
              }
              type={IWorkHistory}
            />
            <ObjectViewer
              title={'Education History'}
              primary={'institution'}
              data={user.educationHistory!}
              updateState={(key, value) =>
                updateUserState('educationHistory.' + key, value)
              }
              type={IEducationHistory}
            />
            <Button
              title="Update"
              onPress={async () => {
                const res = await updateUser(user);
                console.log(res);
                if (res && res.error) {
                  setNotification({
                    text: res.message,
                    color: '#e74c3c',
                  });
                } else {
                  setNotification({
                    text: 'The card has been updated!',
                    color: '#2ecc71',
                  });
                }
              }}
            />
          </View>
        )}
      </ScrollView>
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
