
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
const backendUrl = process.env.REACT_APP_BACKEND_URL; //no se esta usando por bug que no se pudo resolver

interface Project {
  id: string;
  nombre: string;
  descripcion: string;
}

const ProjectsScreen: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const navigation = useNavigation<any>();

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

  const loadProjects = async (token: string) => {
    try {
      const response = await axios.get<Project[]>('http://localhost:3000/api/v1/proyectos/misproyectos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjects(response.data);
    } catch (error) {
      console.error('Error al cargar la lista de proyectos', error);
    }
  };

  const handleCreateProject = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token !== null && typeof token === 'string') {
        const newProject = {
          name: newProjectName,
          descripcion: newProjectDescription,
        };
        console.log(newProject);
        const response = await axios.post<Project>('http://localhost:3000/api/v1/proyectos/crearProyecto', newProject, {
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

      setNewProjectName('');
      setNewProjectDescription('');
      setCreateModalVisible(false);
    } catch (error) {
      console.error('Error al crear el proyecto', error);
    }
  };

  const handleProjectDetails = (projectName: string) => {
    console.log('proyecto', projectName);
    navigation.navigate('ProjectDetail', { projectName } as { projectName: string });

  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.selectText}>Selecciona un proyecto:</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProjectItem project={item} handleProjectDetails={handleProjectDetails} />
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setCreateModalVisible(true)}>
        <Text>Agregar Proyecto</Text>
      </TouchableOpacity>

      {/* Modal para crear proyectos */}
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

interface ProjectItemProps {
  project: Project;
  handleProjectDetails: (projectName: string) => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, handleProjectDetails }) => (
  <TouchableOpacity onPress={() => handleProjectDetails(project.nombre)}>
    <View style={styles.projectItem}>
      <View style={styles.projectInfo}>
        <Text style={styles.projectName}>{project.nombre}</Text>
        <Text style={styles.projectDescription}>{project.descripcion}</Text>
      </View>
    </View>
  </TouchableOpacity>
);


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
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
});

export default ProjectsScreen;
