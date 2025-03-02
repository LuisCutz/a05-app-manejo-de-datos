import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function Tab() {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [storedValue, setStoredValue] = useState('');

  // Guardar un dato
  const guardarDato = async () => {
    if (!key || !value) {
      Alert.alert('⚠️ Error', 'Por favor ingresa una clave y un valor.');
      return;
    }

    try {
      await SecureStore.setItemAsync(key, value);
      Alert.alert('✅ Éxito', `Dato guardado con clave: ${key}`);
      setValue(''); // Limpiar el campo de valor
    } catch (error) {
      console.log('Error guardando dato:', error);
      Alert.alert('❌ Error', 'No se pudo guardar el dato.');
    }
  };

  // Recuperar un dato
  const recuperarDato = async () => {
    if (!key) {
      Alert.alert('⚠️ Error', 'Por favor ingresa una clave.');
      return;
    }

    try {
      const result = await SecureStore.getItemAsync(key);
      if (result) {
        setStoredValue(result);
        Alert.alert('🔄 Recuperado', `Valor: ${result}`);
      } else {
        setStoredValue('');
        Alert.alert('ℹ️ Info', 'No se encontró ningún dato con esa clave.');
      }
    } catch (error) {
      console.log('Error recuperando dato:', error);
      Alert.alert('❌ Error', 'No se pudo recuperar el dato.');
    }
  };

  // Eliminar un dato
  const eliminarDato = async () => {
    if (!key) {
      Alert.alert('⚠️ Error', 'Por favor ingresa una clave.');
      return;
    }

    try {
      await SecureStore.deleteItemAsync(key);
      setStoredValue('');
      Alert.alert('🗑️ Eliminado', `Dato con clave ${key} eliminado.`);
    } catch (error) {
      console.log('Error eliminando dato:', error);
      Alert.alert('❌ Error', 'No se pudo eliminar el dato.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SecureStore Demo</Text>

      {/* Entrada para clave y valor */}
      <TextInput
        style={styles.input}
        placeholder="Clave"
        value={key}
        onChangeText={setKey}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor"
        value={value}
        onChangeText={setValue}
      />

      {/* Botones para acciones */}
      <TouchableOpacity style={styles.button} onPress={guardarDato}>
        <Text style={styles.buttonText}>Guardar Dato ✅</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={recuperarDato}>
        <Text style={styles.buttonText}>Recuperar Dato 🔄</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={eliminarDato}>
        <Text style={styles.buttonText}>Eliminar Dato 🗑️</Text>
      </TouchableOpacity>

      {/* Mostrar el valor recuperado */}
      {storedValue ? (
        <Text style={styles.storedText}>Valor almacenado: {storedValue}</Text>
      ) : null}
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '100%',
    borderColor: '#007BFF',
    borderWidth: 1,
    backgroundColor: 'white',
    marginBottom: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 12,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  storedText: {
    fontSize: 18,
    color: '#444',
    marginTop: 20,
    textAlign: 'center',
  },
});