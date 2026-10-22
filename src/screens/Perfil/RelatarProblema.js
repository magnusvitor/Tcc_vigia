import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost/TCC/relatar_problema.php';

export default function RelatarProblema({ navigation }) {
  const [assunto, setAssunto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviarRelato() {
    if (!assunto.trim()) {
      Alert.alert('Atenção', 'Informe o assunto do problema.');
      return;
    }

    if (!descricao.trim()) {
      Alert.alert('Atenção', 'Descreva o problema.');
      return;
    }

    try {
      setEnviando(true);

      const usuarioId = await AsyncStorage.getItem('usuario_id');

      if (!usuarioId) {
        Alert.alert('Erro', 'Usuário não identificado.');
        return;
      }

      const resposta = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: usuarioId,
          assunto: assunto.trim(),
          descricao: descricao.trim(),
        }),
      });

      const resultado = await resposta.json();

      if (resultado.sucesso) {
        setAssunto('');
        setDescricao('');

        Alert.alert(
          'Relato enviado',
          'Seu problema foi registrado. A equipe poderá analisar o relato.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert(
          'Erro',
          resultado.erro || 'Não foi possível enviar o relato.'
        );
      }
    } catch (erro) {
      console.log(erro);

      Alert.alert(
        'Erro',
        'Não foi possível conectar ao servidor.'
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color="#152D63"
            />
          </TouchableOpacity>

          <View>
            <Text style={styles.title}>
              Relatar problema
            </Text>

            <Text style={styles.subtitle}>
              Conte o que aconteceu
            </Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <MaterialIcons
            name="support-agent"
            size={22}
            color="#2E5AAC"
          />

          <Text style={styles.infoText}>
            Use este espaço para informar erros,dificuldades
            ou problemas encontrados no aplicativo.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>
            Assunto
          </Text>

          <TextInput
            style={styles.input}
            value={assunto}
            onChangeText={setAssunto}
            placeholder="Ex.: Problema ao registrar ocorrência"
            placeholderTextColor="#94A3B8"
            maxLength={150}
          />

          <Text style={styles.label}>
            Descrição
          </Text>

          <TextInput
            style={styles.textarea}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva o problema encontrado..."
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
            maxLength={2000}
          />

          <Text style={styles.counter}>
            {descricao.length}/2000
          </Text>

          <TouchableOpacity
            style={[
              styles.button,
              enviando && styles.disabled,
            ]}
            onPress={enviarRelato}
            disabled={enviando}
          >
            {enviando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <MaterialIcons
                  name="send"
                  size={19}
                  color="#FFFFFF"
                />

                <Text style={styles.buttonText}>
                  Enviar relato
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          O relato será associado à sua conta para facilitar o atendimento.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },

  content: {
    padding: 20,
    paddingBottom: 35,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#152D63',
  },

  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },

  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EEF4FF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },

  infoText: {
    flex: 1,
    marginLeft: 10,
    color: '#475569',
    fontSize: 13,
    lineHeight: 19,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 17,
    borderWidth: 1,
    borderColor: '#E3E7EF',
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 7,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D9DEE8',
    borderRadius: 10,
    paddingHorizontal: 13,
    color: '#1E293B',
    fontSize: 14,
    marginBottom: 17,
  },

  textarea: {
    height: 150,
    borderWidth: 1,
    borderColor: '#D9DEE8',
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingTop: 12,
    color: '#1E293B',
    fontSize: 14,
  },

  counter: {
    textAlign: 'right',
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 5,
    marginBottom: 15,
  },

  button: {
    height: 47,
    backgroundColor: '#152D63',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  disabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  footer: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 18,
  },
});