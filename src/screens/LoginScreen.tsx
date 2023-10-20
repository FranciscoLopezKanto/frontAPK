import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ImageBackground } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native';


const showPasswordIcon = require('../public/MostrarContra.png');
const backgroundImage = require('../public/fondo.png');
interface LoginScreenProps {
  setUserIsLoggedIn: (value: boolean) => void;
}
const LoginScreen: React.FC<LoginScreenProps> = ({ setUserIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation(); // Obtén el objeto de navegación utilizando useNavigation.

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    console.log('Toggle password visibility');
  };



  const handleLogin = async (email: string, password: string) => {
    setError(false);
    
    try {
      const response = await axios.post('http://localhost:3000/api/v1/auth/login', {
        email,
        password,
      });
      const token = response.data.token;
      await AsyncStorage.setItem('userToken', token);
      console.log(token);
      setUserIsLoggedIn(true);
      console.log("usuario logeado");
      setTimeout(() => {
        navigation.navigate('Home' as never);
      }, 2000);
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
            placeholder="Pile Correo"
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
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.passwordVisibilityButton}>
                <Image source={showPasswordIcon} style={styles.passwordVisibilityIcon} />
              
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.forgotPasswordLink} onPress={() => navigation.navigate('Recovery'as never)}>
            Olvidé mi contraseña
          </Text>
          <TouchableOpacity onPress={() => handleLogin(email, password)} style={styles.button}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
          <Text onPress={() => navigation.navigate('Signin'as never)} style={styles.link}>
            ¿No eres un piletero? Conviértete en uno aquí.
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
    backgroundColor: '#fff',
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
    backgroundColor: '#0050dd',
    borderRadius: 15,
    alignItems: 'center',
    height: 40,
    width: 180,
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
    fontSize: 20,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 240,
    marginBottom: 5,
  },
  passwordInput: {
    backgroundColor: '#fff',
    flexDirection: 'row',
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
  forgotPasswordLink: {
    color: 'blue',
    marginLeft: -100,
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  goToPiletaButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'green',
    borderRadius: 15,
    alignItems: 'center',
    height: 40,
    width: 150,
    marginBottom: -100,
    marginRight: 85,
  },
  goToPiletaButtonText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
    fontSize: 20,
  },
});

export default LoginScreen;
