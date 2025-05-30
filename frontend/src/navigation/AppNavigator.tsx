import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BookingScreen from '../screens/BookingScreen';
import MainTabNavigator, { MainTabParamList } from './MainTabNavigator';
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  AppMain: NavigatorScreenParams<MainTabParamList>;
  Booking: { restaurantId: number; restaurantName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create Account' }} />
      <Stack.Screen
        name="AppMain"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={({ route }) => ({ title: `Book: ${route.params.restaurantName}` })}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
