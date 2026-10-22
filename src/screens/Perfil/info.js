import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

export default function Informacoes() {

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.titleCenter}>Informações pessoais</Text>
      <Text style={styles.subtitle}>Atualize seus dados</Text>

      {/* FOTO */}
      <View style={styles.photoArea}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
          style={styles.bigAvatar}
        />

        <TouchableOpacity style={styles.photoBtn}>
          <Ionicons name="camera" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* FORM */}
      <View style={styles.form}>

        <TextInput placeholder="Nome completo" style={styles.input} />
        <TextInput placeholder="Email" style={styles.input} />
        <TextInput placeholder="Telefone" style={styles.input} />
        <TextInput placeholder="Endereço" style={styles.input} />
        <TextInput placeholder="CEP" style={styles.input} />

      </View>

      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveText}>Salvar alterações</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}