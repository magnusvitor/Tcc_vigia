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

const API_URL = 'http://localhost/TCC/alterar_senha.php';

export default function AlterarSenha({ navigation }) {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarAtual, setMostrarAtual] = useState(false);
  const [mostrarNova, setMostrarNova] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function alterarSenha() {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert(
        'Atenção',
        'A nova senha deve ter pelo menos 6 caracteres.'
      );
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert(
        'Atenção',
        'A confirmação da senha não confere.'
      );
      return;
    }

    try {
      setCarregando(true);

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
          senha_atual: senhaAtual,
          nova_senha: novaSenha,
        }),
      });

      const resultado = await resposta.json();

      if (resultado.sucesso) {
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmarSenha('');

        Alert.alert(
          'Senha alterada',
          'Sua senha foi alterada com sucesso.'
        );
      } else {
        Alert.alert(
          'Erro',
          resultado.erro || 'Não foi possível alterar a senha.'
        );
      }
    } catch (erro) {
      console.log(erro);

      Alert.alert(
        'Erro',
        'Não foi possível conectar ao servidor.'
      );
    } finally {
      setCarregando(false);
    }
  }

  function CampoSenha({
    titulo,
    valor,
    setValor,
    mostrar,
    setMostrar,
  }) {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>{titulo}</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={valor}
            onChangeText={setValor}
            secureTextEntry={!mostrar}
            placeholder="Digite sua senha"
            placeholderTextColor="#94A3B8"
          />

          <TouchableOpacity
            onPress={() => setMostrar(!mostrar)}
          >
            <MaterialIcons
              name={mostrar ? 'visibility-off' : 'visibility'}
              size={21}
              color="#64748B"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
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
            <Text style={styles.title}>Alterar senha</Text>
            <Text style={styles.subtitle}>
              Atualize a senha da sua conta
            </Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <MaterialIcons
            name="lock-outline"
            size={22}
            color="#2E5AAC"
          />

          <Text style={styles.infoText}>
            Para alterar sua senha,confirme sua senha atual
            e cadastre uma nova senha.
          </Text>
        </View>

        <View style={styles.card}>
          <CampoSenha
            titulo="Senha atual"
            valor={senhaAtual}
            setValor={setSenhaAtual}
            mostrar={mostrarAtual}
            setMostrar={setMostrarAtual}
          />

          <CampoSenha
            titulo="Nova senha"
            valor={novaSenha}
            setValor={setNovaSenha}
            mostrar={mostrarNova}
            setMostrar={setMostrarNova}
          />

          <CampoSenha
            titulo="Confirmar nova senha"
            valor={confirmarSenha}
            setValor={setConfirmarSenha}
            mostrar={mostrarConfirmar}
            setMostrar={setMostrarConfirmar}
          />

          <Text style={styles.tip}>
            A senha deve possuir pelo menos 6 caracteres.
          </Text>

          <TouchableOpacity
            style={[
              styles.button,
              carregando && styles.buttonDisabled,
            ]}
            onPress={alterarSenha}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                Alterar senha
              </Text>
            )}
          </TouchableOpacity>
        </View>
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

  field: {
    marginBottom: 17,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 7,
  },

  inputContainer: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D9DEE8',
    borderRadius: 10,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
  },

  tip: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 17,
  },

  button: {
    height: 47,
    backgroundColor: '#152D63',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});