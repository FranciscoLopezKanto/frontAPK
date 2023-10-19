import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';

const HomeScreen = ({ navigation }: any) => {
  return (
    <ImageBackground
      source={require('../public/fondo.png')} // Reemplaza con la ruta correcta de tu archivo de fondo
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.centeredContent}>
          <Image
            source={require('../public/pileta.gif')} // Reemplaza con la ruta correcta de tu archivo GIF
            style={styles.gif}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  gif: {
    width: 250, // Ajusta el tamaño de la imagen según tus preferencias
    height: 250,
  },
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center', // Centra verticalmente en la pantalla.
    alignItems: 'center', // Centra horizontalmente en la pantalla.
  },
  centeredContent: {
    alignItems: 'center', // Centra el contenido dentro del contenedor.
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20, // Espacio entre los botones y el título.
  },
  projectsButton: {
    backgroundColor: 'blue',
    borderRadius: 15,
    alignItems: 'center',
    height: 40,
    width: '48%',
  },
  profileButton: {
    backgroundColor: 'green',
    borderRadius: 15,
    alignItems: 'center',
    height: 40,
    width: '48%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
    fontSize: 20,
  },
});

export default HomeScreen;
