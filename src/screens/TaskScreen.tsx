import React, { useEffect, useState } from 'react';
import { View, Text, Button, Modal, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
const backendUrl = process.env.REACT_APP_BACKEND_URL; //no se esta usando por bug que no se pudo resolver


const TaskScreen: React.FC = () => {
  const route = useRoute();
  const taskId = (route.params as any)?.taskId;

  const [taskDetails, setTaskDetails] = useState<any>(null);
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [isStatusModalVisible, setStatusModalVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`http://localhost:3000/api/v1/task/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const formattedStartDate = new Date(response.data.fechaInicio).toLocaleDateString();
        const formattedDetails = {
          ...response.data,
          fechaInicio: formattedStartDate,
        };
        setTaskDetails(formattedDetails);
        console.log('Detalles de la tarea:', formattedDetails);
      } catch (error) {
        console.error('Error al obtener detalles de la tarea', error);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const agregarComentario = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(
        'http://localhost:3000/api/v1/com/crearComentario',
        {
          Tarea: taskDetails.nombre,
          Comentario: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCommentModalVisible(false);
      recargarDetalles();
    } catch (error) {
      console.error('Error al agregar comentario', error);
    }
  };

  const cambiarEstado = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.patch(
        `http://localhost:3000/api/v1/task/${taskId}`,
        {
          estado: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStatusModalVisible(false);
      recargarDetalles();
    } catch (error) {
      console.error('Error al cambiar estado de la tarea', error);
    }
  };

  const eliminarTarea = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.delete(`http://localhost:3000/api/v1/task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      navigation.navigate('Home' as never);

    } catch (error) {
      console.error('Error al eliminar la tarea', error);
    }
  };

  const recargarDetalles = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`http://localhost:3000/api/v1/task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const formattedStartDate = new Date(response.data.fechaInicio).toLocaleDateString();
      const formattedDetails = {
        ...response.data,
        fechaInicio: formattedStartDate,
      };
      setTaskDetails(formattedDetails);
      console.log('Detalles de la tarea después de recargar:', formattedDetails);
    } catch (error) {
      console.error('Error al recargar detalles de la tarea', error);
    }
  };

  return (
    <View>
      {taskDetails ? (
        <>
          <Text>Nombre: {taskDetails.nombre}</Text>
          <Text>Descripción: {taskDetails.descripcion}</Text>
          <Text>Estado: {taskDetails.estado}</Text>
          <Text>Fecha de Inicio: {taskDetails.fechaInicio}</Text>
          <Text>Fecha de Término: {new Date(taskDetails.fechaTermino).toLocaleDateString()}</Text>
          <View style={styles.commentsSection}>
            <Text style={styles.commentsHeader}>Comentarios:</Text>
            {taskDetails.comentarios.map((comentario: any) => (
              <View key={comentario.id} style={styles.commentContainer}>
                <Text style={styles.commentText}>{comentario.comentario}</Text>
              </View>
            ))}
          </View>
          <View style={styles.actionButtons}>
            <Button title="Agregar Comentario" onPress={() => setCommentModalVisible(true)} />
            <Button title="Cambiar Estado" onPress={() => setStatusModalVisible(true)} />
            <Button title="Eliminar" onPress={eliminarTarea} />
          </View>
          <Modal visible={isCommentModalVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TextInput
                  placeholder="Nuevo Comentario"
                  onChangeText={(text) => setNewComment(text)}
                  style={styles.commentInput}
                />
                <Button title="Agregar Comentario" onPress={agregarComentario} />
                <Button title="Cancelar" onPress={() => setCommentModalVisible(false)} />
              </View>
            </View>
          </Modal>
          <Modal visible={isStatusModalVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Cambiar Estado</Text>
                <TouchableOpacity
                  style={styles.statusButton}
                  onPress={() => setNewStatus('Pendiente')}
                >
                  <Text style={styles.statusButtonText}>Pendiente</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.statusButton}
                  onPress={() => setNewStatus('En curso')}
                >
                  <Text style={styles.statusButtonText}>En curso</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.statusButton}
                  onPress={() => setNewStatus('Terminado')}
                >
                  <Text style={styles.statusButtonText}>Terminado</Text>
                </TouchableOpacity>
                <Button title="Cambiar Estado" onPress={cambiarEstado} />
                <Button title="Cancelar" onPress={() => setStatusModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <Text>Cargando detalles de la tarea...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
  commentsSection: {
    marginTop: 20,
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingVertical: 10,
  },
  commentText: {
    fontSize: 16,
  },
  commentInput: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  statusButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default TaskScreen;
