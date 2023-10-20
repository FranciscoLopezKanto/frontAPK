import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

// Importa las imágenes locales
const pinguinoImage = require('../public/pinguino.png');
const focaImage = require('../public/foca.png');
const perroImage = require('../public/perro.png');

const ProfileScreen: React.FC = () => {
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [logoutMessage, setLogoutMessage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(pinguinoImage);
  const [editOptionsModalVisible, setEditOptionsModalVisible] = useState(false);
  const [editType, setEditType] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get('http://localhost:3000/api/v1/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response);
        // Almacena los datos del perfil en AsyncStorage
        await AsyncStorage.setItem('userProfile', JSON.stringify(response.data));

        setUserProfile(response.data);
      } catch (error) {
        console.error('Error al obtener el perfil del usuario', error);
      }
    };

    getProfile();
  }, []);

  const clearAuthToken = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
    } catch (error) {
      console.error('Error al borrar el token de AsyncStorage', error);
    }
  };

  const handleEditOptions = (type: string) => {
    setEditType(type);
    setEditOptionsModalVisible(true);
  };

  const handleEditProfile = async () => {
    // Lógica para editar el perfil aquí
    // Verifica si el nombre de usuario o contraseña son diferentes de vacío y actualiza el backend si es necesario
  
    // Comprueba si se proporcionó un nuevo nombre de usuario y si no, utiliza el actual
    const updatedUsername = newUsername !== '' ? newUsername : userProfile.username;
  
    // Comprueba si se proporcionó una nueva contraseña y si no, utiliza la actual
    const updatedPassword = newPassword !== '' ? newPassword : userProfile.password;
  
    // Enviar la solicitud al backend para actualizar el perfil
    const token = await AsyncStorage.getItem('userToken');
    const updateData = {
      name: updatedUsername,
      password: updatedPassword,
    };
  
    try {
      await axios.patch('http://localhost:3000/api/v1/auth/editarperfil', updateData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      // Actualiza el perfil localmente
      setUserProfile({ ...userProfile, username: updatedUsername, password: updatedPassword });
  
      // Muestra un mensaje de cambio realizado
      setLogoutMessage('Cambio realizado exitosamente');
  
      // Temporizador para borrar el mensaje después de 2 segundos y refrescar la pantalla
      setTimeout(() => {
        setLogoutMessage(null);
        // Realiza un nuevo llamado a getProfile para actualizar la pantalla con los datos actualizados
        
      });
  
      setEditOptionsModalVisible(false);
    } catch (error) {
      console.error('Error al actualizar el perfil', error);
    }
  };
  
  
  const handleLogout = async () => {
    await clearAuthToken();
    setLogoutMessage('Has cerrado sesión');
    // Temporizador para borrar el mensaje después de 2 segundos
    setTimeout(() => {
      setLogoutMessage(null);
    }, 2000);

    setTimeout(() => {
      navigation.navigate('Login' as never);
    }, 2000);
  };

  const handleImageSelect = (image: any) => {
    setSelectedImage(image);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.avatarContainer}>
            <Image source={selectedImage} style={styles.avatar} />
            {selectedImage === pinguinoImage && (
              <Text style={styles.selectImageText}>Selecciona foto de usuario</Text>
            )}
          </View>
        </TouchableOpacity>
        {userProfile ? (
          <View style={styles.profileInfo}>
            <Text style={styles.username}>Nombre de Usuario: {userProfile.username}</Text>
            <Text style={styles.email}>Email: {userProfile.email}</Text>
          </View>
        ) : (
          <Text>Cargando perfil...</Text>
        )}
      </View>
      {logoutMessage && (
        <View style={styles.logoutMessage}>
          <Text style={styles.logoutMessageText}>{logoutMessage}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.editButton} onPress={() => handleEditOptions('edit')}>
        <Text style={styles.buttonText}>Editar Perfil y Contraseña</Text>
      </TouchableOpacity>
      <Button title="Cerrar Sesión" onPress={handleLogout} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={editOptionsModalVisible}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <ScrollView style={styles.editOptionsScrollView}>
              <View style={styles.inputContainer}>
                <Text>Cambiar Nombre de Usuario:</Text>
                <TextInput
                  placeholder="Dejar en blanco si no se quiere modificar"
                  style={styles.input}
                  onChangeText={(text) => setNewUsername(text)}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text>Cambiar Contraseña:</Text>
                <TextInput
                  placeholder="Dejar en blanco si no se quiere modificar"
                  style={styles.input}
                  onChangeText={(text) => setNewPassword(text)}
                  secureTextEntry={true}
                />
              </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <Button title="Guardar" onPress={handleEditProfile} />
              <Button title="Cancelar" onPress={() => setEditOptionsModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Selecciona una imagen de perfil</Text>
          <TouchableOpacity onPress={() => handleImageSelect(pinguinoImage)}>
            <Image source={pinguinoImage} style={styles.modalImage} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleImageSelect(focaImage)}>
            <Image source={focaImage} style={styles.modalImage} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleImageSelect(perroImage)}>
            <Image source={perroImage} style={styles.modalImage} />
          </TouchableOpacity>
          <Button title="Cancelar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    elevation: 5,
  },
  avatarContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  selectImageText: {
    fontSize: 16,
    color: 'gray',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 10,
  },
  username: {
    fontSize: 18,
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    marginBottom: 15,
  },
  logoutMessage: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    backgroundColor: 'green',
    padding: 8,
    borderRadius: 5,
  },
  logoutMessageText: {
    color: 'white',
  },
  editButton: {
    backgroundColor: 'blue',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
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
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 10,
  },
  editOptionsScrollView: {
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: 280,
    marginBottom: 10,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ProfileScreen;
