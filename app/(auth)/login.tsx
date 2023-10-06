import React, { useState } from 'react';
import { View, StyleSheet, Image, TextInput, Button, Pressable, Text } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Inicio de sesión exitoso:', data);
      } else if (response.status === 401) {
        const errorResponse = await response.json();
        console.error('Error de inicio de sesión:', errorResponse.error);

        alert('Credenciales incorrectas. Por favor, inténtelo de nuevo.');
      } else {
        console.error('Error al realizar la solicitud al backend');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />

      <Image
        style={styles.logo}
        source={{ uri: 'https://i.postimg.cc/j22C6cL4/Black-And-White-Globe-Y2k-Streetwear-Logo-1.png' }} // reemplaza con tu propia URL de imagen
      />
      <Text style={styles.imageText}>Pileteeeeeero!</Text>
      <TextInput placeholder="Pile Email" value={email} onChangeText={setEmail} style={styles.inputField} />
      <TextInput placeholder="Pile Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.inputField} />
      <Button onPress={handleLogin} title="Login" />

      <Pressable style={styles.button} onPress={() => navigation.navigate('Register')}>
        <Text>¿No eres Piletero? Registrate</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  imageText: {
    fontSize: 20,
    marginLeft: 10,
    textAlign: 'center',
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    margin: 10,
    alignItems: 'center',
  },
});

export default Login;
