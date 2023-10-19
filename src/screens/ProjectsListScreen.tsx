import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const ProjectsList = ({ navigation }: any) => {
  const projects = [
    { id: '1', name: 'Proyecto 1' },
    { id: '2', name: 'Proyecto 2' },
    // ...otros proyectos
  ];

  const handleProjectPress = (projectId: string) => {
    // Navega a la pantalla de detalles del proyecto con los parámetros adecuados.
    navigation.navigate('ProjectDetails', { projectId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Proyectos</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleProjectPress(item.id)}>
            <Text style={styles.projectItem}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  projectItem: {
    fontSize: 18,
    marginBottom: 10,
    color: 'blue',
  },
});

export default ProjectsList;
