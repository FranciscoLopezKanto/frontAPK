import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Image, Text, TouchableOpacity, ImageBackground } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Asegúrate de importar useNavigation

const backgroundImage = require('../public/fondo.png');

const RecoveryScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const navigation = useNavigation(); // Obtiene el objeto de navegación

  const handleResetPassword = () => {
    axios.patch('http://localhost:3000/api/v1/auth/resetpassword', {
      email: email,
    })
    .then(response => {
      console.log('Contraseña restablecida con éxito.');
      setSuccessMessage('La contraseña se ha enviado al correo.');
      setTimeout(() => {
        navigation.navigate('Login'as never); // Redirige a la pantalla de inicio de sesión
      }, 2000);
    })
    .catch(error => {
      if (error.response.status === 404) {
        setErrorMessage('El correo electrónico no está registrado.');
      } else {
        console.error('Error al restablecer la contraseña:', error);
        setErrorMessage('Hubo un error al restablecer la contraseña.');
      }
    });
  };

  useEffect(() => {
    setErrorMessage('');
    setSuccessMessage('');
  }, [email]);

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={require('./../public/icon.png')} style={styles.logo} />
        <View style={styles.container2}>
          <Text style={styles.title}>Olvidé mi contraseña</Text>
          <Text style={styles.subtitle}>Ingrese su correo electrónico</Text>
          <TextInput
            placeholder="Correo Electrónico"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
          {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 16,
  },
  successText: {
    color: 'green',
    marginBottom: 10,
    fontSize: 16,
  },
backgroundImage: {
  flex: 1,
  resizeMode: 'cover',
},
container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
 
},
container2: {
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 15,
  paddingBottom: 10,
  borderRadius: 5,
  backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo semi-transparente 
},
title: {
  fontSize: 24,
  padding: 16,
  color: '#494848',
},
subtitle: {
  fontSize: 16,
  marginBottom: 16,
  color: '#85828a',
},
input: {
  width: 240,
  marginBottom: 20,
  padding: 5,
  borderWidth: 1,
  borderColor: 'black',
  backgroundColor: '#F3f3f3',
  borderRadius: 2,
},
button: {
  backgroundColor: '#0052cc',
  borderRadius: 15,
  alignItems: 'center',
  height: 40,
  width: 150,
  marginBottom: 10,
},
buttonText: {
  color: 'white',
  textAlign: 'center',
  marginTop: 5,
  fontSize: 20,
},
logo: {
  width: 250,
  height: 150,
  marginBottom: 16,
},
});


export default RecoveryScreen;

