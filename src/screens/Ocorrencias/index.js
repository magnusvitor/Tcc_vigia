
import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = 'http://localhost/TCC';

const CORES = {
  azul: '#152D63',
  lilas: '#745CD4',
  lilasClaro: '#F0EDFF',
  fundo: '#F7F8FC',
  texto: '#26334D',
  cinza: '#7B8494',
  borda: '#EEF0F4',
  branco: '#FFFFFF',
};

export default function Ocorrencias({ navigation }) {
  const [abaPrincipal, setAbaPrincipal] = useState('Minhas');

  const [minhasDenuncias, setMinhasDenuncias] = useState([]);
  const [minhasOcorrencias, setMinhasOcorrencias] = useState([]);
  const [comunidadeDenuncias, setComunidadeDenuncias] = useState([]);
  const [comunidadeOcorrencias, setComunidadeOcorrencias] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState('');

  const carregarDados = useCallback(async (atualizacaoManual = false) => {
    if (atualizacaoManual) {
      setRefreshing(true);
    } else {
      setCarregando(true);
    }

    setErro('');

    try {
      const usuarioId = await AsyncStorage.getItem('usuario_id');

      if (!usuarioId) {
        setMinhasDenuncias([]);
        setMinhasOcorrencias([]);
        setErro('Não foi possível identificar seu usuário. Entre novamente na sua conta.');
        return;
      }

      const respostas = await Promise.all([
        fetch(`${API}/listar_denuncias_usuario.php?usuario_id=${encodeURIComponent(usuarioId)}`),
        fetch(`${API}/listar_ocorrencias_usuario.php?usuario_id=${encodeURIComponent(usuarioId)}`),
        fetch(`${API}/listar_denuncias.php`),
        fetch(`${API}/listar_ocorrencias.php`),
      ]);

      const nomesArquivos = [
        'listar_denuncias_usuario.php',
        'listar_ocorrencias_usuario.php',
        'listar_denuncias.php',
        'listar_ocorrencias.php',
      ];

      respostas.forEach((resposta, index) => {
        if (!resposta.ok) {
          throw new Error(
            `${nomesArquivos[index]} retornou o erro ${resposta.status}.`
          );
        }
      });

      const [
        dadosMinhasDenuncias,
        dadosMinhasOcorrencias,
        dadosComunidadeDenuncias,
        dadosComunidadeOcorrencias,
      ] = await Promise.all(respostas.map((resposta) => resposta.json()));

      setMinhasDenuncias(
        dadosMinhasDenuncias?.sucesso &&
        Array.isArray(dadosMinhasDenuncias.denuncias)
          ? dadosMinhasDenuncias.denuncias
          : []
      );

      setMinhasOcorrencias(
        dadosMinhasOcorrencias?.sucesso &&
        Array.isArray(dadosMinhasOcorrencias.ocorrencias)
          ? dadosMinhasOcorrencias.ocorrencias
          : []
      );

      setComunidadeDenuncias(
        dadosComunidadeDenuncias?.sucesso &&
        Array.isArray(dadosComunidadeDenuncias.denuncias)
          ? dadosComunidadeDenuncias.denuncias
          : []
      );

      setComunidadeOcorrencias(
        dadosComunidadeOcorrencias?.sucesso &&
        Array.isArray(dadosComunidadeOcorrencias.ocorrencias)
          ? dadosComunidadeOcorrencias.ocorrencias
          : []
      );
    } catch (e) {
      console.log('Erro ao carregar atividades:', e);
      setErro('Não foi possível carregar as atividades. Verifique sua conexão e tente novamente.');
    } finally {
      setCarregando(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarDados(false);
    }, [carregarDados])
  );

  const minhasAtividades = useMemo(
    () => ({
      denuncias: minhasDenuncias,
      ocorrencias: minhasOcorrencias,
    }),
    [minhasDenuncias, minhasOcorrencias]
  );

  const atividadesComunidade = useMemo(
    () => ({
      denuncias: comunidadeDenuncias,
      ocorrencias: comunidadeOcorrencias,
    }),
    [comunidadeDenuncias, comunidadeOcorrencias]
  );

  const dadosAtivos =
    abaPrincipal === 'Minhas'
      ? minhasAtividades
      : atividadesComunidade;

  const totalDenuncias = dadosAtivos.denuncias.length;
  const totalOcorrencias = dadosAtivos.ocorrencias.length;
  const totalRegistros = totalDenuncias + totalOcorrencias;

  const registrosAtivos = [
    ...dadosAtivos.denuncias,
    ...dadosAtivos.ocorrencias,
  ];

  const totalPendentes = registrosAtivos.filter((item) => {
    const status = normalizar(item.status || '');
    return (
      !status.includes('solucion') &&
      !status.includes('resolvid') &&
      !status.includes('conclu')
    );
  }).length;

  function normalizar(texto) {
    return String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function obterConfiguracao(categoria) {
    const texto = normalizar(categoria);

    if (texto.includes('roubo')) {
      return {
        icone: 'shield-outline',
        cor: '#DC4444',
        fundo: '#FFF0F0',
        nome: 'ROUBO',
      };
    }

    if (texto.includes('furto')) {
      return {
        icone: 'hand-left-outline',
        cor: '#D99018',
        fundo: '#FFF6E5',
        nome: 'FURTO',
      };
    }

    if (texto.includes('homicidio')) {
      return {
        icone: 'skull-outline',
        cor: '#B91C1C',
        fundo: '#FEECEC',
        nome: 'HOMICÍDIO',
      };
    }

    if (texto.includes('violencia')) {
      return {
        icone: 'alert-circle-outline',
        cor: '#C24174',
        fundo: '#FFF0F6',
        nome: 'VIOLÊNCIA',
      };
    }

    if (texto.includes('suspeita')) {
      return {
        icone: 'eye-outline',
        cor: '#745CD4',
        fundo: '#F0EDFF',
        nome: 'ATIVIDADE SUSPEITA',
      };
    }

    if (texto.includes('desaparecid')) {
      return {
        icone: 'person-outline',
        cor: '#2876C7',
        fundo: '#EAF4FF',
        nome: 'PESSOA DESAPARECIDA',
      };
    }

    return {
      icone: 'alert-circle-outline',
      cor: '#745CD4',
      fundo: '#F0EDFF',
      nome: categoria || 'OUTRO',
    };
  }

  function statusConfiguracao(status) {
    const valor = normalizar(status);

    if (
      valor.includes('solucion') ||
      valor.includes('resolvid') ||
      valor.includes('conclu')
    ) {
      return {
        texto: 'SOLUCIONADA',
        fundo: '#EAF8EF',
        cor: '#168447',
        icone: 'checkmark-circle-outline',
      };
    }

    if (valor.includes('andamento')) {
      return {
        texto: 'EM ANDAMENTO',
        fundo: '#EEF2FF',
        cor: '#4F46E5',
        icone: 'time-outline',
      };
    }

    if (valor.includes('analise') || valor.includes('análise')) {
      return {
        texto: 'EM ANÁLISE',
        fundo: '#EEF2FF',
        cor: '#4F46E5',
        icone: 'search-outline',
      };
    }

    return {
      texto: 'PENDENTE',
      fundo: '#FFF4E5',
      cor: '#C76A10',
      icone: 'hourglass-outline',
    };
  }

  function formatarData(item) {
    const data =
      item.data_hora ||
      item.data_criacao ||
      item.data_cadastro ||
      item.data_formatada;

    if (!data) return 'Data não informada';

    if (typeof data !== 'string') return String(data);

    if (data.includes('/')) return data;

    if (data.includes('-')) {
      const partes = data.split(' ');
      const dataPartes = partes[0].split('-');

      if (dataPartes.length === 3) {
        const [ano, mes, dia] = dataPartes;
        const horario = partes[1]
          ? partes[1].substring(0, 5)
          : '';

        return `${dia}/${mes}/${ano}${horario ? ` às ${horario}` : ''}`;
      }
    }

    return data;
  }

  function obterLocal(item) {
    if (item.bairro) {
      return `${item.bairro} - Registro/SP`;
    }

    if (item.endereco) {
      return item.endereco;
    }

    return 'Registro/SP';
  }

  function abrirDetalhe(item, tipo) {
    navigation.navigate('DetalheOcorrencia', {
      ocorrencia: item,
      tipo,
    });
  }

  function renderCard(item, tipo) {
    const config = obterConfiguracao(item.categoria || item.tipo);
    const status = statusConfiguracao(item.status);

    return (
      <TouchableOpacity
        key={`${tipo}-${item.id || item.protocolo || Math.random()}`}
        style={styles.card}
        activeOpacity={0.82}
        onPress={() => abrirDetalhe(item, tipo)}
        accessibilityRole="button"
        accessibilityLabel={`${config.nome}, status ${status.texto}`}
      >
        <View
          style={[
            styles.iconeCrime,
            { backgroundColor: config.fundo },
          ]}
        >
          <Ionicons
            name={config.icone}
            size={22}
            color={config.cor}
          />
        </View>

        <View style={styles.cardInformacoes}>
          <View style={styles.cardTituloLinha}>
            <Text style={styles.cardTitulo} numberOfLines={1}>
              {config.nome}
            </Text>

            <Ionicons
              name="chevron-forward"
              size={17}
              color="#B4BBC7"
            />
          </View>

          <View style={styles.infoLinha}>
            <Ionicons
              name="location-outline"
              size={14}
              color="#8993A3"
            />
            <Text style={styles.infoTexto} numberOfLines={1}>
              {obterLocal(item)}
            </Text>
          </View>

          <View style={styles.infoLinha}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color="#8993A3"
            />
            <Text style={styles.infoTexto} numberOfLines={1}>
              {formatarData(item)}
            </Text>
          </View>

          {item.protocolo ? (
            <Text style={styles.protocolo} numberOfLines={1}>
              Protocolo: {item.protocolo}
            </Text>
          ) : null}

          <View
            style={[
              styles.status,
              { backgroundColor: status.fundo },
            ]}
          >
            <Ionicons
              name={status.icone}
              size={12}
              color={status.cor}
            />
            <Text
              style={[
                styles.statusTexto,
                { color: status.cor },
              ]}
            >
              {status.texto}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function renderSecao(titulo, subtitulo, dados, tipo, icone) {
    return (
      <View style={styles.secao} key={tipo}>
        <View style={styles.secaoCabecalho}>
          <View style={styles.secaoIcone}>
            <Ionicons name={icone} size={19} color={CORES.lilas} />
          </View>

          <View style={styles.secaoTituloArea}>
            <Text style={styles.secaoTitulo}>{titulo}</Text>
            <Text style={styles.secaoSubtitulo}>{subtitulo}</Text>
          </View>

          <View style={styles.contador}>
            <Text style={styles.contadorTexto}>{dados.length}</Text>
          </View>
        </View>

        {dados.length === 0 ? (
          <View style={styles.vazio}>
            <View style={styles.vazioIcone}>
              <Ionicons
                name="file-tray-outline"
                size={24}
                color="#9CA6B6"
              />
            </View>

            <View style={styles.vazioTextos}>
              <Text style={styles.vazioTitulo}>
                Nenhum registro por aqui
              </Text>
              <Text style={styles.vazioTexto}>
                {tipo === 'denuncia'
                  ? 'As denúncias aparecerão nesta seção.'
                  : 'As ocorrências aparecerão nesta seção.'}
              </Text>
            </View>
          </View>
        ) : (
          dados.map((item, index) => (
            <View key={`${tipo}-${item.id || item.protocolo || index}`}>
              {renderCard(item, tipo)}
            </View>
          ))
        )}
      </View>
    );
  }

  function renderResumo(titulo, valor, icone, cor, fundo) {
    return (
      <View style={styles.resumoCard} key={titulo}>
        <View style={[styles.resumoIcone, { backgroundColor: fundo }]}>
          <Ionicons name={icone} size={20} color={cor} />
        </View>

        <Text style={styles.resumoValor}>{valor}</Text>
        <Text style={styles.resumoTitulo}>{titulo}</Text>
      </View>
    );
  }

  if (carregando) {
    return (
      <SafeAreaView style={styles.loading}>
        <View style={styles.loadingIcone}>
          <ActivityIndicator size="large" color={CORES.lilas} />
        </View>
        <Text style={styles.loadingTitulo}>Carregando atividades</Text>
        <Text style={styles.loadingTexto}>
          Estamos buscando seus registros...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLinha}>
          <View style={styles.headerIcone}>
            <Ionicons
              name="document-text-outline"
              size={23}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.headerTextos}>
            <Text style={styles.tituloPagina}>
              Minhas atividades
            </Text>
            <Text style={styles.subtituloPagina}>
              Acompanhe denúncias e ocorrências
            </Text>
          </View>

          <TouchableOpacity
            style={styles.botaoAtualizar}
            onPress={() => carregarDados(true)}
            activeOpacity={0.75}
            accessibilityLabel="Atualizar atividades"
          >
            <Ionicons
              name="refresh-outline"
              size={21}
              color={CORES.azul}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.abasContainer}>
        <TouchableOpacity
          style={[
            styles.aba,
            abaPrincipal === 'Minhas' && styles.abaAtiva,
          ]}
          onPress={() => setAbaPrincipal('Minhas')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="person-outline"
            size={17}
            color={abaPrincipal === 'Minhas' ? '#FFFFFF' : '#687386'}
          />
          <Text
            style={[
              styles.textoAba,
              abaPrincipal === 'Minhas' && styles.textoAbaAtiva,
            ]}
          >
            Minhas
          </Text>
          <View
            style={[
              styles.abaContador,
              abaPrincipal === 'Minhas' && styles.abaContadorAtivo,
            ]}
          >
            <Text
              style={[
                styles.abaContadorTexto,
                abaPrincipal === 'Minhas' && styles.abaContadorTextoAtivo,
              ]}
            >
              {minhasDenuncias.length + minhasOcorrencias.length}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.aba,
            abaPrincipal === 'Comunidade' && styles.abaAtiva,
          ]}
          onPress={() => setAbaPrincipal('Comunidade')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="people-outline"
            size={17}
            color={abaPrincipal === 'Comunidade' ? '#FFFFFF' : '#687386'}
          />
          <Text
            style={[
              styles.textoAba,
              abaPrincipal === 'Comunidade' && styles.textoAbaAtiva,
            ]}
          >
            Comunidade
          </Text>
          <View
            style={[
              styles.abaContador,
              abaPrincipal === 'Comunidade' && styles.abaContadorAtivo,
            ]}
          >
            <Text
              style={[
                styles.abaContadorTexto,
                abaPrincipal === 'Comunidade' && styles.abaContadorTextoAtivo,
              ]}
            >
              {comunidadeDenuncias.length + comunidadeOcorrencias.length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.lista}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => carregarDados(true)}
            colors={[CORES.lilas]}
            tintColor={CORES.lilas}
          />
        }
      >
        <View style={styles.resumoCabecalho}>
          <View>
            <Text style={styles.resumoCabecalhoTitulo}>
              Visão geral
            </Text>
            <Text style={styles.resumoCabecalhoSubtitulo}>
              {abaPrincipal === 'Minhas'
                ? 'Seus registros no SMC'
                : 'Registros compartilhados no sistema'}
            </Text>
          </View>

          <View style={styles.resumoSelo}>
            <Ionicons
              name="stats-chart-outline"
              size={13}
              color={CORES.lilas}
            />
            <Text style={styles.resumoSeloTexto}>Resumo</Text>
          </View>
        </View>

        <View style={styles.resumoContainer}>
          {renderResumo(
            'Total de registros',
            totalRegistros,
            'documents-outline',
            CORES.azul,
            '#EAF0FF'
          )}

          {renderResumo(
            'Denúncias',
            totalDenuncias,
            'megaphone-outline',
            CORES.lilas,
            '#F0EDFF'
          )}

          {renderResumo(
            'Ocorrências',
            totalOcorrencias,
            'alert-circle-outline',
            '#D97706',
            '#FFF3DF'
          )}
        </View>

        {totalRegistros > 0 && (
          <View style={styles.pendentesCard}>
            <View style={styles.pendentesIcone}>
              <Ionicons
                name="time-outline"
                size={19}
                color="#C76A10"
              />
            </View>

            <View style={styles.pendentesTextoArea}>
              <Text style={styles.pendentesTitulo}>
                Registros em acompanhamento
              </Text>
              <Text style={styles.pendentesSubtitulo}>
                Registros que ainda não constam como solucionados
              </Text>
            </View>

            <Text style={styles.pendentesNumero}>
              {totalPendentes}
            </Text>
          </View>
        )}

        {erro ? (
          <View style={styles.erroCard}>
            <View style={styles.erroIcone}>
              <Ionicons
                name="cloud-offline-outline"
                size={23}
                color="#DC4444"
              />
            </View>

            <View style={styles.erroTextos}>
              <Text style={styles.erroTitulo}>
                Não foi possível carregar
              </Text>
              <Text style={styles.erroTexto}>{erro}</Text>

              <TouchableOpacity
                onPress={() => carregarDados(true)}
                style={styles.botaoTentar}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="refresh-outline"
                  size={15}
                  color={CORES.lilas}
                />
                <Text style={styles.botaoTentarTexto}>
                  Tentar novamente
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {abaPrincipal === 'Minhas' ? (
              <>
                {renderSecao(
                  'Minhas denúncias',
                  'Relatos enviados por você',
                  minhasDenuncias,
                  'denuncia',
                  'document-text-outline'
                )}

                {renderSecao(
                  'Minhas ocorrências',
                  'Ocorrências relacionadas aos seus registros',
                  minhasOcorrencias,
                  'ocorrencia',
                  'alert-circle-outline'
                )}
              </>
            ) : (
              <>
                {renderSecao(
                  'Denúncias da comunidade',
                  'Relatos compartilhados pelos moradores',
                  comunidadeDenuncias,
                  'denuncia',
                  'people-outline'
                )}

                {renderSecao(
                  'Ocorrências da comunidade',
                  'Ocorrências acompanhadas pelo sistema',
                  comunidadeOcorrencias,
                  'ocorrencia',
                  'location-outline'
                )}
              </>
            )}
          </>
        )}

        <TouchableOpacity
          style={styles.botaoDenuncia}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('MinhasDenuncias')}
        >
          <View style={styles.botaoDenunciaIcone}>
            <Ionicons name="add" size={24} color={CORES.lilas} />
          </View>

          <View style={styles.botaoDenunciaTextoArea}>
            <Text style={styles.botaoDenunciaTitulo}>
              Realizar uma denúncia
            </Text>
            <Text style={styles.botaoDenunciaSubtitulo}>
              Compartilhe uma informação importante
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#A5ACB8"
          />
        </TouchableOpacity>

        <View style={styles.rodape}>
          <Ionicons
            name="shield-checkmark-outline"
            size={15}
            color="#9AA3B2"
          />
          <Text style={styles.rodapeTexto}>
            SMC · Segurança começa com informação
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },

  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CORES.fundo,
    padding: 24,
  },

  loadingIcone: {
    width: 66,
    height: 66,
    borderRadius: 22,
    backgroundColor: CORES.lilasClaro,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  loadingTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: CORES.azul,
  },

  loadingTexto: {
    marginTop: 6,
    fontSize: 12,
    color: CORES.cinza,
  },

  header: {
    backgroundColor: CORES.branco,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 17,
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
  },

  headerLinha: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerIcone: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: CORES.azul,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  headerTextos: {
    flex: 1,
  },

  tituloPagina: {
    fontSize: 20,
    fontWeight: '800',
    color: CORES.azul,
    letterSpacing: -0.4,
  },

  subtituloPagina: {
    marginTop: 4,
    fontSize: 11.5,
    color: CORES.cinza,
  },

  botaoAtualizar: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: '#F2F4FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  abasContainer: {
    flexDirection: 'row',
    backgroundColor: CORES.branco,
    paddingHorizontal: 16,
    paddingTop: 3,
    paddingBottom: 13,
    gap: 9,
  },

  aba: {
    flex: 1,
    minHeight: 43,
    borderRadius: 12,
    backgroundColor: '#F3F4F8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    gap: 6,
  },

  abaAtiva: {
    backgroundColor: CORES.lilas,
  },

  textoAba: {
    fontSize: 12,
    fontWeight: '700',
    color: '#687386',
  },

  textoAbaAtiva: {
    color: CORES.branco,
  },

  abaContador: {
    minWidth: 21,
    height: 21,
    borderRadius: 11,
    paddingHorizontal: 5,
    backgroundColor: '#E5E7EE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  abaContadorAtivo: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  abaContadorTexto: {
    fontSize: 9,
    fontWeight: '800',
    color: '#687386',
  },

  abaContadorTextoAtivo: {
    color: CORES.branco,
  },

  lista: {
    flex: 1,
  },

  conteudo: {
    paddingHorizontal: 16,
    paddingTop: 19,
    paddingBottom: 28,
  },

  resumoCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  resumoCabecalhoTitulo: {
    fontSize: 16,
    fontWeight: '800',
    color: CORES.azul,
  },

  resumoCabecalhoSubtitulo: {
    marginTop: 3,
    fontSize: 11,
    color: CORES.cinza,
  },

  resumoSelo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 9,
    backgroundColor: CORES.lilasClaro,
  },

  resumoSeloTexto: {
    fontSize: 10,
    fontWeight: '700',
    color: CORES.lilas,
  },

  resumoContainer: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 12,
  },

  resumoCard: {
    flex: 1,
    minWidth: 0,
    minHeight: 116,
    backgroundColor: CORES.branco,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#EEF0F6',
    ...Platform.select({
      ios: {
        shadowColor: '#152D63',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.035,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0px 3px 12px rgba(21,45,99,0.035)',
      },
    }),
  },

  resumoIcone: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  resumoValor: {
    fontSize: 22,
    fontWeight: '800',
    color: CORES.azul,
  },

  resumoTitulo: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    color: CORES.cinza,
  },

  pendentesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFCF6',
    borderWidth: 1,
    borderColor: '#F6E8D2',
    borderRadius: 14,
    padding: 12,
    marginBottom: 23,
  },

  pendentesIcone: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#FFF0D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  pendentesTextoArea: {
    flex: 1,
    marginRight: 8,
  },

  pendentesTitulo: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#8D5819',
  },

  pendentesSubtitulo: {
    fontSize: 9.5,
    lineHeight: 14,
    color: '#A17B4D',
    marginTop: 3,
  },

  pendentesNumero: {
    fontSize: 21,
    fontWeight: '800',
    color: '#C76A10',
  },

  secao: {
    marginBottom: 23,
  },

  secaoCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },

  secaoIcone: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: CORES.lilasClaro,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  secaoTituloArea: {
    flex: 1,
  },

  secaoTitulo: {
    fontSize: 14,
    fontWeight: '800',
    color: CORES.azul,
  },

  secaoSubtitulo: {
    fontSize: 10,
    color: '#8C95A4',
    marginTop: 3,
  },

  contador: {
    minWidth: 29,
    height: 29,
    paddingHorizontal: 7,
    borderRadius: 10,
    backgroundColor: CORES.lilasClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },

  contadorTexto: {
    fontSize: 11,
    fontWeight: '800',
    color: CORES.lilas,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: CORES.branco,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#EDF0F5',
    padding: 13,
    marginBottom: 9,
    ...Platform.select({
      ios: {
        shadowColor: '#152D63',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.035,
        shadowRadius: 7,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0px 3px 12px rgba(21,45,99,0.035)',
      },
    }),
  },

  iconeCrime: {
    width: 43,
    height: 43,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardInformacoes: {
    flex: 1,
    minWidth: 0,
    marginLeft: 11,
  },

  cardTituloLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },

  cardTitulo: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '800',
    color: '#202B40',
  },

  infoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 5,
  },

  infoTexto: {
    flex: 1,
    fontSize: 10.5,
    color: '#7D8796',
  },

  protocolo: {
    marginTop: 6,
    fontSize: 9.5,
    color: '#A0A8B5',
  },

  status: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
    marginTop: 9,
  },

  statusTexto: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  vazio: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.branco,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CORES.borda,
    padding: 14,
    gap: 11,
  },

  vazioIcone: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#F3F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  vazioTextos: {
    flex: 1,
  },

  vazioTitulo: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#5C6678',
  },

  vazioTexto: {
    fontSize: 10,
    color: '#929AAA',
    marginTop: 4,
    lineHeight: 15,
  },

  erroCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#F8DADA',
    borderRadius: 14,
    padding: 14,
    marginBottom: 22,
  },

  erroIcone: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFE6E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  erroTextos: {
    flex: 1,
  },

  erroTitulo: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B42323',
  },

  erroTexto: {
    fontSize: 10.5,
    lineHeight: 16,
    color: '#8F5555',
    marginTop: 4,
  },

  botaoTentar: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
  },

  botaoTentarTexto: {
    fontSize: 11,
    fontWeight: '700',
    color: CORES.lilas,
  },

  botaoDenuncia: {
    minHeight: 73,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.branco,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E5E0F8',
    paddingHorizontal: 13,
    paddingVertical: 12,
    marginTop: 0,
  },

  botaoDenunciaIcone: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: CORES.lilasClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },

  botaoDenunciaTextoArea: {
    flex: 1,
    minWidth: 0,
    marginLeft: 11,
    marginRight: 8,
  },

  botaoDenunciaTitulo: {
    fontSize: 12.5,
    fontWeight: '800',
    color: CORES.lilas,
  },

  botaoDenunciaSubtitulo: {
    fontSize: 10,
    color: '#929AAA',
    marginTop: 4,
  },

  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 22,
    marginBottom: 5,
  },

  rodapeTexto: {
    fontSize: 9.5,
    color: '#9AA3B2',
  },
});
