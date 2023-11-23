import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';

const ProjectsScreen: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<{ id: string; nombre: string; descripcion: string } | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [editingTeam, setEditingTeam] = useState<{ id: string | null; nombre: string; descripcion: string }>({ id: null, nombre: '', descripcion: '' });
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isAddMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const getTokenAndLoadTeams = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          await loadTeams(token);
        } else {
          console.error('No se encontró un token de usuario en AsyncStorage.');
        }
      } catch (error) {
        console.error('Error al obtener el token desde AsyncStorage', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      getTokenAndLoadTeams();
    });

    return unsubscribe;
  }, [navigation]);

  const handleDeleteTeam = async (teamName: string | null) => {
    if (teamName === null) {
      return;
    }
  
    // Encuentra el equipo correspondiente en tu estado 'teams'
    const teamToDelete = teams.find(team => team.nombre === teamName);
  
    if (teamToDelete) {
      setSelectedTeam(teamToDelete);
      setDeleteModalVisible(true);
    } else {
      console.error('No se encontró el equipo correspondiente en los datos.');
    }
  };
  
  const loadTeams = async (token: string) => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/teams/equipos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTeams(response.data);
    } catch (error) {
      console.error('Error al cargar la lista de equipos', error);
    }
  };
  const handleAddMembers = (team: { id: string; nombre: string; descripcion: string }) => {
    setAddMemberModalVisible(true);
    setSelectedTeam(team);
  };

  const handleAddMember = async () => {
    if (!selectedTeam || !newMemberEmail) {
      console.error('Selecciona un equipo y proporciona un correo electrónico válido');
      return;
    }

    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.error('No se encontró un token de usuario en AsyncStorage.');
      return;
    }

    const data = {
      teamName: selectedTeam.nombre,
      email: newMemberEmail,
    };

    try {
      const response = await axios.post('http://localhost:3000/api/v1/teams/addMember', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Miembro agregado:', response.data);

      
    } catch (error) {
      console.error('Error al agregar el miembro al equipo', error);
    }

    setNewMemberEmail('');
    setAddMemberModalVisible(false);
  };

  const handleCancelAddMember = () => {
    setNewMemberEmail('');
    setAddMemberModalVisible(false);
  };

  

  const handleEditTeam = (team: { id: string; nombre: string; descripcion: string }) => {
    setEditingTeam(team);
    setModalVisible(true);
  };

  const confirmDeleteTeam = async () => {
    if (selectedTeam === null) {
      return;
    }

    const token = await AsyncStorage.getItem('userToken');

    try {
      await axios.delete(`http://localhost:3000/api/v1/teams/${selectedTeam}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedTeams = teams.filter((team) => team.nombre !== selectedTeam);
      setTeams(updatedTeams);
      setDeleteModalVisible(false);
    } catch (error) {
      console.error('Error al eliminar el equipo', error);
      setDeleteModalVisible(false);
    }

    setSelectedTeam(null);
  };

  const handleSaveEditTeam = async () => {
    if (editingTeam.id && editingTeam.nombre !== '') {
      const token = await AsyncStorage.getItem('userToken');

      try {
        const response = await axios.patch(
          `http://localhost:3000/api/v1/teams/editarteam/${editingTeam.id}`,
          {
            nombre: editingTeam.nombre,
            descripcion: editingTeam.descripcion,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Equipo editado:', response.data);

        if (token) {
          loadTeams(token);
        }
      } catch (error) {
        console.error('Error al editar el equipo', error);
      }

      setEditingTeam({ id: null, nombre: '', descripcion: '' });
      setModalVisible(false);
    }
  };

  const handleCancelEditTeam = () => {
    setEditingTeam({ id: null, nombre: '', descripcion: '' });
    setModalVisible(false);
  };

  const handleAddTeam = async () => {
    if (newTeamName !== '') {
      try {
        const token = await AsyncStorage.getItem('userToken');

        if (token !== null && typeof token === 'string') {
          const newTeam = {
            name: newTeamName,
            descripcion: newTeamDescription,
          };

          const response = await axios.post('http://localhost:3000/api/v1/teams/crearTeam', newTeam, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log('Equipo creado:', response.data);

          if (token !== null) {
            loadTeams(token);
          }
        } else {
          console.error('El token es nulo o no es una cadena válida');
        }
      } catch (error) {
        console.error('Error al crear el equipo', error);
      }

      setNewTeamName('');
      setNewTeamDescription('');
      setModalVisible(false);
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
                onPress={() => handleEditTeam(item)}
              />
              <TouchableOpacity
                onPress={() => handleDeleteTeam(item.nombre)}
              >
                <Icon name="times" size={20} color="red" />
              </TouchableOpacity>
              <Icon
                name="plus"
                size={20}
                color="green"
                onPress={() => handleAddMembers(item)}
              />
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
          {editingTeam.id ? (
            <View style={styles.confirmationBox}>
              <Text>Editar Equipo</Text>
              <Text>Nombre:</Text>
              <TextInput
                value={editingTeam.nombre}
                onChangeText={(text) => setEditingTeam({ ...editingTeam, nombre: text })}
                style={styles.input}
              />
              <Text>Descripción:</Text>
              <TextInput
                value={editingTeam.descripcion}
                onChangeText={(text) => setEditingTeam({ ...editingTeam, descripcion: text })}
                style={styles.input}
              />
              <View style={styles.modalButtons}>
                <Button title="Guardar" onPress={handleSaveEditTeam} />
                <Button title="Cancelar" onPress={handleCancelEditTeam} />
              </View>
            </View>
          ) : (
            <View style={styles.confirmationBox}>
              <Text>Crear Nuevo Equipo</Text>
              <Text>Nombre:</Text>
              <TextInput
                value={newTeamName}
                onChangeText={(text) => setNewTeamName(text)}
                style={styles.input}
              />
              <Text>Descripción:</Text>
              <TextInput
                value={newTeamDescription}
                onChangeText={(text) => setNewTeamDescription(text)}
                style={styles.input}
              />
              <View style={styles.modalButtons}>
                <Button title="Crear" onPress={handleAddTeam} />
                <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          )}
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={isDeleteModalVisible}
        animationType="slide"
        onRequestClose={() => {
          setDeleteModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.confirmationBox}>
            <Text>¿Estás seguro de que deseas eliminar el equipo {selectedTeam?.nombre}?</Text>
            <View style={styles.modalButtons}>
              <Button title="Eliminar" onPress={confirmDeleteTeam} />
              <Button title="Cancelar" onPress={() => setDeleteModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={isAddMemberModalVisible}
        animationType="slide"
        onRequestClose={() => {
          setAddMemberModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.confirmationBox}>
            <Text>Agregar Miembro</Text>
            <Text>Correo Electrónico:</Text>
            <TextInput
              value={newMemberEmail}
              onChangeText={(text) => setNewMemberEmail(text)}
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <Button title="Agregar" onPress={handleAddMember} />
              <Button title="Cancelar" onPress={handleCancelAddMember} />
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
    fontSize: 20,
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
    borderRadius: 10,
    width: 300,
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
});

export default ProjectsScreen;