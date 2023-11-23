import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ImageBackground } from 'react-native';
import axios from 'axios';

const showPasswordIcon = require('../public/MostrarContra.png');
const backgroundImage = require('../public/fondo.png');

const RegisterScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (
    name: string,
    email: string,
    password: string
  ) => {
    setError(false);

    try {
      const response = await axios.post(`http://localhost:3000/api/v1/auth/register`, {
        name,
        email,
        password,
      });
      console.log(response);
      setTimeout(() => {
        navigation.navigate('Login' as never);//te lleva al login al registrarse para logearse
      }, 2000);
      console.log("usuario registrado");
    } catch (e: any) {
      setError(true);
      console.error("Error al iniciar sesión:", e); 
      setErrorMessage("Ocurrió un error al iniciar sesión.");
    }
    
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={require('../public/icon.png')} style={styles.logo} />
        <View style={styles.container2}>
          <Text style={[styles.title, styles.titleWithOutline]}>Bienvenido Piletero</Text>
          <TextInput
            placeholder="Pile User"
            value={username}
            onChangeText={(text: string) => setUsername(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Pile Email"
            value={email}
            onChangeText={(text: string) => setEmail(text)}
            style={styles.input}
          />
          <View style={styles.passwordInputContainer}>
            <View style={styles.passwordInput}>
              <TextInput
                placeholder="Pile Contra"
                value={password}
                onChangeText={(text: string) => setPassword(text)}
                secureTextEntry={!showPassword}
                style={styles.passwordTextInput}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                style={styles.passwordVisibilityButton}
              >
                <Image source={showPasswordIcon} style={styles.passwordVisibilityIcon} />
              </TouchableOpacity>
            </View>
          </View>
          {error && <Text style={styles.errorText}>{errorMessage}</Text>}
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleRegister(username, email, password)}
          >
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
          <Text onPress={() => navigation.navigate('Login')} style={styles.link}>
            Ya tienes una cuenta? Inicia Sesión.
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
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
    
  },
  titleWithOutline: {
    textShadowColor: 'rgba(255, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  title: {
    fontSize: 24,
    padding: 16,
    color: '#000',
  },
  input: {
    backgroundColor: '#ffffff',
    width: 240,
    marginBottom: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
  },
  logo: {
    width: 250,
    height: 150,
    marginBottom: 16,
  },
  link: {
    marginTop: 16,
    color: 'blue',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0052cc',
    borderRadius: 15,
    alignItems: 'center',
    height: 40,
    width: 150,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
    fontSize: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 240,
    marginBottom: 15,
  },
  passwordInput: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    flex: 1,
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 1,
    padding: 1,
  },
  passwordTextInput: {
    flex: 1,
    padding: 0,
  },
  passwordVisibilityButton: {
    padding: 5,
  },
  passwordVisibilityIcon: {
    width: 25,
    height: 25,
  },
});

export default RegisterScreen;
