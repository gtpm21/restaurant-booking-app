// src/navigation/MainTabNavigator.tsx
import React from 'react';
import { Button, Alert, View } from 'react-native'; // Πρόσθεσε το Alert και το Button
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation, CommonActions, NavigationProp } from '@react-navigation/native'; // Πρόσθεσε CommonActions και NavigationProp
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from './AppNavigator';

export type MainTabParamList = {
  HomeTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const performLogout = async (navigation: NavigationProp<RootStackParamList>) => {
  Alert.alert(
    'Logout',
    'Are you sure you want to logout?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('userToken');
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            })
          );
        },
      },
    ]
  );
};

const HeaderLogoutButton = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View style={{ marginRight: 10 }}>
      <Button
        onPress={() => performLogout(navigation)}
        title="Logout"
        color="#c00"
      />
    </View>
  );
};

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

const renderRestaurantIcon = ({ focused, color, size }: TabBarIconProps) => {
  const iconName = focused ? 'food' : 'food-outline';
  return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
};

const renderProfileIcon = ({ focused, color, size }: TabBarIconProps) => {
  const iconName = focused ? 'person-circle' : 'person-circle-outline';
  return <Ionicons name={iconName} size={size} color={color} />;
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ 
          title: 'Restaurants',
          tabBarIcon: renderRestaurantIcon,
          headerRight: HeaderLogoutButton,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'My Profile',
          tabBarIcon: renderProfileIcon,
          headerRight: HeaderLogoutButton,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
