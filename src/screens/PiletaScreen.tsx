import React from 'react';
import { Image, StyleSheet, View, Button } from 'react-native'; // Importa Button desde 'react-native'

const PiletaScreen: React.FC<{ navigation: any }> = ({ navigation }) => {// Asegúrate de tener 'navigation' como prop
  return (
    <View style={styles.container}>
      <Image
        source={require('../public/pileta.gif')} // Reemplaza con la ruta correcta de tu archivo GIF
        style={styles.gif}
      />
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#48DCFD',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gif: {
    width: 250, // Ajusta el tamaño de la imagen según tus preferencias
    height: 250,
  },
});

export default PiletaScreen;
