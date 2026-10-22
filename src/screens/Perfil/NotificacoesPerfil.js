import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost/TCC/notificacoes.php';

export default function NotificacoesPerfil({ navigation }) {
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  async function carregarNotificacoes() {
    try {
      const usuarioId = await AsyncStorage.getItem('usuario_id');

      if (!usuarioId) {
        Alert.alert('Erro', 'Usuário não identificado.');
        return;
      }

      const resposta = await fetch(
        `${API_URL}?acao=listar&usuario_id=${usuarioId}`
      );

      const resultado = await resposta.json();

      if (resultado.sucesso) {
        setNotificacoes(resultado.notificacoes || []);
      } else {
        Alert.alert(
          'Erro',
          resultado.erro || 'Não foi possível carregar as notificações.'
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

  async function marcarComoLida(id) {
    try {
      const usuarioId = await AsyncStorage.getItem('usuario_id');

      await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acao: 'ler',
          usuario_id: usuarioId,
          notificacao_id: id,
        }),
      });

      setNotificacoes(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, lida: 1 }
            : item
        )
      );
    } catch (erro) {
      console.log(erro);
    }
  }

  function icone(tipo) {
    if (tipo === 'ocorrencia') return 'warning';
    if (tipo === 'seguranca') return 'security';
    if (tipo === 'sistema') return 'info-outline';

    return 'notifications-none';
  }

  function dataFormatada(data) {
    if (!data) return '';

    const partes = data.split(' ');
    const [ano,mes,dia] = partes[0].split('-');

    return `${dia}/${mes}/${ano}`;
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
              Notificações
            </Text>

            <Text style={styles.subtitle}>
              Avisos e informações do SMC
            </Text>
          </View>
        </View>

        {carregando ? (
          <View style={styles.loading}>
            <ActivityIndicator
              size="large"
              color="#152D63"
            />
          </View>
        ) : notificacoes.length === 0 ? (
          <View style={styles.empty}>
            <MaterialIcons
              name="notifications-none"
              size={46}
              color="#94A3B8"
            />

            <Text style={styles.emptyTitle}>
              Nenhuma notificação
            </Text>

            <Text style={styles.emptyText}>
              Você não possui novas notificações no momento.
            </Text>
          </View>
        ) : (
          <View style={styles.card}>
            {notificacoes.map((item,index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.notification,
                  !Number(item.lida) && styles.unread,
                  index !== notificacoes.length - 1 &&
                    styles.border,
                ]}
                onPress={() => marcarComoLida(item.id)}
              >
                <View style={styles.icon}>
                  <MaterialIcons
                    name={icone(item.tipo)}
                    size={21}
                    color="#152D63"
                  />
                </View>

                <View style={styles.notificationContent}>
                  <View style={styles.titleRow}>
                    <Text style={styles.notificationTitle}>
                      {item.titulo}
                    </Text>

                    {!Number(item.lida) && (
                      <View style={styles.dot} />
                    )}
                  </View>

                  <Text style={styles.message}>
                    {item.mensagem}
                  </Text>

                  <Text style={styles.date}>
                    {dataFormatada(item.data_criacao)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
    justifyContent: 'center',
    alignItems: 'center',
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

  loading: {
    marginTop: 80,
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E3E7EF',
    paddingHorizontal: 15,
  },

  notification: {
    flexDirection: 'row',
    paddingVertical: 16,
  },

  unread: {
    backgroundColor: '#F8FAFF',
  },

  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F4',
  },

  icon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EEF2FA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  notificationTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E5AAC',
    marginLeft: 7,
  },

  message: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginTop: 4,
  },

  date: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 6,
  },

  empty: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 35,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E3E7EF',
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginTop: 12,
  },

  emptyText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
  },
});