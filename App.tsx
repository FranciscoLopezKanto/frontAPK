import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignInScreen from './src/screens/SignInScreen';
import RecoveryScreen from './src/screens/RecoveryScreen';
import ProjectsScreen from './src/screens/ProjectsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false); //Dejar en true si quiere omitir logearse cada vez que se reinicia la app al agregar un cambio
  useEffect(() => {
    setUserIsLoggedIn(false);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={userIsLoggedIn ? 'Home' : 'Login'}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login">
          {props => <LoginScreen {...props} setUserIsLoggedIn={setUserIsLoggedIn} />}
        </Stack.Screen>
        <Stack.Screen name="Signin" component={SignInScreen} />
        <Stack.Screen name="Home" component={TabsScreen} />
        <Stack.Screen name="Recovery" component={RecoveryScreen} />
        <Stack.Screen name='Projects' component={ProjectsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  function TabsScreen() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Projects') {
              iconName = focused ? 'list' : 'list-outline';
            }

            iconName = iconName || 'home';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }} 
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          initialParams={{ userIsLoggedIn, setUserIsLoggedIn }}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Projects"
          component={ProjectsScreen}
          options={{ headerShown: false }} 
        />
      </Tab.Navigator>
    );
  }
}

