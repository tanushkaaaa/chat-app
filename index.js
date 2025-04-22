import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const BASE_URL = 'http://10.3.163.134:3000'; // replace with your IP

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!username || !password) return Alert.alert('Please fill both fields');

    const endpoint = isRegister ? 'register' : 'login';

    try {
      const res = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        Alert.alert(data.error || 'Something went wrong');
        return;
      }

      router.push({ pathname: '/users', params: { username: data.username } });
    } catch (err) {
      Alert.alert('Error connecting to server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegister ? 'Register' : 'Login'}</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title={isRegister ? 'Register' : 'Login'} onPress={handleSubmit} />
      <Text style={styles.toggle} onPress={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10,
    marginBottom: 15, borderRadius: 5,
  },
  toggle: {
    marginTop: 10,
    color: '#007BFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
