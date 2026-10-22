
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const API = 'http://localhost/TCC/minhas_comunidades.php';

const FOTO_SEGURANCA =
  'https://images.unsplash.com/photo-1453873531674-2151bcd01707?auto=format&fit=crop&w=1000&q=80';

export default function Home({ navigation }) {
  const [comunidades, setComunidades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [textoBusca, setTextoBusca] = useState('');

  const carregarComunidades = useCallback(async () => {
    try {
      const usuarioId = await AsyncStorage.getItem('usuario_id');

      if (!usuarioId) {
        setComunidades([]);
        return;
      }

      const resposta = await fetch(
        `${API}?usuario_id=${encodeURIComponent(usuarioId)}`
      );

      const dados = await resposta.json();

      if (!resposta.ok || !dados.sucesso) {
        throw new Error(dados.mensagem || 'Erro ao carregar comunidades.');
      }

      const lista = Array.isArray(dados.comunidades)
        ? dados.comunidades
        : [];

      setComunidades(
        lista.filter(
          (item) =>
            item.status === 'aprovado' ||
            item.status_usuario === 'aprovado' ||
            item.participando === true ||
            item.participando === 1 ||
            item.participando === '1'
        )
      );
    } catch (erro) {
      console.error('Erro ao carregar comunidades:', erro.message);
      setComunidades([]);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarComunidades();
    }, [carregarComunidades])
  );

  function normalizar(texto) {
    return String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }

  // A lista de conversas continua mostrando somente as comunidades
  // das quais o usuário já participa.
  const comunidadesFiltradas = useMemo(() => {
    const termo = normalizar(textoBusca);

    if (!termo) {
      return comunidades;
    }

    return comunidades.filter((item) => {
      const nome = normalizar(item.nome);
      const bairro = normalizar(item.bairro);
      const descricao = normalizar(item.descricao);

      return (
        nome.includes(termo) ||
        bairro.includes(termo) ||
        descricao.includes(termo)
      );
    });
  }, [comunidades, textoBusca]);

  // A lupa abre a tela de busca e envia somente o termo digitado.
  function buscarComunidades() {
    const termo = textoBusca.trim();

    if (!termo) {
      return;
    }

    navigation.navigate('BuscarComunidades', {
      filtro: termo,
    });
  }

  function abrirConversa(comunidade) {
    navigation.navigate('ComunidadeConversa', {
      comunidade,
      comunidadeId: comunidade.id ?? comunidade.comunidade_id,
      nomeComunidade: comunidade.nome,
    });
  }

  function atualizar() {
    setAtualizando(true);
    carregarComunidades();
  }

  function limparBusca() {
    setTextoBusca('');
  }

  return (
    <View style={styles.tela}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={atualizar}
            colors={['#9075C9']}
            tintColor="#9075C9"
          />
        }
      >
        {/* BOAS-VINDAS */}
        <View style={styles.introducao}>
          <Text style={styles.titulo}>
            Bem-vindo(a) ao chat
            {'\n'}
            comunitário do SMC
          </Text>

          <Text style={styles.descricao}>
            Converse e compartilhe informações com os moradores do seu bairro.
          </Text>
        </View>

        {/* BARRA DE PESQUISA */}
        <View style={styles.containerPesquisa}>
          <MaterialIcons
            name="search"
            size={23}
            color="#9075C9"
          />

          <TextInput
            style={styles.inputPesquisa}
            placeholder="Digite o nome de uma comunidade..."
            placeholderTextColor="#A09AAA"
            value={textoBusca}
            onChangeText={setTextoBusca}
            onSubmitEditing={buscarComunidades}
            returnKeyType="search"
            autoCorrect={false}
          />

          {textoBusca.length > 0 && (
            <TouchableOpacity
              onPress={limparBusca}
              style={styles.botaoLimpar}
              accessibilityLabel="Limpar pesquisa"
            >
              <MaterialIcons
                name="close"
                size={19}
                color="#8D879A"
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.botaoPesquisar}
            onPress={buscarComunidades}
            activeOpacity={0.8}
            accessibilityLabel="Pesquisar comunidades"
          >
            <MaterialIcons
              name="arrow-forward"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* BANNER DE SEGURANÇA */}
        <ImageBackground
          source={{ uri: FOTO_SEGURANCA }}
          style={styles.banner}
          imageStyle={styles.bannerImagem}
          resizeMode="cover"
        >
          <View style={styles.bannerOverlay}>
            <View style={styles.bannerConteudo}>
              <View style={styles.bannerEtiqueta}>
                <MaterialIcons
                  name="verified-user"
                  size={13}
                  color="#FFFFFF"
                />
                <Text style={styles.bannerEtiquetaTexto}>
                  SEGURANÇA COLABORATIVA
                </Text>
              </View>

              <View>
                <Text style={styles.bannerTitulo}>
                  Uma comunidade
                  {'\n'}
                  mais conectada.
                </Text>

                <Text style={styles.bannerDescricao}>
                  A informação fortalece a segurança de todos.
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* MINHAS COMUNIDADES */}
        <View style={styles.secao}>
          <View style={styles.secaoCabecalho}>
            <View style={styles.secaoTexto}>
              <Text style={styles.secaoTitulo}>
                Minhas comunidades
              </Text>

              <Text style={styles.secaoDescricao}>
                {textoBusca.trim()
                  ? 'Resultados nas suas comunidades'
                  : 'Suas conversas em um só lugar'}
              </Text>
            </View>

            {!textoBusca.trim() && (
              <View style={styles.contador}>
                <Text style={styles.contadorTexto}>
                  {comunidades.length}
                </Text>
              </View>
            )}
          </View>

          {carregando ? (
            <View style={styles.estado}>
              <ActivityIndicator color="#9075C9" size="small" />
              <Text style={styles.estadoTexto}>
                Carregando comunidades...
              </Text>
            </View>
          ) : comunidadesFiltradas.length > 0 ? (
            <View style={styles.listaCard}>
              {comunidadesFiltradas.map((item, index) => (
                <View
                  key={String(item.id ?? item.comunidade_id ?? index)}
                >
                  <TouchableOpacity
                    style={styles.conversa}
                    activeOpacity={0.75}
                    onPress={() => abrirConversa(item)}
                  >
                    <View style={styles.avatar}>
                      {item.foto ? (
                        <ImageBackground
                          source={{ uri: item.foto }}
                          style={styles.avatarFoto}
                          imageStyle={styles.avatarFotoImagem}
                        />
                      ) : (
                        <MaterialIcons
                          name="groups"
                          size={24}
                          color="#9075C9"
                        />
                      )}
                    </View>

                    <View style={styles.conversaInfo}>
                      <Text
                        style={styles.nomeComunidade}
                        numberOfLines={1}
                      >
                        {item.nome}
                      </Text>

                      <Text style={styles.bairro} numberOfLines={1}>
                        {item.bairro || 'Comunidade do bairro'}
                      </Text>
                    </View>

                    <MaterialIcons
                      name="chevron-right"
                      size={23}
                      color="#B4AEC0"
                    />
                  </TouchableOpacity>

                  {index < comunidadesFiltradas.length - 1 && (
                    <View style={styles.divisor} />
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.vazioCard}>
              <View style={styles.vazioIconeBg}>
                <MaterialIcons
                  name={textoBusca.trim() ? 'search-off' : 'forum'}
                  size={30}
                  color="#9075C9"
                />
              </View>

              <Text style={styles.vazioTitulo}>
                {textoBusca.trim()
                  ? 'Nenhum resultado encontrado'
                  : 'Você ainda não participa de comunidades'}
              </Text>

              <Text style={styles.vazioDescricao}>
                {textoBusca.trim()
                  ? `Não encontramos "${textoBusca.trim()}" nas suas comunidades. Use a lupa para pesquisar entre as comunidades disponíveis.`
                  : 'Digite o nome de uma comunidade na barra de pesquisa para encontrar o que procura.'}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.rodape}>
          Segurança, comunicação e colaboração.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#F7F6FA',
  },

  conteudo: {
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 30,
    width: '100%',
    maxWidth: 850,
    alignSelf: 'center',
  },

  introducao: {
    marginBottom: 18,
  },

  titulo: {
    fontSize: 27,
    fontWeight: '800',
    color: '#292440',
    lineHeight: 35,
    letterSpacing: -0.6,
  },

  descricao: {
    fontSize: 13,
    color: '#817B90',
    marginTop: 8,
    lineHeight: 20,
    maxWidth: 480,
  },

  containerPesquisa: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#EAE5F2',
    paddingLeft: 14,
    paddingRight: 6,
    height: 53,
    marginBottom: 20,
    gap: 10,
  },

  inputPesquisa: {
    flex: 1,
    minWidth: 0,
    fontSize: 13,
    color: '#292440',
    height: '100%',
    outlineStyle: 'none',
  },

  botaoLimpar: {
    width: 29,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },

  botaoPesquisar: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: '#9075C9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  banner: {
    height: 178,
    borderRadius: 19,
    overflow: 'hidden',
    marginBottom: 27,
    backgroundColor: '#393052',
  },

  bannerImagem: {
    borderRadius: 19,
  },

  bannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(32, 25, 48, 0.52)',
    padding: 18,
  },

  bannerConteudo: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  bannerEtiqueta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.17)',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
  },

  bannerEtiquetaTexto: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  bannerTitulo: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 27,
  },

  bannerDescricao: {
    color: '#F0ECF8',
    fontSize: 11,
    marginTop: 6,
  },

  secao: {
    marginTop: 1,
  },

  secaoCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
  },

  secaoTexto: {
    flex: 1,
  },

  secaoTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#292440',
  },

  secaoDescricao: {
    fontSize: 11,
    color: '#928CA0',
    marginTop: 4,
  },

  contador: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#EAE4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  contadorTexto: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7259B8',
  },

  listaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#EFECF4',
    paddingVertical: 4,
  },

  conversa: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 13,
    gap: 12,
  },

  avatar: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#F0EBF8',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  avatarFoto: {
    width: '100%',
    height: '100%',
  },

  avatarFotoImagem: {
    borderRadius: 14,
  },

  conversaInfo: {
    flex: 1,
    minWidth: 0,
  },

  nomeComunidade: {
    fontSize: 13,
    fontWeight: '700',
    color: '#302B43',
  },

  bairro: {
    fontSize: 11,
    color: '#918B9F',
    marginTop: 4,
  },

  divisor: {
    height: 1,
    backgroundColor: '#F1EEF5',
    marginLeft: 68,
    marginRight: 13,
  },

  estado: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 35,
  },

  estadoTexto: {
    fontSize: 12,
    color: '#928CA0',
    marginTop: 9,
  },

  vazioCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFECF4',
    borderRadius: 18,
    alignItems: 'center',
    paddingVertical: 27,
    paddingHorizontal: 22,
  },

  vazioIconeBg: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: '#EEE8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  vazioTitulo: {
    color: '#302B43',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },

  vazioDescricao: {
    color: '#918B9F',
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 7,
    maxWidth: 350,
  },

  rodape: {
    textAlign: 'center',
    color: '#A7A1B2',
    fontSize: 10,
    marginTop: 27,
  },
});
