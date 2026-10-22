
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  Platform,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost/TCC/criar_comunidade.php';

// Cores do SMC
const CORES = {
  fundo: '#F8F7FC',
  branco: '#FFFFFF',
  lilas: '#8971D3',
  lilasEscuro: '#7259B8',
  lilasClaro: '#F0EBFF',
  texto: '#171522',
  secundario: '#777386',
  borda: '#E7E1F4',
  verde: '#23845B',
  vermelho: '#D64545',
};

export default function CriarComunidade({ navigation }) {
  const [nome, setNome] = useState('');
  const [bairro, setBairro] = useState('');
  const [descricao, setDescricao] = useState('');
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const mostrarAlerta = (titulo, mensagem) => {
    Alert.alert(titulo, mensagem);
  };

  const escolherFoto = async () => {
    try {
      const permissao =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissao.granted) {
        mostrarAlerta(
          'Permissão necessária',
          'Permita o acesso à galeria para escolher a foto da comunidade.'
        );
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!resultado.canceled && resultado.assets?.length > 0) {
        setFoto(resultado.assets[0]);
      }
    } catch (erro) {
      console.error('Erro ao selecionar foto:', erro);
      mostrarAlerta('Erro', 'Não foi possível abrir a galeria.');
    }
  };

  const validarFormulario = () => {
    if (!nome.trim()) {
      mostrarAlerta('Campo obrigatório', 'Informe o nome da comunidade.');
      return false;
    }

    if (!bairro.trim()) {
      mostrarAlerta('Campo obrigatório', 'Informe o bairro da comunidade.');
      return false;
    }

    return true;
  };

  const salvarComunidade = async () => {
    if (!validarFormulario()) return;

    setLoading(true);

    try {
      const usuarioId = await AsyncStorage.getItem('usuario_id');

      if (!usuarioId) {
        mostrarAlerta(
          'Sessão não encontrada',
          'Entre novamente na sua conta para criar uma comunidade.'
        );
        return;
      }

      const formData = new FormData();

      formData.append('nome', nome.trim());
      formData.append('bairro', bairro.trim());
      formData.append('descricao', descricao.trim());
      formData.append('usuario_id', usuarioId);

      if (foto) {
        const uri = foto.uri;
        const nomeArquivo =
          foto.fileName ||
          uri.split('/').pop()?.split('?')[0] ||
          'foto_comunidade.jpg';

        const extensao = nomeArquivo.split('.').pop()?.toLowerCase();

        const tiposImagem = {
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          png: 'image/png',
          webp: 'image/webp',
          heic: 'image/heic',
        };

        const tipo = foto.mimeType || tiposImagem[extensao] || 'image/jpeg';

        if (Platform.OS === 'web' && foto.file) {
          formData.append('foto', foto.file, nomeArquivo);
        } else {
          formData.append('foto', {
            uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
            name: nomeArquivo,
            type: tipo,
          });
        }
      }

      const resposta = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        // Não defina Content-Type manualmente.
        // O fetch precisa gerar o boundary do multipart automaticamente.
      });

      const textoResposta = await resposta.text();
      let dados;

      try {
        dados = JSON.parse(textoResposta);
      } catch {
        console.error('Resposta recebida do PHP:', textoResposta);
        throw new Error(
          'O servidor não retornou JSON válido. Verifique o PHP e a URL da API.'
        );
      }

      if (!resposta.ok || !dados.sucesso) {
        throw new Error(
          dados.mensagem || 'Não foi possível criar a comunidade.'
        );
      }

      const mensagem = dados.mensagem || 'Comunidade criada com sucesso!';

      if (Platform.OS === 'web') {
        window.alert(mensagem);
        navigation.goBack();
      } else {
        Alert.alert('Tudo certo!', mensagem, [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (erro) {
      console.error('Erro ao criar comunidade:', erro);

      mostrarAlerta(
        'Não foi possível criar',
        erro.message ||
          'Verifique sua conexão e se o servidor PHP está funcionando.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => navigation.goBack()}
            activeOpacity={0.75}
          >
            <MaterialIcons name="arrow-back" size={23} color={CORES.texto} />
          </TouchableOpacity>

          <View style={styles.headerTexto}>
            <Text style={styles.headerTitulo}>Nova comunidade</Text>
            <Text style={styles.headerSubtitulo}>
              Conecte pessoas do seu bairro
            </Text>
          </View>

          <View style={styles.headerIcone}>
            <MaterialIcons
              name="groups"
              size={25}
              color={CORES.lilasEscuro}
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.conteudo}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.introducao}>
            <Text style={styles.tituloSecao}>Crie seu espaço</Text>
            <Text style={styles.textoIntroducao}>
              Reúna os moradores para compartilhar informações e fortalecer a
              segurança da comunidade.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.labelFoto}>Foto da comunidade</Text>

            <TouchableOpacity
              style={styles.areaFoto}
              onPress={escolherFoto}
              activeOpacity={0.8}
            >
              {foto ? (
                <View style={styles.fotoSelecionada}>
                  <Image
                    source={{ uri: foto.uri }}
                    style={styles.imagemPerfil}
                  />

                  <View style={styles.fotoInfo}>
                    <Text style={styles.fotoTitulo}>Foto selecionada</Text>
                    <Text style={styles.fotoSubtitulo}>
                      Toque para trocar a imagem
                    </Text>
                  </View>

                  <View style={styles.iconeEditar}>
                    <MaterialIcons
                      name="edit"
                      size={19}
                      color={CORES.lilasEscuro}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.areaFotoVazia}>
                  <View style={styles.iconeFoto}>
                    <MaterialIcons
                      name="add-a-photo"
                      size={27}
                      color={CORES.lilasEscuro}
                    />
                  </View>

                  <Text style={styles.fotoTitulo}>Adicionar uma foto</Text>
                  <Text style={styles.fotoSubtitulo}>
                    Escolha uma imagem da sua galeria
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.divisor} />

            <View style={styles.campoGrupo}>
              <Text style={styles.label}>
                Nome da comunidade <Text style={styles.obrigatorio}>*</Text>
              </Text>

              <View style={styles.inputContainer}>
                <MaterialIcons
                  name="groups"
                  size={21}
                  color={CORES.lilas}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Ex.: Moradores do Centro"
                  placeholderTextColor="#A19BAC"
                  value={nome}
                  onChangeText={setNome}
                  maxLength={100}
                  returnKeyType="next"
                />
              </View>
            </View>

            <View style={styles.campoGrupo}>
              <Text style={styles.label}>
                Bairro <Text style={styles.obrigatorio}>*</Text>
              </Text>

              <View style={styles.inputContainer}>
                <MaterialIcons
                  name="location-on"
                  size={21}
                  color={CORES.lilas}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Informe o bairro"
                  placeholderTextColor="#A19BAC"
                  value={bairro}
                  onChangeText={setBairro}
                  maxLength={100}
                  returnKeyType="next"
                />
              </View>
            </View>

            <View style={styles.campoGrupo}>
              <View style={styles.labelLinha}>
                <Text style={styles.label}>Descrição e regras</Text>
                <Text style={styles.opcional}>Opcional</Text>
              </View>

              <View style={[styles.inputContainer, styles.inputDescricao]}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Explique o objetivo do grupo e as regras de convivência..."
                  placeholderTextColor="#A19BAC"
                  value={descricao}
                  onChangeText={setDescricao}
                  multiline
                  textAlignVertical="top"
                  maxLength={1000}
                />
              </View>

              <Text style={styles.contador}>{descricao.length}/1000</Text>
            </View>

            <View style={styles.aviso}>
              <MaterialIcons
                name="verified-user"
                size={21}
                color={CORES.lilasEscuro}
              />
              <Text style={styles.avisoTexto}>
                Compartilhe informações com respeito e evite publicar dados
                pessoais de outros moradores.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.botaoSalvar,
                loading && styles.botaoDesabilitado,
              ]}
              onPress={salvarComunidade}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={styles.botaoSalvarTexto}>Criando...</Text>
                </>
              ) : (
                <>
                  <MaterialIcons
                    name="add-circle-outline"
                    size={22}
                    color="#FFFFFF"
                  />
                  <Text style={styles.botaoSalvarTexto}>
                    Criar comunidade
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.rodape}>
              Os campos marcados com * são obrigatórios.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF9FD',
  },

  // Cabeçalho simples
  header: {
    minHeight: 68,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDF5',
  },
  botaoVoltar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F0FC',
  },
  headerTexto: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitulo: {
    color: '#171522',
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitulo: {
    marginTop: 3,
    color: '#898494',
    fontSize: 12,
  },
  headerIcone: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0EAFE',
  },

  // Conteúdo
  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 32,
  },
  introducao: {
    marginBottom: 23,
  },
  tituloSecao: {
    color: '#171522',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  textoIntroducao: {
    marginTop: 7,
    color: '#777281',
    fontSize: 14,
    lineHeight: 21,
  },

  // Sem sombra pesada ou bordas exageradas
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EFECF5',
  },

  labelFoto: {
    color: '#24212D',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  areaFoto: {
    minHeight: 130,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D9CEEF',
    borderRadius: 14,
    backgroundColor: '#FBFAFE',
    overflow: 'hidden',
  },
  areaFotoVazia: {
    minHeight: 130,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
  },
  iconeFoto: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#F0EAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  fotoTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#24212D',
  },
  fotoSubtitulo: {
    fontSize: 12,
    color: '#898494',
    marginTop: 5,
    textAlign: 'center',
  },
  fotoSelecionada: {
    minHeight: 130,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  imagemPerfil: {
    width: 68,
    height: 68,
    borderRadius: 16,
    backgroundColor: '#F0EAFE',
  },
  fotoInfo: {
    flex: 1,
    marginLeft: 12,
  },
  iconeEditar: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#F0EAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  divisor: {
    height: 1,
    backgroundColor: '#F0EDF5',
    marginVertical: 22,
  },
  campoGrupo: {
    marginBottom: 19,
  },
  label: {
    color: '#24212D',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  obrigatorio: {
    color: '#8971D3',
  },
  labelLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  opcional: {
    color: '#918B9C',
    fontSize: 11,
    marginBottom: 8,
  },

  // Campos mais leves
  inputContainer: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAE6F1',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 12,
    paddingLeft: 10,
    fontSize: 14,
    color: '#171522',
  },
  inputDescricao: {
    alignItems: 'stretch',
    paddingHorizontal: 13,
    paddingVertical: 12,
    minHeight: 112,
  },
  textArea: {
    flex: 1,
    minHeight: 88,
    fontSize: 14,
    lineHeight: 20,
    color: '#171522',
    padding: 0,
  },
  contador: {
    textAlign: 'right',
    color: '#918B9C',
    fontSize: 11,
    marginTop: 6,
  },

  // Aviso discreto
  aviso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F7F4FD',
    marginBottom: 20,
  },
  avisoTexto: {
    flex: 1,
    marginLeft: 9,
    color: '#625B70',
    fontSize: 12,
    lineHeight: 18,
  },

  // Botão principal
  botaoSalvar: {
    minHeight: 51,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8971D3',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoSalvarTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  rodape: {
    color: '#918B9C',
    textAlign: 'center',
    fontSize: 11,
    marginTop: 13,
  },
});
