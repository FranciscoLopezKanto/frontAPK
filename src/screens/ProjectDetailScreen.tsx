import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProjectDetail: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { projectName } = route.params;
  const [projectDetails, setProjectDetails] = useState<{
    id: string;
    nombre: string;
    descripcion: string;
    creador: any;
    equipos: any[];
    tareas: any[];
  } | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState({
    nombre: projectDetails?.nombre || '',
    descripcion: projectDetails?.descripcion || '',
  });
  const [equipoModalVisible, setEquipoModalVisible] = useState(false);
  const [equipoAction, setEquipoAction] = useState<'add' | 'remove' | null>(null);
  const [equipoName, setEquipoName] = useState('');
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskEquipoName, setTaskEquipoName] = useState('');
  const [taskEndDate, setTaskEndDate] = useState('');
  const [reloadData, setReloadData] = useState(false);

  useEffect(() => {
    const getProjectDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const response = await axios.get(`http://localhost:3000/api/v1/proyectos/${projectName}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response.data);
          setProjectDetails(response.data);
        } else {
          console.error('No se encontró un token de usuario en AsyncStorage.');
        }
      } catch (error) {
        console.error('Error al obtener detalles del proyecto', error);
      }
    };
    
    getProjectDetails();
  }, [projectName]);

  const handleCreateTask = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        console.log(projectDetails?.nombre,taskEndDate,taskEquipoName);
        const response = await axios.post(
          'http://localhost:3000/api/v1/task/createtask',
          {
            nombre: taskName,
            descripcion: taskDescription,
            equiporesponsable: taskEquipoName,
            proyecto: projectDetails?.nombre,
            fechaTermino: taskEndDate,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        //addToast('tarea creada con éxito', { appearance: 'success' });
        setTaskModalVisible(false);
        console.log('Tarea creada con éxito', response.data);
        
      } else {
        console.error('No se encontró un token de usuario en AsyncStorage.');
      }
    } catch (error) {
      console.error('Error al crear la tarea', error);
    }
  };

  const handleEditProject = () => {
    setEditingProject({
      nombre: projectDetails?.nombre || '',
      descripcion: projectDetails?.descripcion || '',
    });
    setEditModalVisible(true);
  };

  const handleSaveEditProject = async () => {
    const token = await AsyncStorage.getItem('userToken');

    try {
      const response = await axios.patch(
        `http://localhost:3000/api/v1/proyectos/editproject/${projectDetails?.id || ''}`,
        {
          name: editingProject.nombre,
          descripcion: editingProject.descripcion,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingProject({
        nombre: projectDetails?.nombre || '',
        descripcion: projectDetails?.descripcion || '',
      });

      //addToast('Proyecto editado con éxito', { appearance: 'success' }); // no sale debido a que esta siendo probado dessde web , solo sirve por movil
      setEditModalVisible(false);
      

    } catch (error) {
      console.error('Error al editar el proyecto', error);
    }
  };

  const handleDeleteProject = async () => {
    const token = await AsyncStorage.getItem('userToken');

    try {
      await axios.delete(`http://localhost:3000/api/v1/proyectos/${projectDetails?.nombre || ''}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //addToast('Proyecto eliminado con éxito', { appearance: 'success' }); // no sale debido a que esta siendo probado dessde web , solo sirve por movil
      setDeleteModalVisible(false);
      navigation.navigate('Projects');
    } catch (error) {
      console.error('Error al eliminar el proyecto', error);
    }
  };

  const handleEquipoAction = async () => {
    const token = await AsyncStorage.getItem('userToken');
  
    try {
      if (equipoAction === 'add') {
        const response = await axios.post(
          `http://localhost:3000/api/v1/proyectos/addequipos`,
          {
            equipo: equipoName,
            projectName: projectDetails?.nombre,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        
         //addToast('Proyecto eliminado con éxito', { appearance: 'success' });
        console.log("team agregado ",equipoName)
        
        setEquipoModalVisible(false);

      } else if (equipoAction === 'remove') {
        
        const response = await axios.delete(
          `http://localhost:3000/api/v1/proyectos/removeequipo`,
          {
            data: {
              equipo: equipoName,
              projectName: projectDetails?.nombre,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
         //addToast('Proyecto eliminado con éxito', { appearance: 'success' });
        console.log("team eliminado ",equipoName)
        console.log(response.data);
        setEquipoModalVisible(false);
      }
      setEquipoModalVisible(false);
    } catch (error) {
      console.error('Error al realizar la acción de equipo', error);
    }
  };
  const handleTaskPress = (taskId: string) => {
    
    console.log(taskId);
    navigation.navigate('TaskScreen', { taskId });
  };

  return (
    <View style={styles.container}>
      {projectDetails ? (
        <>
          <Card style={styles.cardContainer}>
            <Card.Content>
              <Title style={styles.projectName}>{projectDetails.nombre}</Title>
              <Paragraph style={styles.projectDescription}>{projectDetails.descripcion}</Paragraph>
              <View style={styles.buttonContainer}>
                <Button title="Editar Proyecto" onPress={handleEditProject} />
                <Button title="Eliminar Proyecto" onPress={() => setDeleteModalVisible(true)} />
                <Button title="Agregar Equipo" onPress={() => { setEquipoAction('add'); setEquipoModalVisible(true) }} />
                <Button title="Quitar Equipo" onPress={() => { setEquipoAction('remove'); setEquipoModalVisible(true) }} />
                <Button title="Crear Tarea" onPress={() => setTaskModalVisible(true)} />
              </View>
            </Card.Content>
          </Card>
          {projectDetails?.equipos && (
            <Card style={styles.cardContainer}>
              <Card.Content>
                <Title style={styles.selectText}>Equipos</Title>
                {projectDetails.equipos.map((equipo: any) => (
                  <View key={equipo.id} style={styles.teamItem}>
                    <View style={styles.teamInfo}>
                      <Text style={styles.teamName}>{equipo.nombre}</Text>
                      <Text style={styles.teamDescription}>{equipo.descripcion}</Text>
                    </View>
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}
          {projectDetails?.tareas && (
            <Card style={styles.cardContainer}>
              <Card.Content>
                <Title style={styles.selectText}>Tareas</Title>
                {projectDetails.tareas.map((tarea: any) => (
                  <TouchableOpacity key={tarea.id} onPress={() => handleTaskPress(tarea.id)}>
                    <View style={styles.taskItem}>
                      <View style={styles.taskInfo}>
                        <Text style={styles.taskName}>{tarea.nombre}</Text>
                        <Text style={styles.taskDescription}>{tarea.descripcion}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </Card.Content>
            </Card>
          )}
          <Modal
            transparent={true}
            visible={editModalVisible}
            animationType="slide"
            onRequestClose={() => setEditModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre del proyecto"
                  value={editingProject.nombre}
                  onChangeText={(text) => setEditingProject({ ...editingProject, nombre: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Descripción del proyecto"
                  value={editingProject.descripcion}
                  onChangeText={(text) => setEditingProject({ ...editingProject, descripcion: text })}
                />
                <View style={styles.modalButtons}>
                  <Button title="Guardar" onPress={handleSaveEditProject} />
                  <Button title="Cancelar" onPress={() => setEditModalVisible(false)} />
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            transparent={true}
            visible={deleteModalVisible}
            animationType="slide"
            onRequestClose={() => setDeleteModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Button title="Confirmar Eliminación" onPress={handleDeleteProject} />
                <Button title="Cancelar" onPress={() => setDeleteModalVisible(false)} />
              </View>
            </View>
          </Modal>
          <Modal
            transparent={true}
            visible={equipoModalVisible}
            animationType="slide"
            onRequestClose={() => setEquipoModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre del equipo"
                  value={equipoName}
                  onChangeText={(text) => setEquipoName(text)}
                />
                <View style={styles.modalButtons}>
                  <Button title="Aceptar" onPress={handleEquipoAction} />
                  <Button title="Cancelar" onPress={() => setEquipoModalVisible(false)} />
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            transparent={true}
            visible={taskModalVisible}
            animationType="slide"
            onRequestClose={() => setTaskModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre de la tarea"
                  value={taskName}
                  onChangeText={(text) => setTaskName(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Descripción de la tarea"
                  value={taskDescription}
                  onChangeText={(text) => setTaskDescription(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Equipo responsable de la tarea"
                  value={taskEquipoName}
                  onChangeText={(text) => setTaskEquipoName(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Fecha de término (Formato:año-mes-dia)"
                  value={taskEndDate}
                  onChangeText={(text) => setTaskEndDate(text)}
                />
                <View style={styles.modalButtons}>
                  <Button title="Crear Tarea" onPress={handleCreateTask} />
                  <Button title="Cancelar" onPress={() => setTaskModalVisible(false)} />
                </View>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <View>
          <Paragraph>Cargando detalles del proyecto...</Paragraph>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: '80%',
    borderRadius: 10,
  },
  projectName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  projectDescription: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: 300,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
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
  taskItem: {
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
  taskInfo: {
    flex: 1,
  },
  taskName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 14,
    color: 'gray',
  },
  buttonContainer: {
    justifyContent: 'space-between', 
    marginTop:4, 
  },
});

export default ProjectDetail;
