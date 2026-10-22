
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const API = 'http://localhost/TCC/listar_comunidades.php';
const API_SOLICITAR = 'http://localhost/TCC/solicitar_entrada_comunidade.php';

export default function BuscarComunidades() {
  const navigation = useNavigation();

  const [bairros, setBairros] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [solicitandoId, setSolicitandoId] = useState(null);

  const [aviso, setAviso] = useState({
    visivel: false,
    mensagem: '',
    tipo: 'sucesso',
  });

  const normalizar = (texto) =>
    String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  const mostrarAviso = (mensagem, tipo = 'sucesso') => {
    setAviso({
      visivel: true,
      mensagem,
      tipo,
    });
  };

  const carregarBairros = useCallback(async (atualizar = false) => {
    try {
      if (atualizar) {
        setAtualizando(true);
      } else {
        setCarregando(true);
      }

      const usuarioId = await AsyncStorage.getItem('usuario_id');

      if (!usuarioId) {
        mostrarAviso('Sua sessão expirou. Entre na sua conta novamente.', 'erro');
        return;
      }

      const resposta = await fetch(
        `${API}?usuario_id=${encodeURIComponent(usuarioId)}`
      );

      const dados = await resposta.json();

      if (!resposta.ok || !dados.sucesso) {
        throw new Error(dados.mensagem || 'Não foi possível carregar as comunidades.');
      }

      const lista = Array.isArray(dados.comunidades)
        ? dados.comunidades
        : [];

      lista.sort((a, b) =>
        String(a.bairro || a.nome || '').localeCompare(
          String(b.bairro || b.nome || ''),
          'pt-BR'
        )
      );

      setBairros(lista);
    } catch (erro) {
      console.error('Erro ao carregar comunidades:', erro);
      mostrarAviso(
        erro.message || 'Não foi possível carregar as comunidades.',
        'erro'
      );
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarBairros();
    }, [carregarBairros])
  );

  const abrirChat = (comunidadeId, nomeComunidade) => {
    navigation.navigate('ComunidadeConversa', {
      comunidadeId,
      nomeComunidade,
      comunidade: {
        id: comunidadeId,
        nome: nomeComunidade,
      },
    });
  };

  const enviarSolicitacao = async (item, comunidadeId) => {
    if (solicitandoId !== null) return;

    try {
      setSolicitandoId(comunidadeId);

      const usuarioId = Number(
        await AsyncStorage.getItem('usuario_id')
      );

      if (!usuarioId || !comunidadeId) {
        throw new Error('Não foi possível identificar o usuário ou a comunidade.');
      }

      console.log('Enviando solicitação:', {
        usuario_id: usuarioId,
        comunidade_id: comunidadeId,
      });

      const resposta = await fetch(API_SOLICITAR, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: usuarioId,
          comunidade_id: Number(comunidadeId),
        }),
      });

      const texto = await resposta.text();
      console.log('Resposta do PHP:', resposta.status, texto);

      let dados;

      try {
        dados = JSON.parse(texto);
      } catch {
        throw new Error(
          'O servidor não retornou uma resposta válida. Verifique o PHP.'
        );
      }

      if (!resposta.ok || !dados.sucesso) {
        throw new Error(
          dados.mensagem || 'Não foi possível solicitar entrada.'
        );
      }

      // Atualiza a listagem com o status que veio do banco.
      await carregarBairros(true);

      if (dados.status === 'aprovado') {
        mostrarAviso(
          dados.mensagem || 'Você foi aprovado! Entrando na comunidade.'
        );

        abrirChat(
          comunidadeId,
          item.comunidade_nome || item.nome || item.bairro || 'Comunidade'
        );

        return;
      }

      if (dados.status === 'pendente') {
        mostrarAviso(
          dados.mensagem || 'Solicitação enviada. Aguarde a aprovação.'
        );
        return;
      }

      mostrarAviso(dados.mensagem || 'Solicitação processada.');
    } catch (erro) {
      console.error('Erro ao solicitar entrada:', erro);

      mostrarAviso(
        erro.message || 'Não foi possível enviar a solicitação.',
        'erro'
      );
    } finally {
      setSolicitandoId(null);
    }
  };

  const abrirOuSolicitarEntrada = (item) => {
    const comunidadeId = Number(item.comunidade_id ?? item.id);
    const status = normalizar(item.status_usuario);

    const nomeComunidade =
      item.comunidade_nome || item.nome || item.bairro || 'Comunidade';

    const disponivel =
      item.disponivel === true ||
      item.disponivel === 1 ||
      item.disponivel === '1';

    if (!comunidadeId || !disponivel) {
      mostrarAviso(
        'Esta comunidade ainda não está cadastrada corretamente.',
        'erro'
      );
      return;
    }

    if (status === 'aprovado') {
      abrirChat(comunidadeId, nomeComunidade);
      return;
    }

    if (status === 'pendente') {
      mostrarAviso('Sua solicitação está aguardando aprovação.');
      return;
    }

    enviarSolicitacao(item, comunidadeId);
  };

  const filtrados = bairros.filter((item) => {
    const termo = normalizar(busca);

    return (
      normalizar(item.bairro).includes(termo) ||
      normalizar(item.nome).includes(termo)
    );
  });

  const renderItem = ({ item }) => {
    const nome = item.bairro || item.nome || 'Bairro';
    const participantes = Number(item.participantes || 0);

    const comunidadeId = Number(item.comunidade_id ?? item.id);
    const status = normalizar(item.status_usuario);

    const disponivel =
      item.disponivel === true ||
      item.disponivel === 1 ||
      item.disponivel === '1';

    const participando =
      status === 'aprovado' ||
      item.participando === true ||
      item.participando === 1 ||
      item.participando === '1';

    const pendente =
      status === 'pendente' ||
      item.solicitacao_pendente === true ||
      item.solicitacao_pendente === 1 ||
      item.solicitacao_pendente === '1';

    const solicitando = solicitandoId === comunidadeId;

    let textoBotao = 'Solicitar entrada';
    let iconeBotao = 'person-add-alt-1';
    let estiloBotao = styles.botaoSolicitar;

    if (!disponivel) {
      textoBotao = 'Indisponível';
      iconeBotao = 'lock-outline';
      estiloBotao = styles.botaoIndisponivel;
    } else if (participando) {
      textoBotao = 'Entrar';
      iconeBotao = 'forum';
      estiloBotao = styles.botaoEntrar;
    } else if (pendente) {
      textoBotao = 'Pendente';
      iconeBotao = 'schedule';
      estiloBotao = styles.botaoPendente;
    }

    return (
      <View style={styles.card}>
        <View style={styles.iconeBairro}>
          <MaterialIcons
            name="location-city"
            size={25}
            color="#8065B5"
          />
        </View>

        <View style={styles.informacoes}>
          <Text style={styles.nomeBairro} numberOfLines={2}>
            {nome}
          </Text>

          <View style={styles.linhaParticipantes}>
            <MaterialIcons
              name="people-outline"
              size={15}
              color="#9B8DB8"
            />

            <Text style={styles.textoParticipantes}>
              {participantes}{' '}
              {participantes === 1 ? 'integrante' : 'integrantes'}
            </Text>
          </View>

          {item.es_meu_bairro === true && (
            <View style={styles.etiquetaMeuBairro}>
              <MaterialIcons
                name="check-circle"
                size={12}
                color="#7960A9"
              />
              <Text style={styles.textoMeuBairro}>Seu bairro</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.botaoAcao, estiloBotao]}
          onPress={() => abrirOuSolicitarEntrada(item)}
          disabled={
            solicitando ||
            !disponivel ||
            (pendente && !participando)
          }
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`${textoBotao}: ${nome}`}
        >
          {solicitando ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <MaterialIcons
                name={iconeBotao}
                size={15}
                color={
                  pendente || !disponivel
                    ? '#857A98'
                    : '#FFFFFF'
                }
              />
              <Text
                style={[
                  styles.textoBotao,
                  (pendente || !disponivel) &&
                    styles.textoBotaoNeutro,
                ]}
              >
                {textoBotao}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (carregando) {
    return (
      <View style={styles.carregando}>
        <View style={styles.iconeCarregamento}>
          <MaterialIcons
            name="location-city"
            size={30}
            color="#8065B5"
          />
        </View>

        <ActivityIndicator size="large" color="#8065B5" />

        <Text style={styles.textoCarregando}>
          Carregando comunidades...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Voltar"
        >
          <MaterialIcons
            name="arrow-back"
            size={22}
            color="#382D4C"
          />
        </TouchableOpacity>

        <View style={styles.titulos}>
          <Text style={styles.titulo}>Comunidades</Text>
          <Text style={styles.subtitulo}>
            Conecte-se com o seu bairro
          </Text>
        </View>

        <View style={styles.iconeCabecalho}>
          <MaterialIcons
            name="forum"
            size={22}
            color="#8065B5"
          />
        </View>
      </View>

      <View style={styles.destaque}>
        <View style={styles.destaqueIcone}>
          <MaterialIcons
            name="diversity-3"
            size={27}
            color="#FFFFFF"
          />
        </View>

        <View style={styles.destaqueTexto}>
          <Text style={styles.destaqueTitulo}>
            Sua comunidade, mais perto
          </Text>
          <Text style={styles.destaqueDescricao}>
            Compartilhe informações e fortaleça a segurança local.
          </Text>
        </View>
      </View>

      {aviso.visivel && (
        <View
          style={[
            styles.aviso,
            aviso.tipo === 'erro'
              ? styles.avisoErro
              : styles.avisoSucesso,
          ]}
        >
          <MaterialIcons
            name={
              aviso.tipo === 'erro'
                ? 'error-outline'
                : 'check-circle-outline'
            }
            size={21}
            color={aviso.tipo === 'erro' ? '#AD5555' : '#6E579D'}
          />

          <Text style={styles.avisoMensagem}>
            {aviso.mensagem}
          </Text>

          <TouchableOpacity
            onPress={() =>
              setAviso((atual) => ({
                ...atual,
                visivel: false,
              }))
            }
            accessibilityLabel="Fechar aviso"
          >
            <MaterialIcons
              name="close"
              size={19}
              color="#847A92"
            />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.buscaContainer}>
        <MaterialIcons
          name="search"
          size={21}
          color="#9383B1"
        />

        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar bairro..."
          placeholderTextColor="#A59BB5"
          value={busca}
          onChangeText={setBusca}
          autoCapitalize="words"
          underlineColorAndroid="transparent"
        />

        {busca.length > 0 && (
          <TouchableOpacity
            onPress={() => setBusca('')}
            accessibilityLabel="Limpar busca"
          >
            <MaterialIcons
              name="close"
              size={19}
              color="#9383B1"
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cabecalhoLista}>
        <Text style={styles.tituloLista}>
          Explore os bairros
        </Text>

        <View style={styles.contador}>
          <Text style={styles.textoContador}>
            {filtrados.length}
          </Text>
        </View>
      </View>

      <FlatList
        data={filtrados}
        keyExtractor={(item) =>
          `bairro-${item.bairro_id ?? item.comunidade_id ?? item.id}`
        }
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={() => carregarBairros(true)}
            tintColor="#8065B5"
            colors={['#8065B5']}
          />
        }
        ListEmptyComponent={
          <View style={styles.vazio}>
            <View style={styles.vazioIcone}>
              <MaterialIcons
                name="location-off"
                size={34}
                color="#A493C8"
              />
            </View>

            <Text style={styles.vazioTitulo}>
              Nenhum bairro encontrado
            </Text>

            <Text style={styles.vazioTexto}>
              Tente pesquisar por outro nome.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FA',
  },

  carregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F3FA',
  },

  iconeCarregamento: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: '#EAE3F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  textoCarregando: {
    marginTop: 12,
    color: '#81758F',
    fontSize: 13,
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 19,
    paddingTop: 20,
    paddingBottom: 17,
    gap: 12,
  },

  botaoVoltar: {
    width: 41,
    height: 41,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE6F4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  titulos: {
    flex: 1,
  },

  titulo: {
    fontSize: 22,
    fontWeight: '800',
    color: '#382D4C',
    letterSpacing: -0.5,
  },

  subtitulo: {
    fontSize: 12,
    color: '#91859F',
    marginTop: 4,
  },

  iconeCabecalho: {
    width: 41,
    height: 41,
    borderRadius: 14,
    backgroundColor: '#EAE3F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  destaque: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 17,
    marginBottom: 16,
    padding: 15,
    borderRadius: 19,
    backgroundColor: '#E9E1F5',
    borderWidth: 1,
    borderColor: '#E1D6F0',
    gap: 12,
  },

  destaqueIcone: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#8065B5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  destaqueTexto: {
    flex: 1,
  },

  destaqueTitulo: {
    color: '#45365D',
    fontSize: 14,
    fontWeight: '800',
  },

  destaqueDescricao: {
    color: '#786B8A',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },

  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginHorizontal: 17,
    marginBottom: 13,
    padding: 12,
    borderRadius: 13,
    borderWidth: 1,
  },

  avisoSucesso: {
    backgroundColor: '#F0EBF8',
    borderColor: '#DDD1EF',
  },

  avisoErro: {
    backgroundColor: '#FFF0EF',
    borderColor: '#F1D5D2',
  },

  avisoMensagem: {
    flex: 1,
    color: '#594C6A',
    fontSize: 12,
    lineHeight: 17,
  },

  buscaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 47,
    marginHorizontal: 17,
    paddingHorizontal: 13,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E9E3F1',
    gap: 9,
  },

  inputBusca: {
    flex: 1,
    height: '100%',
    color: '#382D4C',
    fontSize: 13,
    outlineStyle: 'none',
  },

  cabecalhoLista: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 21,
    paddingBottom: 12,
    gap: 9,
  },

  tituloLista: {
    fontSize: 14,
    fontWeight: '800',
    color: '#443654',
  },

  contador: {
    minWidth: 23,
    height: 23,
    paddingHorizontal: 6,
    borderRadius: 8,
    backgroundColor: '#E7DDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoContador: {
    fontSize: 11,
    fontWeight: '800',
    color: '#74599F',
  },

  lista: {
    paddingHorizontal: 17,
    paddingBottom: 30,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 13,
    marginBottom: 10,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#EDE7F4',
    gap: 11,
    shadowColor: '#6C578A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.045,
    shadowRadius: 7,
    elevation: 2,
  },

  iconeBairro: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: '#F0EBF8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  informacoes: {
    flex: 1,
    gap: 5,
  },

  nomeBairro: {
    fontSize: 14,
    fontWeight: '800',
    color: '#3E324F',
  },

  linhaParticipantes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  textoParticipantes: {
    fontSize: 11,
    color: '#9489A3',
  },

  etiquetaMeuBairro: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 7,
    backgroundColor: '#F0EBF8',
  },

  textoMeuBairro: {
    color: '#7961A5',
    fontSize: 9,
    fontWeight: '800',
  },

  botaoAcao: {
    minHeight: 32,
    paddingHorizontal: 9,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  botaoSolicitar: {
    backgroundColor: '#8065B5',
  },

  botaoEntrar: {
    backgroundColor: '#6F9B83',
  },

  botaoPendente: {
    backgroundColor: '#F0EBF5',
    borderWidth: 1,
    borderColor: '#E2D9EB',
  },

  botaoIndisponivel: {
    backgroundColor: '#F0EEF3',
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  textoBotaoNeutro: {
    color: '#857A98',
  },

  vazio: {
    alignItems: 'center',
    paddingTop: 55,
    paddingHorizontal: 25,
  },

  vazioIcone: {
    width: 67,
    height: 67,
    borderRadius: 22,
    backgroundColor: '#EAE3F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  vazioTitulo: {
    fontSize: 15,
    fontWeight: '800',
    color: '#443654',
    marginTop: 15,
  },

  vazioTexto: {
    fontSize: 12,
    color: '#91859F',
    marginTop: 6,
    textAlign: 'center',
  },
});
