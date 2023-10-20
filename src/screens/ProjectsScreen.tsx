import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo'; // Usamos el ícono Entypo para el botón de agregar

const ProjectsScreen: React.FC = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          loadTeams(token);
        } else {
          console.error('No se encontró un token de usuario en AsyncStorage.');
        }
      } catch (error) {
        console.error('Error al obtener el token desde AsyncStorage', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      getToken();
    });

    return unsubscribe;
  }, [navigation]);

  const loadTeams = (token: string) => {
    axios
      .get('http://localhost:3000/api/v1/teams', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTeams(response.data);
      })
      .catch((error) => {
        console.error('Error al cargar la lista de equipos', error);
      });
  };

  const handleDeleteTeam = async (teamName: string | null) => {
    if (teamName === null) {
      return;
    }

    const token = await AsyncStorage.getItem('userToken');

    try {
      await axios.delete(`http://localhost:3000/api/v1/teams/${teamName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedTeams = teams.filter((team) => team.nombre !== teamName);
      setTeams(updatedTeams);
      setModalVisible(false);
    } catch (error) {
      console.error('Error al eliminar el equipo', error);
      setModalVisible(false);
    }
  };

  const handleAddTeam = () => {
    // Aquí puedes implementar la lógica para agregar un nuevo equipo
    console.log('Agregar nuevo equipo');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.selectText}>Selecciona un equipo:</Text>
      <FlatList
        data={teams}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.teamItem}>
            <View style={styles.teamInfo}>
              <Text style={styles.teamName}>{item.nombre}</Text>
              <Text style={styles.teamDescription}>{item.descripcion}</Text>
            </View>
            <View style={styles.teamIcons}>
              <Icon
                name="pencil"
                size={20}
                color="blue"
                onPress={() => {
                  // Lógica de editar
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  setSelectedTeam(item.nombre);
                  setModalVisible(true);
                }}
              >
                <Icon name="times" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      {/* Botón de agregar equipo */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddTeam}>
        <EntypoIcon name="plus" size={30} color="green" />
      </TouchableOpacity>
      {/* Modal de confirmación */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.confirmationBox}>
            <Text>¿Estás seguro de que deseas eliminar el equipo {selectedTeam}?</Text>
            <View style={styles.modalButtons}>
              <Button
                title="Eliminar"
                onPress={() => handleDeleteTeam(selectedTeam)}
              />
              <Button
                title="Cancelar"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectText: {
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 10,
  },
  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    width: 320,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  teamDescription: {
    fontSize: 14,
    color: 'gray',
  },
  teamIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  confirmationBox: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    width: 250,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProjectsScreen;
