import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('tasks.db');

export default function Tab() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tareas, setTareas] = useState([]);

  // Inicializar la base de datos
  useEffect(() => {
    db.execAsync('CREATE TABLE IF NOT EXISTS tareas (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT, descripcion TEXT);')
      .then(() => cargarTareas())
      .catch(error => console.log('Error creando tabla:', error));
  }, []);

  // Insertar una nueva tarea
  const insertarTarea = () => {
    if (!titulo || !descripcion) {
      Alert.alert('⚠️ Error', 'Por favor ingresa título y descripción.');
      return;
    }

    db.runAsync('INSERT INTO tareas (titulo, descripcion) VALUES (?, ?)', [titulo, descripcion])
      .then(() => {
        setTitulo('');
        setDescripcion('');
        cargarTareas();
        Alert.alert('✅ Éxito', 'Tarea agregada correctamente.');
      })
      .catch(error => console.log('Error insertando tarea:', error));
  };

  // Eliminar una tarea
  const eliminarTarea = (id) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            db.runAsync('DELETE FROM tareas WHERE id = ?', [id])
              .then(() => {
                cargarTareas();
                Alert.alert('✅ Éxito', 'Tarea eliminada correctamente.');
              })
              .catch(error => console.log('Error eliminando tarea:', error));
          },
        },
      ]
    );
  };

  // Cargar las tareas
  const cargarTareas = () => {
    db.getAllAsync('SELECT * FROM tareas')
      .then(rows => setTareas(rows))
      .catch(error => console.log('Error cargando tareas:', error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Tareas con SQLite</Text>

      {/* Formulario para agregar */}
      <TextInput
        style={styles.input}
        placeholder="Título de la tarea"
        value={titulo}
        onChangeText={setTitulo}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción de la tarea"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={insertarTarea}>
        <Text style={styles.buttonText}>Agregar Tarea</Text>
      </TouchableOpacity>

      {/* Lista de tareas */}
      <Text style={styles.subtitle}>Tareas Registradas:</Text>
      <FlatList
        data={tareas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>📌 {item.titulo}</Text>
              <Text style={styles.taskDescription}>{item.descripcion}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => eliminarTarea(item.id)}
            >
              <Text style={styles.deleteButtonText}>🗑️ Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay tareas registradas.</Text>}
      />
    </View>
  );
}

// Estilos mejorados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#007BFF',
    borderWidth: 1,
    backgroundColor: 'white',
    marginBottom: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  taskItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskContent: {
    flex: 1,
    marginRight: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  taskDescription: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});