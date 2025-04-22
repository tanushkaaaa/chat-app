import React, { useState, useEffect } from 'react';
import {
  View, TextInput, Button, FlatList, Text, StyleSheet,
  TouchableOpacity, Dimensions, Modal, Pressable
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const BASE_URL = 'http://10.3.163.134:3000';

const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
const [selectedEmoji, setSelectedEmoji] = useState('');
const emojis = ['😀', '😎', '😂', '❤️', '👍', '🎉', '🙏', '😢', '🔥', '💯'];


export default function ChatScreen() {
  const { username } = useLocalSearchParams();
  const [users, setUsers] = useState([]);
  const [to, setTo] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
const [selectedEmoji, setSelectedEmoji] = useState('');
const emojis = ['😀', '😎', '😂', '❤️', '👍', '🎉', '🙏', '😢', '🔥', '💯'];

  // Fetch all users
  useEffect(() => {
    fetch(`${BASE_URL}/users`)
      .then(res => res.json())
      .then(data => {
        const otherUsers = data.filter(u => u.username !== username);
        setUsers(otherUsers);
      });
  }, []);

  // Fetch messages when recipient changes
  useEffect(() => {
    if (!to) return;

    fetch(`${BASE_URL}/messages?username=${username}&to=${to}`)
      .then(res => res.json())
      .then(setMessages)
      .catch(console.error);
  }, [to]);

  const sendMessage = () => {
    if (input.trim() === '') return;

    const message = { text: input, username, to };
    fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    })
      .then(res => res.json())
      .then(msg => {
        setMessages(prev => [...prev, msg]);
        setInput('');
      });
  };

  return (
    <View style={styles.container}>
      {/* Left Side User List */}
      <View style={styles.sidebar}>
        <Text style={styles.sidebarTitle}>Chats</Text>
        <FlatList
          data={users}
          keyExtractor={(item) => item.username}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.userCard} onPress={() => setTo(item.username)}>
              <Text style={styles.userText}>{item.username}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Right Side Chat */}
      <View style={styles.chatWindow}>
        {to ? (
          <>
            <Text style={styles.chatHeader}>Chatting with {to}</Text>
            <FlatList
              data={messages}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={[styles.messageBubble, item.username === username ? styles.self : styles.other]}>
                  <Text style={styles.sender}>{item.username}</Text>
                  <Text>{item.text}</Text>
                  <Text style={styles.timestamp}>{item.timestamp}</Text>
                </View>
              )}
            />
            <View style={styles.inputContainer}>
  <TouchableOpacity onPress={() => setEmojiPickerVisible(true)} style={styles.emojiButton}>
    <Text style={{ fontSize: 24 }}>😊</Text>
  </TouchableOpacity>

  <TextInput
    value={input}
    onChangeText={setInput}
    placeholder="Type a message"
    style={styles.input}
  />
  <Button title="Send" onPress={sendMessage} />
</View>

          </>
        ) : (
          <Text style={styles.placeholder}>Select a user to start chatting</Text>
        )}
      </View>
      <Modal visible={emojiPickerVisible} transparent animationType="slide">
  <Pressable style={styles.modalOverlay} onPress={() => setEmojiPickerVisible(false)}>
    <View style={styles.emojiPicker}>
      {emojis.map((emoji, index) => (
        <TouchableOpacity
          key={index}
          style={styles.emojiOption}
          onPress={() => {
            setInput(prev => prev + emoji);
            setEmojiPickerVisible(false);
          }}
        >
          <Text style={{ fontSize: 24 }}>{emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </Pressable>
</Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  sidebar: {
    width: 120,
    backgroundColor: '#e5e7eb',
    padding: 10,
  },
  sidebarTitle: { fontWeight: 'bold', marginBottom: 10 },
  userCard: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 5,
    borderRadius: 5,
  },
  userText: { fontSize: 14 },

  chatWindow: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9fafb',
  },
  chatHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    maxWidth: '80%',
  },
  self: {
    backgroundColor: '#d1e7dd',
    alignSelf: 'flex-end',
  },
  other: {
    backgroundColor: '#f3f4f6',
    alignSelf: 'flex-start',
  },
  sender: { fontWeight: 'bold' },
  timestamp: { fontSize: 10, color: 'gray', marginTop: 3 },

  inputContainer: { flexDirection: 'row', marginTop: 10 },
  input: {
    flex: 1,
    borderWidth: 1, borderColor: '#ccc',
    borderRadius: 5,
    padding: 8, marginRight: 5,
  },
  placeholder: {
    fontStyle: 'italic',
    color: 'gray',
    textAlign: 'center',
    marginTop: 50,
  },
  emojiButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  
  emojiPicker: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  
  emojiOption: {
    margin: 10,
  },
  
});
