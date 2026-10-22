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

const API_URL = 'http://localhost/TCC/atividade_conta.php';

export default function AtividadeConta({ navigation }) {
  const [atividades, setAtividades] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarAtividades();
  }, []);

  async function carregarAtividades() {
    try {
      const usuarioId = await AsyncStorage.getItem('usuario_id');

      if (!usuarioId) {
        Alert.alert('Erro', 'Usuário não identificado.');
        return;
      }

      const resposta = await fetch(
        `${API_URL}?usuario_id=${usuarioId}`
      );

      const resultado = await resposta.json();

      if (resultado.sucesso) {
        setAtividades(resultado.atividades || []);
      } else {
        Alert.alert(
          'Erro',
          resultado.erro || 'Não foi possível carregar a atividade.'
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

  function icone(tipo) {
    if (tipo === 'Segurança') return 'lock-outline';
    if (tipo === 'Ocorrência') return 'report';
    if (tipo === 'Conta') return 'person-outline';

    return 'history';
  }

  function formatarData(data) {
    if (!data) return '';

    const partes = data.split(' ');
    const dataParte = partes[0];

    if (!dataParte) return data;

    const [ano, mes, dia] = dataParte.split('-');

    return `${dia}/${mes}/${ano}${partes[1] ? ` às ${partes[1].slice(0, 5)}` : ''}`;
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
              Atividade da conta
            </Text>

            <Text style={styles.subtitle}>
              Histórico das ações realizadas na conta
            </Text>
          </View>
        </View>

        {carregando ? (
          <View style={styles.loading}>
            <ActivityIndicator
              size="large"
              color="#152D63"
            />

            <Text style={styles.loadingText}>
              Carregando atividade...
            </Text>
          </View>
        ) : atividades.length === 0 ? (
          <View style={styles.empty}>
            <MaterialIcons
              name="history"
              size={44}
              color="#94A3B8"
            />

            <Text style={styles.emptyTitle}>
              Nenhuma atividade registrada
            </Text>

            <Text style={styles.emptyText}>
              As ações realizadas na sua conta aparecerão aqui.
            </Text>
          </View>
        ) : (
          <View style={styles.card}>
            {atividades.map((item,index) => (
              <View
                key={item.id}
                style={[
                  styles.item,
                  index !== atividades.length - 1 &&
                    styles.itemBorder,
                ]}
              >
                <View style={styles.icon}>
                  <MaterialIcons
                    name={icone(item.tipo)}
                    size={21}
                    color="#152D63"
                  />
                </View>

                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>
                    {item.descricao}
                  </Text>

                  <Text style={styles.itemType}>
                    {item.tipo}
                  </Text>

                  <Text style={styles.date}>
                    {formatarData(item.data_atividade)}
                  </Text>
                </View>
              </View>
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
    alignItems: 'center',
    marginTop: 80,
  },

  loadingText: {
    marginTop: 10,
    color: '#64748B',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E3E7EF',
    paddingHorizontal: 15,
  },

  item: {
    flexDirection: 'row',
    paddingVertical: 16,
  },

  itemBorder: {
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

  itemContent: {
    flex: 1,
    marginLeft: 12,
  },

  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },

  itemType: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },

  date: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 5,
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
    lineHeight: 19,
  },
});