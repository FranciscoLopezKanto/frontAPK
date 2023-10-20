import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';

const ProjectsScreen: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]); // Corrección: Define el tipo de 'teams'
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
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

  const handleAddTeam = async () => {
    if (!newTeamName || !newTeamDescription) {
      alert('Por favor, ingresa un nombre y una descripción para el nuevo equipo.');
      return;
    }

    const token = await AsyncStorage.getItem('userToken');

    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/teams/crearTeam',
        {
          name: newTeamName,
          descripcion: newTeamDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newTeam = {
        id: response.data.id,
        nombre: newTeamName,
        descripcion: newTeamDescription,
      };

      setTeams([...teams, newTeam]);
      setNewTeamName('');
      setNewTeamDescription('');
      setModalVisible(false);
    } catch (error) {
      console.error('Error al agregar el nuevo equipo', error);
    }
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
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <EntypoIcon name="plus" size={30} color="green" />
      </TouchableOpacity>
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
            {selectedTeam ? (
              <>
                <Text>¿Estás seguro de que deseas eliminar el equipo {selectedTeam}?</Text>
                <View style={styles.modalButtons}>
                  <Button
                    title="Eliminar"
                    onPress={() => handleDeleteTeam(selectedTeam)}
                    style={styles.modalButton} // Estilo para los botones
                  />
                  <Button
                    title="Cancelar"
                    onPress={() => {
                      setModalVisible(false);
                      setSelectedTeam(null);
                    }}
                    style={styles.modalButton} // Estilo para los botones
                  />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.modalText}>Agregar un nuevo equipo:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre del equipo"
                  value={newTeamName}
                  onChangeText={setNewTeamName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Descripción del equipo"
                  value={newTeamDescription}
                  onChangeText={setNewTeamDescription}
                />
                <View style={styles.modalButtons}>
                  <Button
                    title="Agregar"
                    onPress={handleAddTeam}
                    style={styles.modalButton} // Estilo para los botones
                  />
                  <Button
                    title="Cancelar"
                    onPress={() => {
                      setModalVisible(false);
                      setSelectedTeam(null);
                    }}
                    style={styles.modalButton} // Estilo para los botones
                  />
                </View>
              </>
            )}
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
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10, // Aumenta el radio del borde
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
    padding: 20, // Aumenta el espaciado
    borderRadius: 10,
    elevation: 5,
    width: 300,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1, // Para que ambos botones ocupen el mismo espacio
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    padding: 8,
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
