import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, ActivityIndicator } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegistration = async () => {
    try {
      setLoading(true);

      const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registro exitoso:', data);
        // Realiza las acciones necesarias después del registro exitoso.
        // Puede ser una navegación a una pantalla de inicio de sesión.
        // navigation.navigate('Login');
      } else {
        console.error('Error en el registro');
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

      <TextInput placeholder='Pile User' value={username} onChangeText={setUsername} style={styles.inputField} />
      <TextInput placeholder="Pile Email" value={email} onChangeText={setEmail} style={styles.inputField} />
      <TextInput placeholder="Pile Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.inputField} />

      {loading ? <ActivityIndicator /> : <Button onPress={handleRegistration} title="Create free account"></Button>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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
});

export default Register;

