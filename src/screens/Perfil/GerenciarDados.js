import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost/TCC/gerenciar_dados.php';

export default function GerenciarDados({ navigation }) {
  const [carregando, setCarregando] = useState(true);
  const [dados, setDados] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const usuarioId = await AsyncStorage.getItem('usuario_id');

      if (!usuarioId) {
        Alert.alert(
          'Erro',
          'Não foi possível identificar o usuário.'
        );
        return;
      }

      const resposta = await fetch(
        `${API_URL}?acao=resumo&usuario_id=${usuarioId}`
      );

      const texto = await resposta.text();

      let resultado;

      try {
        resultado = JSON.parse(texto);
      } catch (e) {
        console.log('Resposta do PHP:', texto);

        Alert.alert(
          'Erro',
          'O servidor não retornou uma resposta válida.'
        );

        return;
      }

      if (resultado.sucesso) {
        setDados(resultado.dados);
      } else {
        Alert.alert(
          'Erro',
          resultado.erro || 'Não foi possível carregar seus dados.'
        );
      }
    } catch (erro) {
      console.log('Erro:', erro);

      Alert.alert(
        'Erro',
        'Não foi possível conectar ao servidor.'
      );
    } finally {
      setCarregando(false);
    }
  }

  function visualizarDados() {
    if (!dados) return;

    Alert.alert(
      'Dados armazenados',
      `Nome: ${dados.nome || 'Não informado'}

E-mail: ${dados.email || 'Não informado'}

Telefone: ${dados.telefone || 'Não informado'}

CEP: ${dados.cep || 'Não informado'}

Bairro: ${dados.bairro || 'Não informado'}

Endereço: ${dados.endereco || 'Não informado'}`,
      [
        {
          text: 'Fechar',
          style: 'cancel',
        },
      ]
    );
  }

  function solicitarExclusao() {
    Alert.alert(
      'Excluir minha conta',
      'Ao solicitar a exclusão,os dados da sua conta serão encaminhados para exclusão. Deseja continuar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Solicitar exclusão',
          style: 'destructive',
          onPress: enviarSolicitacaoExclusao,
        },
      ]
    );
  }

  async function enviarSolicitacaoExclusao() {
    try {
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
          acao: 'solicitar_exclusao',
          usuario_id: usuarioId,
        }),
      });

      const resultado = await resposta.json();

      if (resultado.sucesso) {
        Alert.alert(
          'Solicitação enviada',
          'Sua solicitação de exclusão foi registrada com sucesso.'
        );
      } else {
        Alert.alert(
          'Erro',
          resultado.erro || 'Não foi possível enviar a solicitação.'
        );
      }
    } catch (erro) {
      console.log('Erro:', erro);

      Alert.alert(
        'Erro',
        'Não foi possível conectar ao servidor.'
      );
    }
  }

  if (carregando) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color="#152D63"
          />

          <Text style={styles.loadingText}>
            Carregando seus dados...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* CABEÇALHO */}
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
              Gerenciar meus dados
            </Text>

            <Text style={styles.subtitle}>
              Controle as informações armazenadas pelo SMC
            </Text>
          </View>
        </View>

        {/* AVISO */}
        <View style={styles.infoBox}>
          <MaterialIcons
            name="info-outline"
            size={22}
            color="#2E5AAC"
          />

          <Text style={styles.infoText}>
            Seus dados pessoais podem ser consultados e
            gerenciados por esta área. Para alterar nome,
            e-mail,telefone ou endereço,acesse Meu Perfil.
          </Text>
        </View>

        {/* DADOS PESSOAIS */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBox}>
              <MaterialIcons
                name="person-outline"
                size={22}
                color="#152D63"
              />
            </View>

            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>
                Dados pessoais
              </Text>

              <Text style={styles.cardDescription}>
                Informações da sua conta
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.action}
            onPress={visualizarDados}
          >
            <View>
              <Text style={styles.actionTitle}>
                Visualizar meus dados
              </Text>

              <Text style={styles.actionDescription}>
                Consulte as informações armazenadas
              </Text>
            </View>

            <MaterialIcons
              name="chevron-right"
              size={24}
              color="#94A3B8"
            />
          </TouchableOpacity>
        </View>

        {/* DADOS DO SISTEMA */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBox}>
              <MaterialIcons
                name="storage"
                size={22}
                color="#152D63"
              />
            </View>

            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>
                Dados utilizados pelo SMC
              </Text>

              <Text style={styles.cardDescription}>
                Informações relacionadas ao uso do aplicativo
              </Text>
            </View>
          </View>

          <View style={styles.dataRow}>
            <View style={styles.dataLeft}>
              <MaterialIcons
                name="report"
                size={21}
                color="#64748B"
              />

              <Text style={styles.dataText}>
                Ocorrências registradas
              </Text>
            </View>

            <Text style={styles.dataNumber}>
              {dados?.quantidade_ocorrencias ?? 0}
            </Text>
          </View>

          <View style={styles.dataRow}>
            <View style={styles.dataLeft}>
              <MaterialIcons
                name="videocam"
                size={21}
                color="#64748B"
              />

              <Text style={styles.dataText}>
                Câmeras cadastradas
              </Text>
            </View>

            <Text style={styles.dataNumber}>
              {dados?.quantidade_cameras ?? 0}
            </Text>
          </View>

          <View style={styles.dataRow}>
            <View style={styles.dataLeft}>
              <MaterialIcons
                name="contact-phone"
                size={21}
                color="#64748B"
              />

              <Text style={styles.dataText}>
                Contatos de emergência
              </Text>
            </View>

            <Text style={styles.dataNumber}>
              {dados?.quantidade_contatos ?? 0}
            </Text>
          </View>
        </View>

        {/* MEU PERFIL */}
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Perfil')}
        >
          <View style={styles.profileIcon}>
            <MaterialIcons
              name="manage-accounts"
              size={22}
              color="#2E5AAC"
            />
          </View>

          <View style={styles.profileText}>
            <Text style={styles.profileTitle}>
              Alterar meus dados
            </Text>

            <Text style={styles.profileDescription}>
              Nome,e-mail,telefone e endereço ficam no Meu Perfil
            </Text>
          </View>

          <MaterialIcons
            name="chevron-right"
            size={24}
            color="#94A3B8"
          />
        </TouchableOpacity>

        {/* EXCLUSÃO */}
        <View style={styles.dangerCard}>
          <View style={styles.dangerHeader}>
            <MaterialIcons
              name="delete-outline"
              size={23}
              color="#DC4C5A"
            />

            <Text style={styles.dangerTitle}>
              Excluir minha conta
            </Text>
          </View>

          <Text style={styles.dangerDescription}>
            Você pode solicitar a exclusão da sua conta e
            dos dados associados a ela.
          </Text>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={solicitarExclusao}
          >
            <Text style={styles.deleteButtonText}>
              Solicitar exclusão da conta
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          Seus dados são utilizados apenas para o funcionamento
          dos recursos disponíveis no SMC.
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

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 14,
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
    elevation: 1,
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
    alignItems: 'flex-start',
    backgroundColor: '#EEF4FF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },

  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    lineHeight: 19,
    color: '#475569',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E3E7EF',
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EEF2FA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardHeaderText: {
    flex: 1,
    marginLeft: 11,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#152D63',
  },

  cardDescription: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },

  action: {
    borderTopWidth: 1,
    borderTopColor: '#EEF0F4',
    paddingTop: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },

  actionDescription: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },

  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEF0F4',
  },

  dataLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dataText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#334155',
  },

  dataNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#152D63',
  },

  profileButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E3E7EF',
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileText: {
    flex: 1,
    marginLeft: 11,
  },

  profileTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#152D63',
  },

  profileDescription: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 17,
  },

  dangerCard: {
    backgroundColor: '#FFF7F7',
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F5D5D8',
    marginTop: 2,
  },

  dangerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dangerTitle: {
    marginLeft: 9,
    fontSize: 15,
    fontWeight: '700',
    color: '#B4232F',
  },

  dangerDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
    marginTop: 9,
  },

  deleteButton: {
    marginTop: 14,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DC4C5A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteButtonText: {
    color: '#C73543',
    fontSize: 13,
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