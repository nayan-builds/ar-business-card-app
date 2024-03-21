import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Camera from './screens/CameraAR';
import MyDetails from './screens/MyDetails';
import ContactInfo from './screens/ContactInfo';
import MainPage from './screens/MainPage';

import CreateAccount from './screens/CreateAccount';
import Login from './screens/Login';

import {AuthProvider, useAuth} from './context/AuthContext';

import ManageCard from './screens/ManageCard';


const Stack = createNativeStackNavigator();

export default function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

function Layout() {
  const {authState} = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={MainPage}
          options={{title: 'Welcome'}}
        />
        <Stack.Screen name="Camera" component={Camera} />
        {authState?.authenticated ? (
          <>
            <Stack.Screen name="Manage Card" component={ManageCard} />
            <Stack.Screen name="ContactInfo" component={ContactInfo} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="CreateAccount" component={CreateAccount} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
