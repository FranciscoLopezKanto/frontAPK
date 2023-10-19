import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation

// Función para borrar el token de AsyncStorage
const clearAuthToken = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
  } catch (error) {
    console.error('Error al borrar el token de AsyncStorage', error);
  }
};

// Pantalla de perfil
const ProfileScreen: React.FC = () => {
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [logoutMessage, setLogoutMessage] = useState<string | null>(null); // Estado para el mensaje de cierre de sesión

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get('http://localhost:3000/api/v1/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error al obtener el perfil del usuario', error);
      }
    };

    getProfile();
  }, []);

  const navigation = useNavigation(); // Obtén la instancia de navegación

  const handleLogout = async () => {
    await clearAuthToken();
    // Establece el mensaje de cierre de sesión
    setLogoutMessage('Has cerrado sesión');
    // Redirige al usuario a la pantalla de inicio de sesión después de un breve retraso
    setTimeout(() => {
      navigation.navigate('Login' as never); // Ajusta el nombre de la pantalla de inicio de sesión
    }, 2000); // 2000 milisegundos (2 segundos) de retraso
  };

  return (
    <View style={styles.container}>
      {userProfile ? (
        <View style={styles.profileInfo}>
          <Text>Nombre: {userProfile.name}</Text>
          <Text>Email: {userProfile.email}</Text>
        </View>
      ) : (
        <Text>Cargando perfil...</Text>
      )}
      {logoutMessage && (
        <View style={styles.logoutMessage}>
          <Text>{logoutMessage}</Text>
        </View>
      )}
      <Button title="Cerrar Sesión" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    marginBottom: 20, // Agrega margen inferior para separar el mensaje de cierre de sesión
  },
  logoutMessage: {
    position: 'absolute',
    top: '50%', // Coloca el mensaje en el centro vertical
  },
});

export default ProfileScreen;
