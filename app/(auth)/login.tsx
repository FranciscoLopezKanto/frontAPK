import { Link } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth/react-native';
import React, { useState } from 'react';
import { View, StyleSheet, Image, TextInput, Button, Pressable, Text } from 'react-native';
import { FIREBASE_AUTH } from '../../config/FirebaseConfig';
import Spinner from 'react-native-loading-spinner-overlay';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const user = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      console.log('signed in');
    } catch (error) {
      console.error('There was an error logging in:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />

      <Image
        style={styles.logo}
        source={{ uri: 'https://i.postimg.cc/j22C6cL4/Black-And-White-Globe-Y2k-Streetwear-Logo-1.png' }} // replace with your own image URL
      />
      <Text style={styles.imageText}>Pileteeeeeero!</Text>
      <TextInput placeholder="Pile user" value={email} onChangeText={setEmail} style={styles.inputField} />
      <TextInput placeholder="Pile password" value={password} onChangeText={setPassword} secureTextEntry style={styles.inputField} />
      <Button onPress={handleLogin} title="Login"></Button>

      <Link href="/register" asChild>
        <Pressable style={styles.button}>
          <Text>Don't have an account? Register</Text>
        </Pressable>
      </Link>
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
