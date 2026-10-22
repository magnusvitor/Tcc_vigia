import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function CustomHeader() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      
      {/* menu */}
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={28} color="#6C5CE7" />
      </TouchableOpacity>

      {/* textos */}
      <View style={styles.textBox}>
        <Text style={styles.title}>Minhas câmeras</Text>
        <Text style={styles.subtitle}>
          Gerencie as suas câmeras para segurança
        </Text>
      </View>

      {/* avatar */}
      <Image
        source={{ uri: 'https://i.pravatar.cc/100' }}
        style={styles.avatar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
  },
  textBox: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});