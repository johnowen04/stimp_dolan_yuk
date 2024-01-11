import 'react-native-gesture-handler';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AsyncStorage from "@react-native-async-storage/async-storage";

import Login from './screens/login';
import DrawerNavigator from './navigations/drawernavigator';
import Register from './screens/register';

const Stack = createNativeStackNavigator();

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      isLogin: false,
    }

    this.cekLogin().then((item) => {
      if (item != null) {
        this.setState(
          this.state = {
            isLogin: true
          })
      }
    })
  }

  cekLogin = async () => {
    try {
      const value = await AsyncStorage.getItem('email');
      if (value !== null) {
        return value;
      }
    } catch (e) {
      // error reading value
    }
  }

  render() {
    if (!this.state.isLogin) {
      return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </Stack.Navigator>
        </NavigationContainer>);
    } else {
      return (
        <NavigationContainer>
          <DrawerNavigator></DrawerNavigator>
        </NavigationContainer>
      );
    }
  }
}
