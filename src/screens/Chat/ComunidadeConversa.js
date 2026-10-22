
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Image,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import EmojiPicker from 'rn-emoji-keyboard';

const API = 'http://localhost/TCC/';

const API_LISTAR = `${API}listar_mensagens.php`;
const API_ENVIAR = `${API}enviar_mensagem.php`;
const API_ARQUIVO = `${API}enviar_arquivo.php`;
const API_VERIFICAR = `${API}verificar_participacao_comunidade.php`;

export default function ComunidadeConversa({ route, navigation }) {
  const params = route?.params || {};

  const comunidadeOriginal = params.comunidade || {};

  const comunidadeId = Number(
    comunidadeOriginal.id ??
    comunidadeOriginal.comunidade_id ??
    params.comunidadeId ??
    params.comunidade_id ??
    0
  );

  const nomeComunidade =
    comunidadeOriginal.nome ||
    params.nomeComunidade ||
    params.comunidade_nome ||
    'Comunidade';

  const bairro =
    comunidadeOriginal.bairro ||
    params.bairro ||
    '';

  const [usuarioId, setUsuarioId] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');

  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mostrarEmojis, setMostrarEmojis] = useState(false);

  const [acessoPermitido, setAcessoPermitido] = useState(false);
  const [erroAcesso, setErroAcesso] = useState('');

  const listaRef = useRef(null);
  const ultimoIdRef = useRef(0);
  const verificacaoRef = useRef(false);

  useEffect(() => {
    navigation.setOptions({
      title: nomeComunidade,
      headerStyle: {
        backgroundColor: '#152D63',
      },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: {
        fontWeight: '700',
      },
    });
  }, [navigation, nomeComunidade]);

  // Verifica se o usuário está aprovado antes de abrir a conversa.
  useEffect(() => {
    let ativo = true;

    async function verificarAcesso() {
      try {
        setCarregando(true);
        setErroAcesso('');
        setAcessoPermitido(false);

        const idSalvo = await AsyncStorage.getItem('usuario_id');
        const idUsuario = Number(idSalvo);

        if (!idUsuario || !comunidadeId) {
          throw new Error(
            'Não foi possível identificar o usuário ou a comunidade.'
          );
        }

        const resposta = await fetch(
          `${API_VERIFICAR}?usuario_id=${encodeURIComponent(
            idUsuario
          )}&comunidade_id=${encodeURIComponent(comunidadeId)}`
        );

        const dados = await resposta.json();

        if (!resposta.ok || dados.sucesso === false) {
          throw new Error(
            dados.mensagem || 'Não foi possível verificar sua participação.'
          );
        }

        const aprovado =
          dados.participa === true ||
          dados.participa === 1 ||
          dados.status === 'aprovado';

        if (!aprovado) {
          const mensagem =
            dados.mensagem ||
            (dados.status === 'pendente'
              ? 'Sua solicitação ainda está aguardando aprovação.'
              : 'Você precisa ter sua entrada aprovada para acessar esta conversa.');

          if (ativo && !verificacaoRef.current) {
            verificacaoRef.current = true;
            Alert.alert('Acesso não permitido', mensagem, [
              {
                text: 'Voltar',
                onPress: () => navigation.goBack(),
              },
            ]);
          }

          return;
        }

        if (ativo) {
          setUsuarioId(idUsuario);
          setAcessoPermitido(true);
        }
      } catch (erro) {
        if (ativo) {
          setErroAcesso(
            erro.message ||
              'Não foi possível verificar sua participação na comunidade.'
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    verificarAcesso();

    return () => {
      ativo = false;
    };
  }, [comunidadeId, navigation]);

  // Busca as mensagens e atualiza a conversa.
  const carregarMensagens = useCallback(
    async (inicial = false) => {
      if (!usuarioId || !comunidadeId || !acessoPermitido) {
        return;
      }

      try {
        const depoisId = inicial ? 0 : ultimoIdRef.current;

        const resposta = await fetch(
          `${API_LISTAR}?usuario_id=${encodeURIComponent(
            usuarioId
          )}&comunidade_id=${encodeURIComponent(
            comunidadeId
          )}&depois_id=${encodeURIComponent(depoisId)}`
        );

        const dados = await resposta.json();

        if (!resposta.ok || dados.sucesso === false) {
          throw new Error(
            dados.mensagem || 'Não foi possível carregar as mensagens.'
          );
        }

        const recebidas = Array.isArray(dados)
          ? dados
          : Array.isArray(dados.mensagens)
            ? dados.mensagens
            : [];

        if (inicial) {
          setMensagens(recebidas);

          if (recebidas.length > 0) {
            const maiorId = Math.max(
              ...recebidas.map((item) => Number(item.id) || 0)
            );

            ultimoIdRef.current = maiorId;
          } else {
            ultimoIdRef.current = 0;
          }

          setTimeout(() => {
            listaRef.current?.scrollToEnd({ animated: false });
          }, 150);
        } else if (recebidas.length > 0) {
          setMensagens((anteriores) => {
            const idsExistentes = new Set(
              anteriores.map((item) => String(item.id))
            );

            const novas = recebidas.filter(
              (item) => !idsExistentes.has(String(item.id))
            );

            if (novas.length === 0) {
              return anteriores;
            }

            const maiorId = Math.max(
              ...novas.map((item) => Number(item.id) || 0)
            );

            ultimoIdRef.current = Math.max(
              ultimoIdRef.current,
              maiorId
            );

            return [...anteriores, ...novas];
          });
        }
      } catch (erro) {
        console.error('Erro ao carregar mensagens:', erro.message);
      }
    },
    [usuarioId, comunidadeId, acessoPermitido]
  );

  useEffect(() => {
    if (!acessoPermitido || !usuarioId) {
      return;
    }

    carregarMensagens(true);

    const intervalo = setInterval(() => {
      carregarMensagens(false);
    }, 4000);

    return () => clearInterval(intervalo);
  }, [acessoPermitido, usuarioId, carregarMensagens]);

  // Envia mensagens de texto.
  const enviarTexto = async () => {
    const mensagem = texto.trim();

    if (!mensagem || enviando) {
      return;
    }

    if (!acessoPermitido || !usuarioId || !comunidadeId) {
      Alert.alert(
        'Acesso não permitido',
        'Você precisa ter sua entrada aprovada para enviar mensagens.'
      );
      return;
    }

    try {
      setEnviando(true);

      const resposta = await fetch(API_ENVIAR, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: usuarioId,
          comunidade_id: comunidadeId,
          mensagem,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok || dados.sucesso === false) {
        throw new Error(
          dados.mensagem || 'Não foi possível enviar a mensagem.'
        );
      }

      setTexto('');
      await carregarMensagens(true);
      setTimeout(() => {
        listaRef.current?.scrollToEnd({ animated: true });
      }, 150);
    } catch (erro) {
      Alert.alert(
        'Erro ao enviar',
        erro.message || 'Tente novamente.'
      );
    } finally {
      setEnviando(false);
    }
  };

  // Envia uma imagem ou documento.
  const enviarArquivo = async (arquivo, tipo) => {
    if (!arquivo?.uri) {
      return;
    }

    if (!acessoPermitido || !usuarioId || !comunidadeId) {
      Alert.alert(
        'Acesso não permitido',
        'Você precisa ter sua entrada aprovada para enviar arquivos.'
      );
      return;
    }

    try {
      setEnviando(true);

      const formulario = new FormData();

      formulario.append('usuario_id', String(usuarioId));
      formulario.append('comunidade_id', String(comunidadeId));
      formulario.append('tipo', tipo);

      formulario.append('arquivo', {
        uri: arquivo.uri,
        name:
          arquivo.name ||
          arquivo.fileName ||
          `arquivo_${Date.now()}`,
        type:
          arquivo.mimeType ||
          arquivo.type ||
          (tipo === 'imagem'
            ? 'image/jpeg'
            : 'application/octet-stream'),
      });

      const resposta = await fetch(API_ARQUIVO, {
        method: 'POST',
        body: formulario,
      });

      const dados = await resposta.json();

      if (!resposta.ok || dados.sucesso === false) {
        throw new Error(
          dados.mensagem || 'Não foi possível enviar o arquivo.'
        );
      }

      await carregarMensagens(true);

      setTimeout(() => {
        listaRef.current?.scrollToEnd({ animated: true });
      }, 150);
    } catch (erro) {
      Alert.alert(
        'Erro ao enviar arquivo',
        erro.message || 'Tente novamente.'
      );
    } finally {
      setEnviando(false);
    }
  };

  // Seleciona uma imagem da galeria.
  const escolherImagem = async () => {
    try {
      const resultado =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: false,
          quality: 0.8,
        });

      if (resultado.canceled || !resultado.assets?.length) {
        return;
      }

      await enviarArquivo(resultado.assets[0], 'imagem');
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível abrir a galeria.');
    }
  };

  // Seleciona um documento.
  const escolherDocumento = async () => {
    try {
      const resultado =
        await DocumentPicker.getDocumentAsync({
          copyToCacheDirectory: true,
          multiple: false,
        });

      if (resultado.canceled || !resultado.assets?.length) {
        return;
      }

      await enviarArquivo(resultado.assets[0], 'arquivo');
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível selecionar o arquivo.');
    }
  };

  const abrirArquivo = async (url) => {
    if (!url) {
      return;
    }

    const endereco = /^https?:\/\//i.test(url)
      ? url
      : `${API}${String(url).replace(/^\/+/, '')}`;

    try {
      await Linking.openURL(endereco);
    } catch {
      Alert.alert('Erro', 'Não foi possível abrir esse arquivo.');
    }
  };

  const obterNome = (item) =>
    item.usuario_nome ||
    item.nome_usuario ||
    item.nome ||
    'Morador';

  const obterMensagem = (item) =>
    item.mensagem ||
    item.texto ||
    item.conteudo ||
    '';

  const obterArquivoUrl = (item) =>
    item.arquivo_url ||
    item.url_arquivo ||
    item.caminho_arquivo ||
    item.arquivo ||
    '';

  const obterTipo = (item) =>
    String(item.tipo || item.tipo_mensagem || '').toLowerCase();

  const ehMinhaMensagem = (item) =>
    Number(item.usuario_id) === Number(usuarioId);

  const renderMensagem = ({ item }) => {
    const minha = ehMinhaMensagem(item);
    const conteudo = obterMensagem(item);
    const urlArquivo = obterArquivoUrl(item);
    const tipo = obterTipo(item);

    const ehImagem =
      tipo.includes('imagem') ||
      tipo.includes('image') ||
      tipo.includes('foto');

    const ehAudio =
      tipo.includes('audio') ||
      tipo.includes('áudio') ||
      tipo.includes('voz');

    const horario =
      item.enviado_em ||
      item.data_envio ||
      item.criado_em ||
      item.data ||
      '';

    return (
      <View
        style={[
          styles.linhaMensagem,
          minha ? styles.linhaMinha : styles.linhaOutra,
        ]}
      >
        <View
          style={[
            styles.balao,
            minha ? styles.balaoMeu : styles.balaoOutro,
          ]}
        >
          {!minha && (
            <Text style={styles.nomeRemetente}>
              {obterNome(item)}
            </Text>
          )}

          {!!conteudo && (
            <Text
              style={[
                styles.textoMensagem,
                minha && styles.textoMensagemMeu,
              ]}
            >
              {conteudo}
            </Text>
          )}

          {!!urlArquivo && (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => abrirArquivo(urlArquivo)}
              style={styles.arquivoContainer}
            >
              {ehImagem ? (
                <View style={styles.imagemArquivo}>
                  <MaterialIcons
                    name="image"
                    size={28}
                    color="#7259B8"
                  />
                  <Text style={styles.textoArquivo}>
                    Abrir imagem
                  </Text>
                </View>
              ) : (
                <View style={styles.arquivoLinha}>
                  <MaterialIcons
                    name={ehAudio ? 'play-circle-filled' : 'insert-drive-file'}
                    size={30}
                    color={minha ? '#FFFFFF' : '#7259B8'}
                  />

                  <View style={styles.arquivoInfo}>
                    <Text
                      style={[
                        styles.textoArquivo,
                        minha && styles.textoMensagemMeu,
                      ]}
                    >
                      {ehAudio
                        ? 'Áudio'
                        : item.nome_arquivo || 'Abrir arquivo'}
                    </Text>

                    <Text
                      style={[
                        styles.subtextoArquivo,
                        minha && styles.subtextoMeu,
                      ]}
                    >
                      Toque para abrir
                    </Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          )}

          {!!horario && (
            <Text
              style={[
                styles.horario,
                minha && styles.horarioMeu,
              ]}
            >
              {String(horario).length > 16
                ? String(horario).slice(11, 16)
                : String(horario)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#7259B8" />
        <Text style={styles.textoCarregando}>
          Verificando sua participação...
        </Text>
      </View>
    );
  }

  if (!acessoPermitido) {
    return (
      <View style={styles.centro}>
        <MaterialIcons
          name="lock"
          size={48}
          color="#7259B8"
        />

        <Text style={styles.tituloBloqueio}>
          Conversa indisponível
        </Text>

        <Text style={styles.descricaoBloqueio}>
          {erroAcesso ||
            'Você precisa ter sua entrada aprovada para acessar esta comunidade.'}
        </Text>

        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoBotaoVoltar}>
            Voltar às comunidades
          </Text>
        </TouchableOpacity>

        {!!erroAcesso && (
          <TouchableOpacity
            style={styles.botaoTentarNovamente}
            onPress={() => {
              verificacaoRef.current = false;
              navigation.replace('ComunidadeConversa', {
                ...params,
              });
            }}
          >
            <Text style={styles.textoTentarNovamente}>
              Tentar novamente
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.cabecalhoComunidade}>
        <View style={styles.iconeComunidade}>
          <MaterialIcons
            name="groups"
            size={26}
            color="#7259B8"
          />
        </View>

        <View style={styles.infoComunidade}>
          <Text style={styles.nomeComunidade}>
            {nomeComunidade}
          </Text>

          <Text style={styles.bairroComunidade}>
            {bairro || 'Comunidade colaborativa'}
          </Text>
        </View>

        <View style={styles.statusOnline}>
          <View style={styles.pontoOnline} />
          <Text style={styles.textoOnline}>Comunidade</Text>
        </View>
      </View>

      <FlatList
        ref={listaRef}
        data={mensagens}
        keyExtractor={(item, index) =>
          String(item.id ?? item.mensagem_id ?? index)
        }
        renderItem={renderMensagem}
        contentContainerStyle={styles.listaMensagens}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() =>
          listaRef.current?.scrollToEnd({ animated: true })
        }
        ListEmptyComponent={
          <View style={styles.listaVazia}>
            <MaterialIcons
              name="forum"
              size={46}
              color="#B7ACD8"
            />

            <Text style={styles.listaVaziaTitulo}>
              Comece a conversa!
            </Text>

            <Text style={styles.listaVaziaTexto}>
              Compartilhe informações e converse com os moradores
              desta comunidade.
            </Text>
          </View>
        }
      />

      {enviando && (
        <View style={styles.avisoEnvio}>
          <ActivityIndicator size="small" color="#7259B8" />
          <Text style={styles.textoAvisoEnvio}>
            Enviando...
          </Text>
        </View>
      )}

      <View style={styles.compositor}>
        <TouchableOpacity
          style={styles.botaoFerramenta}
          onPress={() => setMostrarEmojis(true)}
          accessibilityLabel="Abrir emojis"
        >
          <MaterialIcons
            name="emoji-emotions"
            size={27}
            color="#7259B8"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoFerramenta}
          onPress={escolherImagem}
          disabled={enviando}
          accessibilityLabel="Enviar imagem"
        >
          <MaterialIcons
            name="image"
            size={25}
            color="#7259B8"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoFerramenta}
          onPress={escolherDocumento}
          disabled={enviando}
          accessibilityLabel="Anexar arquivo"
        >
          <MaterialIcons
            name="attach-file"
            size={25}
            color="#7259B8"
          />
        </TouchableOpacity>

        <TextInput
          style={styles.campoMensagem}
          value={texto}
          onChangeText={setTexto}
          placeholder="Digite uma mensagem..."
          placeholderTextColor="#9696A3"
          multiline
          maxLength={3000}
          editable={!enviando}
          onSubmitEditing={Platform.OS === 'web' ? enviarTexto : undefined}
        />

        <TouchableOpacity
          style={[
            styles.botaoEnviar,
            (!texto.trim() || enviando) && styles.botaoEnviarDesativado,
          ]}
          onPress={enviarTexto}
          disabled={!texto.trim() || enviando}
          accessibilityLabel="Enviar mensagem"
        >
          {enviando ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <MaterialIcons
              name="send"
              size={22}
              color="#FFFFFF"
            />
          )}
        </TouchableOpacity>
      </View>

      <EmojiPicker
        open={mostrarEmojis}
        onClose={() => setMostrarEmojis(false)}
        onEmojiSelected={(emoji) => {
          setTexto((atual) => atual + emoji.emoji);
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5FA',
  },

  centro: {
    flex: 1,
    backgroundColor: '#F7F8FC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },

  textoCarregando: {
    marginTop: 12,
    color: '#626477',
    fontSize: 14,
  },

  tituloBloqueio: {
    fontSize: 20,
    fontWeight: '700',
    color: '#152D63',
    marginTop: 14,
    textAlign: 'center',
  },

  descricaoBloqueio: {
    fontSize: 14,
    lineHeight: 21,
    color: '#68697A',
    textAlign: 'center',
    marginTop: 8,
  },

  botaoVoltar: {
    marginTop: 22,
    backgroundColor: '#7259B8',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },

  textoBotaoVoltar: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  botaoTentarNovamente: {
    padding: 12,
    marginTop: 5,
  },

  textoTentarNovamente: {
    color: '#7259B8',
    fontWeight: '600',
  },

  cabecalhoComunidade: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E7F0',
  },

  iconeComunidade: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#EEE9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoComunidade: {
    flex: 1,
    marginLeft: 11,
  },

  nomeComunidade: {
    fontSize: 15,
    fontWeight: '700',
    color: '#152D63',
  },

  bairroComunidade: {
    fontSize: 12,
    color: '#858599',
    marginTop: 3,
  },

  statusOnline: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },

  pontoOnline: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B79C9',
    marginBottom: 4,
  },

  textoOnline: {
    fontSize: 10,
    color: '#858599',
  },

  listaMensagens: {
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 18,
    flexGrow: 1,
  },

  linhaMensagem: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 10,
  },

  linhaMinha: {
    justifyContent: 'flex-end',
  },

  linhaOutra: {
    justifyContent: 'flex-start',
  },

  balao: {
    maxWidth: '84%',
    minWidth: 75,
    paddingHorizontal: 12,
    paddingTop: 9,
    paddingBottom: 6,
    borderRadius: 16,
  },

  balaoMeu: {
    backgroundColor: '#7259B8',
    borderBottomRightRadius: 5,
  },

  balaoOutro: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#ECEAF3',
  },

  nomeRemetente: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7259B8',
    marginBottom: 5,
  },

  textoMensagem: {
    fontSize: 15,
    color: '#28283A',
    lineHeight: 21,
  },

  textoMensagemMeu: {
    color: '#FFFFFF',
  },

  horario: {
    fontSize: 10,
    color: '#9998A8',
    textAlign: 'right',
    marginTop: 4,
  },

  horarioMeu: {
    color: '#E5DDFB',
  },

  arquivoContainer: {
    marginTop: 6,
    minWidth: 150,
  },

  imagemArquivo: {
    backgroundColor: '#F0ECF9',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  arquivoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 5,
  },

  arquivoInfo: {
    flexShrink: 1,
  },

  textoArquivo: {
    color: '#7259B8',
    fontSize: 13,
    fontWeight: '600',
  },

  subtextoArquivo: {
    color: '#858599',
    fontSize: 11,
    marginTop: 3,
  },

  subtextoMeu: {
    color: '#E5DDFB',
  },

  listaVazia: {
    flex: 1,
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  listaVaziaTitulo: {
    fontSize: 17,
    fontWeight: '700',
    color: '#152D63',
    marginTop: 12,
  },

  listaVaziaTexto: {
    fontSize: 13,
    lineHeight: 20,
    color: '#858599',
    textAlign: 'center',
    marginTop: 7,
  },

  avisoEnvio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },

  textoAvisoEnvio: {
    fontSize: 12,
    color: '#7259B8',
  },

  compositor: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 9,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E6EF',
    gap: 4,
  },

  botaoFerramenta: {
    width: 34,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

  campoMensagem: {
    flex: 1,
    minHeight: 42,
    maxHeight: 110,
    backgroundColor: '#F3F2F8',
    borderRadius: 22,
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 11 : 9,
    paddingBottom: 9,
    fontSize: 14,
    color: '#28283A',
    borderWidth: 1,
    borderColor: '#EAE7F2',
  },

  botaoEnviar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#7259B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 3,
  },

  botaoEnviarDesativado: {
    backgroundColor: '#B8AED7',
  },
});
