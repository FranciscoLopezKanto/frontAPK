import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';

const ProjectsScreen: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<{ id: string; nombre: string; descripcion: string } | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [editingProject, setEditingProject] = useState<{ id: string | null; nombre: string; descripcion: string }>({ id: null, nombre: '', descripcion: '' });
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isAddGroupModalVisible, setAddGroupModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          loadProjects(token);
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

  const loadProjects = (token: string) => {
    axios
      .get('http://localhost:3000/api/v1/proyectos/misproyectos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        console.error('Error al cargar la lista de proyectos', error);
      });
  };

  const handleDeleteProject = async (projectName: string | null) => {
    if (projectName === null) {
      return;
    }

    const projectToDelete = projects.find(project => project.nombre === projectName);

    if (projectToDelete) {
      setSelectedProject(projectToDelete);
      setDeleteModalVisible(true);
    } else {
      console.error('No se encontró el proyecto correspondiente en los datos.');
    }
  };

  const handleAddGroups = (project: { id: string; nombre: string; descripcion: string }) => {
    setAddGroupModalVisible(true);
    setSelectedProject(project);
  };

  const handleCreateProject = async () => {
    if (newProjectName !== '') {
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log(token);
        if (token !== null && typeof token === 'string') {
          const newProject = {
            name: newProjectName,
            descripcion: newProjectDescription,
          };

          const response = await axios.post('http://localhost:3000/api/v1/proyectos/crearProyecto', newProject, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log('Proyecto creado:', response.data);

          if (token !== null) {
            loadProjects(token);
          }
        } else {
          console.error('El token es nulo o no es una cadena válida');
        }
      } catch (error) {
        console.error('Error al crear el proyecto', error);
        console.log(newProjectName);
        console.log(newProjectDescription);
       
      }

      setNewProjectName('');
      setNewProjectDescription('');
      setCreateModalVisible(false);
    }
  };

  const confirmDeleteProject = async () => {
    if (!selectedProject || !selectedProject.nombre) {
      return;
    }

    const token = await AsyncStorage.getItem('userToken');

    try {
      await axios.delete(`http://localhost:3000/api/v1/projects/${selectedProject.nombre}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedProjects = projects.filter((project) => project.nombre !== selectedProject.nombre);
      setProjects(updatedProjects);
      setDeleteModalVisible(false);
    } catch (error) {
      console.error('Error al eliminar el proyecto', error);
      setDeleteModalVisible(false);
    }

    setSelectedProject(null);
  };

  const handleEditProject = (project: { id: string; nombre: string; descripcion: string }) => {
    setEditingProject(project);
    setModalVisible(true);
  };

  const handleSaveEditProject = async () => {
    if (editingProject.id && editingProject.nombre !== '') {
      const token = await AsyncStorage.getItem('userToken');

      try {
        const response = await axios.patch(
          `http://localhost:3000/api/v1/projects/editarProyecto/${editingProject.id}`,
          {
            nombre: editingProject.nombre,
            descripcion: editingProject.descripcion,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Proyecto editado:', response.data);

        if (token) {
          loadProjects(token);
        }
      } catch (error) {
        console.error('Error al editar el proyecto', error);
      }

      setEditingProject({ id: null, nombre: '', descripcion: '' });
      setModalVisible(false);
    }
  };

  const handleCancelEditProject = () => {
    setEditingProject({ id: null, nombre: '', descripcion: '' });
    setModalVisible(false);
  };

  // Resto del código...

  return (
    <View style={styles.container}>
      <Text style={styles.selectText}>Selecciona un proyecto:</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.projectItem}>
            <View style={styles.projectInfo}>
              <Text style={styles.projectName}>{item.nombre}</Text>
              <Text style={styles.projectDescription}>{item.descripcion}</Text>
            </View>
            <View style={styles.projectIcons}>
              <Icon
                name="pencil"
                size={20}
                color="blue"
                onPress={() => handleEditProject(item)}
              />
              <TouchableOpacity
                onPress={() => handleDeleteProject(item.nombre)}
              >
                <Icon name="times" size={20} color="red" />
              </TouchableOpacity>
              <Icon
                name="plus"
                size={20}
                color="green"
                onPress={() => handleAddGroups(item)}
              />
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setCreateModalVisible(true)}>
        <EntypoIcon name="plus" size={30} color="green" />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={isCreateModalVisible}
        animationType="slide"
        onRequestClose={() => {
          setCreateModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.confirmationBox}>
            <Text>Crear Nuevo Proyecto</Text>
            <Text>Nombre:</Text>
            <TextInput
              value={newProjectName}
              onChangeText={(text) => setNewProjectName(text)}
              style={styles.input}
            />
            <Text>Descripción:</Text>
            <TextInput
              value={newProjectDescription}
              onChangeText={(text) => setNewProjectDescription(text)}
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <Button title="Crear" onPress={handleCreateProject} />
              <Button title="Cancelar" onPress={() => setCreateModalVisible(false)} />
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
  projectItem: {
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
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  projectDescription: {
    fontSize: 14,
    color: 'gray',
  },
  projectIcons: {
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
