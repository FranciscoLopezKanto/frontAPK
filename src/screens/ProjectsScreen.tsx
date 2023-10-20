import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Cambia 'FontAwesome' al ícono que desees usar

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

  const handleDeleteTeam = async (teamName: string) => {
    const token = await AsyncStorage.getItem('userToken');

    try {
      await axios.delete(`http://localhost:3000/api/v1/teams/${teamName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Actualizar la lista de equipos después de eliminar
      const updatedTeams = teams.filter((team) => team.nombre !== teamName);
      setTeams(updatedTeams);

      // Cierra el modal
      setModalVisible(false);
    } catch (error) {
      console.error('Error al eliminar el equipo', error);
      // Cierra el modal
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Selecciona un equipo:</Text>
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
                name="pencil" // Nombre del ícono para editar
                size={20} // Tamaño del ícono
                color="blue" // Color del ícono
                onPress={() => {
                  // Lógica de editar
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  setSelectedTeam(item.nombre);
                  // Abre el modal de confirmación
                  setModalVisible(true);
                }}
              >
                <Icon
                  name="times" // Nombre del ícono para eliminar
                  size={20} // Tamaño del ícono
                  color="red" // Color del ícono
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      {/* Modal de confirmación */}
      <Modal
  transparent={true}
  visible={isModalVisible}
  animationType="slide"
>
  <View style={styles.modalContainer}>
    <View style={styles.confirmationBox}>
      <Text>¿Estás seguro de que deseas eliminar el equipo {selectedTeam}?</Text>
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
  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
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
});

export default ProjectsScreen;
