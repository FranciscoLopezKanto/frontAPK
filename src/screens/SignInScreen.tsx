import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ImageBackground, Modal, Button } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
const backendUrl = process.env.REACT_APP_BACKEND_URL; //no se esta usando por bug que no se pudo resolver

const showPasswordIcon = require('../public/MostrarContra.png');
const backgroundImage = require('../public/fondo.png');

const RegisterScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (
    name: string,
    email: string,
    rol: string,
    password: string
  ) => {
    setError(false);

    if (!name || !email || !rol || !password) {
      setError(true);
      setErrorMessage('Todos los campos son obligatorios.');
      return;
    }

    if (password.length < 6) {
      setError(true);
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3000/api/v1/auth/register`, {
        name,
        email,
        password,
        role: rol,
      });

      setModalMessage('Usuario registrado correctamente');
      setModalVisible(true);

      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('Login' as never);
      }, 2000);

      console.log(response);
    } catch (e: any) {
      setError(true);
      console.error('Error al registrar usuario:', e);
      setErrorMessage('Ocurrió un error al registrar usuario.');
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
          <Picker
            selectedValue={rol}
            style={styles.picker}
            onValueChange={(itemValue: React.SetStateAction<string>) => setRol(itemValue)}
          >
            <Picker.Item label="Selecciona un rol" value="" />
            <Picker.Item label="Programador" value="programador" />
            <Picker.Item label="Scrum Master" value="Scrum Master" />
            <Picker.Item label="Diseñador" value="Diseñador" />
          </Picker>
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
            onPress={() => handleRegister(username, email, rol, password)}
          >
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
          <Text onPress={() => navigation.navigate('Login')} style={styles.link}>
            ¿Ya tienes una cuenta? Inicia Sesión.
          </Text>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalMessage}>{modalMessage}</Text>
              <Button title="Cerrar" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
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
  picker: {
    height: 40,
    width: 240,
    marginBottom: 20,
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
    backgroundColor: '#004080',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 12,
    elevation: 5,
  },
  modalMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default RegisterScreen;
