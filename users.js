import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const BASE_URL = 'http://10.3.163.134:3000';

export default function UsersScreen() {
  const { username } = useLocalSearchParams();
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch(`${BASE_URL}/users`)
      .then(res => res.json())
      .then(data => {
        const otherUsers = data.filter(user => user.username !== username);
        setUsers(otherUsers);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hey {username}, start a new chat 👋</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userCard}
            onPress={() =>
              router.push({
                pathname: '/chat',
                params: { username, to: item.username },
              })
            }
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.username.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.userText}>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
});
