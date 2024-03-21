import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Camera from './screens/CameraAR';
import MyDetails from './screens/MyDetails';
import ContactInfo from './screens/ContactInfo';
import MainPage from './screens/MainPage';
import ManageCard from './screens/ManageCard';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={MainPage}
          options={{title: 'Welcome'}}
        />
        <Stack.Screen name="Camera" component={Camera} />
        <Stack.Screen name="Manage Card" component={ManageCard} />
        <Stack.Screen name="MyDetails" component={MyDetails} />
        <Stack.Screen name="ContactInfo" component={ContactInfo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
