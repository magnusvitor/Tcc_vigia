import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Platform
} from 'react-native';

import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function NovoContato({ route, navigation }) {

  const contatoEmEdicao = route.params?.contatoEmEdicao || null;

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [relacao, setRelacao] = useState('Familiar');
  const [salvando, setSalvando] = useState(false);
  const [mostrarSucesso, setMostrarSucesso] = useState(false);

  useEffect(() => {
    if (contatoEmEdicao) {
      setNome(contatoEmEdicao.nome);
      setTelefone(contatoEmEdicao.telefone);
      setRelacao(contatoEmEdicao.relacao || 'Familiar');
    }
  }, [contatoEmEdicao]);

  useEffect(() => {
    if (mostrarSucesso) {
      const timer = setTimeout(() => {
        setMostrarSucesso(false);
        navigation.goBack();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [mostrarSucesso]);

  async function salvarDados() {

    if (!nome.trim() || !telefone.trim()) {
      Alert.alert(
        'Aviso',
        'Por favor, preencha os campos obrigatórios.'
      );
      return;
    }

    try {

      setSalvando(true);

      const dadosFormulario = new FormData();

      dadosFormulario.append('nome', nome);
      dadosFormulario.append('telefone', telefone);
      dadosFormulario.append('relacao', relacao);
      dadosFormulario.append('usuario_id', '1');

      if (contatoEmEdicao) {
        dadosFormulario.append(
          'id',
          contatoEmEdicao.id
        );
      }

      const response = await fetch(
        'http://localhost/TCC/salvar_contato.php',
        {
          method: 'POST',
          body: dadosFormulario,
        }
      );

      if (!response.ok) {
        throw new Error('Erro de servidor');
      }

      const resultado = await response.json();

      if (resultado.sucesso) {

        setMostrarSucesso(true);

      } else {

        Alert.alert(
          'Erro',
          'Não foi possível salvar o contato.'
        );
      }

    } catch (error) {

      console.error(error);

      Alert.alert(
        'Erro',
        'Falha de conexão com o banco de dados.'
      );

    } finally {

      setSalvando(false);

    }
  }

  // ==========================================
  // TELA DE SUCESSO
  // ==========================================

  if (mostrarSucesso) {

    return (
      <View style={styles.successContainer}>

        <View style={styles.successCard}>

          <View style={styles.successIcon}>
            <MaterialIcons
              name="check"
              size={38}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.successText}>
            Contato salvo!
          </Text>

          <Text style={styles.successSub}>
            Retornando à lista em 3s...
          </Text>

        </View>

      </View>
    );
  }

  // ==========================================
  // TELA PRINCIPAL
  // ==========================================

  return (
    <View style={styles.container}>

      {/* HEADER */}

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
          Novo contato
        </Text>

        <View style={styles.headerSpacer} />

      </View>


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >

        {/* CARD */}

        <View style={styles.formCard}>

          <Text style={styles.mainTitle}>
            Criar contato
          </Text>

          <Text style={styles.description}>
            Cadastre uma pessoa para receber seus
            alertas de emergência.
          </Text>


          {/* NOME */}

          <Text style={styles.inputLabel}>
            Nome completo
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Digite o nome"
            placeholderTextColor="#A0AEC0"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
          />


          {/* TELEFONE */}

          <Text style={styles.inputLabel}>
            Telefone
          </Text>

          <TextInput
            style={styles.input}
            placeholder="(00) 00000-0000"
            placeholderTextColor="#A0AEC0"
            keyboardType="phone-pad"
            value={telefone}
            onChangeText={setTelefone}
          />


          {/* RELAÇÃO */}

          <Text style={styles.inputLabel}>
            Relação / Vínculo
          </Text>

          <View style={styles.relationContainer}>

            {['Familiar', 'Amigo', 'Colega'].map((opcao) => {

              const ativo = relacao === opcao;

              return (
                <TouchableOpacity
                  key={opcao}
                  onPress={() => setRelacao(opcao)}
                  style={[
                    styles.relationButton,
                    ativo && styles.relationButtonActive
                  ]}
                  activeOpacity={0.8}
                >

                  <Text
                    style={[
                      styles.relationText,
                      ativo && styles.relationTextActive
                    ]}
                  >
                    {opcao}
                  </Text>

                </TouchableOpacity>
              );

            })}

          </View>


          {/* BOTÃO */}

          <TouchableOpacity
            style={[
              styles.submitButton,
              salvando && styles.submitButtonDisabled
            ]}
            onPress={salvando ? null : salvarDados}
            activeOpacity={0.85}
          >

            {salvando ? (

              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />

            ) : (

              <>

                <MaterialIcons
                  name="person-add"
                  size={20}
                  color="#FFFFFF"
                  style={styles.submitIcon}
                />

                <Text style={styles.submitButtonText}>
                  Cadastrar contato
                </Text>

              </>

            )}

          </TouchableOpacity>

        </View>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  // CONTAINER

  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },

  // HEADER

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

  // SCROLL

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 25,
    paddingBottom: 35,
  },


  // CARD

  formCard: {
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


  // TÍTULO

  mainTitle: {
    color: '#152D63',
    fontSize: 23,
    fontWeight: '800',
    textAlign: 'center',
  },

  description: {
    color: '#7A8191',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 27,
    paddingHorizontal: 5,
  },

  // INPUTS

  inputLabel: {
    color: '#26334A',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },

  input: {
    width: '100%',
    minHeight: 52,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E6ED',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#1C1C1E',
    marginBottom: 19,
  },

  // RELAÇÃO

  relationContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 7,
    marginBottom: 27,
  },

  relationButton: {
    flex: 1,
    minHeight: 47,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#E2E6ED',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  relationButtonActive: {
    backgroundColor: '#7259C1',
    borderColor: '#7259C1',
  },

  relationText: {
    color: '#718096',
    fontSize: 12.5,
    fontWeight: '600',
    textAlign: 'center',
  },

  relationTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // BOTÃO CADASTRAR

  submitButton: {
    width: '100%',
    minHeight: 54,
    backgroundColor: '#7259C1',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 3,

    elevation: 3,
    shadowColor: '#7259C1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },

  submitButtonDisabled: {
    opacity: 0.7,
  },

  submitIcon: {
    marginRight: 8,
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  // TELA DE SUCESSO

  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FC',
    paddingHorizontal: 20,
  },

  successCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 35,
    paddingHorizontal: 25,
    alignItems: 'center',

    elevation: 4,

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.07,
        shadowRadius: 10,
      },

      web: {
        boxShadow: '0px 8px 25px rgba(0,0,0,0.05)',
      },
    }),
  },

  successIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#2ECC71',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  successText: {
    color: '#152D63',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 5,
  },

  successSub: {
    color: '#8E8E93',
    fontSize: 13,
    textAlign: 'center',
  },

});