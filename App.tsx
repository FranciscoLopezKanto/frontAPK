// App.tsx

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignInScreen from './src/screens/SignInScreen';
import RecoveryScreen from './src/screens/RecoveryScreen';
import TeamsScreen from './src/screens/TeamsScreen';
import ProjectsScreen from './src/screens/ProjectsScreen';
import ProjectDetailScreen from './src/screens/ProjectDetailScreen';
import TaskScreen from './src/screens/TaskScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
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
          {(props) => <LoginScreen {...props} setUserIsLoggedIn={setUserIsLoggedIn} />}
        </Stack.Screen>
        <Stack.Screen name="Signin" component={SignInScreen} />
        <Stack.Screen name="Home" component={TabsScreen} />
        <Stack.Screen name="Recovery" component={RecoveryScreen} />
        <Stack.Screen name='Teams' component={TeamsScreen} />
        <Stack.Screen name='Projects' component={ProjectsScreen} />
        <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} options={{ headerShown: true }} />
        <Stack.Screen name="TaskScreen" component={TaskScreen} options={{ headerShown: true }} />

        
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
            } else if (route.name === 'Teams') {
              iconName = focused ? 'people' : 'people-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
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
        <Tab.Screen
          name="Teams"
          component={TeamsScreen}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    );
  }
}
