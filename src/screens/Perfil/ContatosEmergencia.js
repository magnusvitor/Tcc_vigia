import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';

import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function ContatosEmergencia({ navigation }) {

  const [contatos, setContatos] = useState([]);

  const carregarContatos = async () => {
    try {
      const response = await fetch(
        'http://localhost/TCC/listar_contatos.php?usuario_id=1'
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar contatos');
      }

      const dados = await response.json();

      if (Array.isArray(dados)) {
        setContatos(dados);
      } else if (dados.contatos && Array.isArray(dados.contatos)) {
        setContatos(dados.contatos);
      } else {
        setContatos([]);
      }

    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
      setContatos([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarContatos();
    }, [])
  );

  const excluirContato = (id) => {

    Alert.alert(
      'Excluir contato',
      'Tem certeza que deseja excluir este contato?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {

            try {

              const response = await fetch(
                'http://localhost/TCC/excluir_contato.php',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    id: id,
                  }),
                }
              );

              const resultado = await response.json();

              if (resultado.sucesso) {
                carregarContatos();
              } else {
                Alert.alert(
                  'Erro',
                  'Não foi possível excluir o contato.'
                );
              }

            } catch (error) {

              console.error(error);

              Alert.alert(
                'Erro',
                'Falha de conexão com o banco de dados.'
              );

            }

          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>

      {/* Cabeçalho */}
      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#152D63"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Contatos de emergência
        </Text>

        <View style={styles.headerSpacer} />

      </View>

      {/* Conteúdo */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.mainCard}>

          <Text style={styles.cardHeaderTitle}>
            Contatos de emergência
          </Text>

          <Text style={styles.cardDescription}>
            Pessoas que serão notificadas quando você
            acionar um alerta de emergência.
          </Text>

          {contatos.length === 0 ? (

            <View style={styles.emptyContainer}>

              <View style={styles.emptyIcon}>
                <MaterialIcons
                  name="person-outline"
                  size={38}
                  color="#7259C1"
                />
              </View>

              <Text style={styles.emptyText}>
                Nenhum contato cadastrado.
              </Text>

              <Text style={styles.emptySubText}>
                Adicione um contato para receber seus alertas.
              </Text>

            </View>

          ) : (

            contatos.map((contato) => (

              <View
                key={String(contato.id)}
                style={styles.contactRow}
              >

                <View style={styles.contactInfo}>

                  <Text
                    style={styles.contactName}
                    numberOfLines={1}
                  >
                    {contato.nome}
                  </Text>

                  <Text style={styles.contactDetails}>
                    {contato.telefone}
                  </Text>

                  <Text style={styles.contactSub}>
                    {contato.relacao || 'Familiar'}
                  </Text>

                </View>

                <View style={styles.actionContainer}>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      navigation.navigate('NovoContato', {
                        contatoEmEdicao: contato,
                      })
                    }
                    activeOpacity={0.7}
                  >
                    <MaterialIcons
                      name="edit"
                      size={20}
                      color="#745CD4"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => excluirContato(contato.id)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons
                      name="delete-outline"
                      size={21}
                      color="#EF4444"
                    />
                  </TouchableOpacity>

                </View>

              </View>

            ))

          )}

        </View>

      </ScrollView>

      {/* Botão inferior */}
      <View style={styles.bottomBar}>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('NovoContato')}
          activeOpacity={0.85}
        >

          <MaterialIcons
            name="add"
            size={21}
            color="#FFFFFF"
            style={styles.addIcon}
          />

          <Text style={styles.buttonText}>
            Adicionar contato
          </Text>

        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },

  /* HEADER */

  header: {
    minHeight: 62,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9EBF1',
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F3F8',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#152D63',
    fontSize: 16,
    fontWeight: '800',
    marginHorizontal: 10,
  },

  headerSpacer: {
    width: 38,
  },

  /* SCROLL */

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 25,
    paddingBottom: 115,
  },

  /* CARD PRINCIPAL */

  mainCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,

    ...Platform.select({

      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },

      android: {
        elevation: 3,
      },

      web: {
        boxShadow: '0px 8px 25px rgba(0,0,0,0.05)',
      },

    }),
  },

  cardHeaderTitle: {
    color: '#152D63',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 7,
  },

  cardDescription: {
    color: '#7A8191',
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },

  /* CONTATOS */

  contactRow: {
    width: '100%',
    minHeight: 75,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F5',
    paddingVertical: 13,
  },

  contactInfo: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },

  contactName: {
    color: '#1C1C1E',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },

  contactDetails: {
    color: '#64748B',
    fontSize: 13,
    marginBottom: 3,
  },

  contactSub: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500',
  },

  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },

  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },

  /* ESTADO VAZIO */

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 10,
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1EEFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },

  emptyText: {
    color: '#4A4F5C',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 10,
  },

  emptySubText: {
    color: '#8E8E93',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 18,
  },

  /* BOTÃO INFERIOR */

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F8F9FC',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 25 : 16,
  },

  primaryButton: {
    width: '100%',
    minHeight: 54,
    backgroundColor: '#7259C1',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,

    elevation: 3,

    shadowColor: '#7259C1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },

  addIcon: {
    marginRight: 7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

});