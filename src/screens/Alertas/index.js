
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import Svg, { Line, Polyline, Circle, Text as SvgText } from "react-native-svg";

const screenWidth = Dimensions.get("window").width;
const API = "http://localhost/TCC";

const CATEGORIAS = [
  { chave: "roubos", titulo: "Roubos", cor: "#E34B53", icone: "report-problem" },
  { chave: "furtos", titulo: "Furtos", cor: "#E9A23B", icone: "lock-open" },
  { chave: "homicidios", titulo: "Homicídios", cor: "#8B3652", icone: "warning" },
  { chave: "outros", titulo: "Outros", cor: "#8971D3", icone: "more-horiz" },
];

const DADOS_INICIAIS = {
  roubos: 0,
  furtos: 0,
  homicidios: 0,
  outros: 0,
};

export default function EstatisticasSMC() {
  const [filtroAtivo, setFiltroAtivo] = useState(30);
  const [menuAberto, setMenuAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [carregandoLocais, setCarregandoLocais] = useState(true);

  const [dados, setDados] = useState(DADOS_INICIAIS);
  const [historico, setHistorico] = useState([]);
  const [resumoLocais, setResumoLocais] = useState([]);

  const totalRegistros =
    dados.roubos + dados.furtos + dados.homicidios + dados.outros;

  const buscarMetricasReais = useCallback(async (dias, mostrarErro = true) => {
    try {
      const response = await fetch(`${API}/listar_estatisticas.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ periodo_dias: dias }),
      });

      const resultado = await response.json();

      if (!response.ok || resultado.sucesso === false) {
        throw new Error(
          resultado.erro || resultado.mensagem || "Erro ao buscar estatísticas."
        );
      }

      setDados({
        roubos: parseInt(resultado.roubos, 10) || 0,
        furtos: parseInt(resultado.furtos, 10) || 0,
        homicidios: parseInt(resultado.homicidios, 10) || 0,
        outros: parseInt(resultado.outros, 10) || 0,
      });

      const lista = Array.isArray(resultado.historico)
        ? resultado.historico.map((item) => ({
            data: item.data || "",
            roubos: Number(item.roubos) || 0,
            furtos: Number(item.furtos) || 0,
            homicidios: Number(item.homicidios) || 0,
            outros: Number(item.outros) || 0,
          }))
        : [];

      setHistorico(lista);
    } catch (error) {
      console.error("ERRO ESTATÍSTICAS:", error);

      if (mostrarErro) {
        Alert.alert(
          "Erro de conexão",
          "Não foi possível carregar as estatísticas. Verifique sua conexão e tente novamente."
        );
      }

      setDados(DADOS_INICIAIS);
      setHistorico([]);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  const buscarResumoLocais = useCallback(async (dias) => {
    try {
      setCarregandoLocais(true);

      const resposta = await fetch(`${API}/resumo_locais.php?dias=${dias}`);
      const resultado = await resposta.json();

      if (!resposta.ok || resultado.sucesso === false) {
        throw new Error(
          resultado.mensagem || "Não foi possível carregar os locais."
        );
      }

      setResumoLocais(
        Array.isArray(resultado.locais) ? resultado.locais : []
      );
    } catch (error) {
      console.error("ERRO RESUMO POR LOCAL:", error);
      setResumoLocais([]);
    } finally {
      setCarregandoLocais(false);
    }
  }, []);

  useEffect(() => {
    buscarMetricasReais(filtroAtivo);
    buscarResumoLocais(filtroAtivo);
  }, [filtroAtivo, buscarMetricasReais, buscarResumoLocais]);

  const atualizarTudo = () => {
    setAtualizando(true);
    buscarMetricasReais(filtroAtivo);
    buscarResumoLocais(filtroAtivo);
  };

  function formatarData(data) {
    if (!data) return "";

    const texto = String(data);
    const partes = texto.slice(0, 10).split("-");

    if (partes.length === 3 && partes[0].length === 4) {
      return `${partes[2]}/${partes[1]}`;
    }

    return texto.slice(0, 10);
  }

  function calcularPosicaoPonto(categoria, index, largura, altura) {
    if (!historico.length) return { x: 0, y: 0 };

    const valores = historico.map((item) => Number(item[categoria]) || 0);

    const maiorValor = Math.max(
      ...historico.flatMap((item) =>
        CATEGORIAS.map((cat) => Number(item[cat.chave]) || 0)
      ),
      1
    );

    const margemEsquerda = 30;
    const margemDireita = 14;
    const margemSuperior = 16;
    const margemInferior = 30;

    const areaLargura = largura - margemEsquerda - margemDireita;
    const areaAltura = altura - margemSuperior - margemInferior;

    const x =
      valores.length === 1
        ? largura / 2
        : margemEsquerda + (index / (valores.length - 1)) * areaLargura;

    const y =
      margemSuperior +
      areaAltura -
      ((valores[index] || 0) / maiorValor) * areaAltura;

    return { x, y };
  }

  function prepararPontos(categoria, largura, altura) {
    return historico
      .map((item, index) => {
        const ponto = calcularPosicaoPonto(categoria, index, largura, altura);
        return `${ponto.x},${ponto.y}`;
      })
      .join(" ");
  }

  function GraficoLinhas() {
    const largura = Math.max(screenWidth - 72, 290);
    const altura = 220;

    if (!historico.length) {
      return (
        <View style={styles.graficoVazio}>
          <View style={styles.graficoVazioIcone}>
            <MaterialIcons name="show-chart" size={32} color="#8971D3" />
          </View>
          <Text style={styles.graficoVazioTitulo}>
            Sem dados para exibir
          </Text>
          <Text style={styles.graficoVazioTexto}>
            Não foram encontrados registros no período selecionado.
          </Text>
        </View>
      );
    }

    const maiorValor = Math.max(
      ...historico.flatMap((item) =>
        CATEGORIAS.map((cat) => Number(item[cat.chave]) || 0)
      ),
      1
    );

    const maximoEscala = Math.ceil(maiorValor / 5) * 5 || 5;
    const linhasGrade = [0, 1, 2, 3, 4];

    return (
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
        >
          <Svg width={largura} height={altura}>
            {linhasGrade.map((passo) => {
              const y = 16 + 174 - (passo / 4) * 174;
              const valor = Math.round((passo / 4) * maximoEscala);

              return (
                <React.Fragment key={`grade-${passo}`}>
                  <Line
                    x1={29}
                    y1={y}
                    x2={largura - 12}
                    y2={y}
                    stroke="#EDF0F6"
                    strokeWidth="1"
                  />
                  <SvgText
                    x={23}
                    y={y + 3}
                    fontSize="9"
                    fill="#9AA2B2"
                    textAnchor="end"
                  >
                    {valor}
                  </SvgText>
                </React.Fragment>
              );
            })}

            {CATEGORIAS.map((categoria) => (
              <Polyline
                key={categoria.chave}
                points={prepararPontos(categoria.chave, largura, altura)}
                fill="none"
                stroke={categoria.cor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {historico.map((item, index) =>
              CATEGORIAS.map((categoria) => {
                const posicao = calcularPosicaoPonto(
                  categoria.chave,
                  index,
                  largura,
                  altura
                );

                return (
                  <Circle
                    key={`${categoria.chave}-${index}`}
                    cx={posicao.x}
                    cy={posicao.y}
                    r="3.5"
                    fill="#FFFFFF"
                    stroke={categoria.cor}
                    strokeWidth="2"
                  />
                );
              })
            )}

            {historico.map((item, index) => {
              const posicao = calcularPosicaoPonto(
                "roubos",
                index,
                largura,
                altura
              );

              const mostrarData =
                historico.length <= 7 ||
                index === 0 ||
                index === historico.length - 1 ||
                index % Math.ceil(historico.length / 5) === 0;

              if (!mostrarData) return null;

              return (
                <SvgText
                  key={`data-${index}`}
                  x={posicao.x}
                  y={altura - 6}
                  fontSize="9"
                  fill="#8B93A3"
                  textAnchor="middle"
                >
                  {formatarData(item.data)}
                </SvgText>
              );
            })}
          </Svg>
        </ScrollView>

        <View style={styles.legenda}>
          {CATEGORIAS.map((categoria) => (
            <Legenda
              key={categoria.chave}
              cor={categoria.cor}
              texto={categoria.titulo}
            />
          ))}
        </View>
      </View>
    );
  }

  function ResumoPorLocal() {
    return (
      <View style={styles.locaisContainer}>
        <View style={styles.secaoCabecalho}>
          <View style={styles.secaoIcone}>
            <MaterialIcons name="location-city" size={22} color="#8971D3" />
          </View>

          <View style={styles.secaoCabecalhoTexto}>
            <Text style={styles.secaoTitulo}>Registros por local</Text>
            <Text style={styles.secaoSubtitulo}>
              Distribuição no período selecionado
            </Text>
          </View>
        </View>

        {carregandoLocais ? (
          <View style={styles.estadoLocal}>
            <ActivityIndicator size="small" color="#8971D3" />
            <Text style={styles.estadoTexto}>Carregando locais...</Text>
          </View>
        ) : resumoLocais.length === 0 ? (
          <View style={styles.estadoLocal}>
            <MaterialIcons
              name="location-off"
              size={32}
              color="#B4B9C5"
            />
            <Text style={styles.estadoTitulo}>
              Nenhum registro por local
            </Text>
            <Text style={styles.estadoTexto}>
              Os dados serão exibidos aqui quando estiverem disponíveis.
            </Text>
          </View>
        ) : (
          resumoLocais.map((item, index) => {
            const total = Number(item.total_registros) || 0;
            const maiorTotal = Math.max(
              ...resumoLocais.map(
                (local) => Number(local.total_registros) || 0
              ),
              1
            );

            const proporcao = (total / maiorTotal) * 100;

            return (
              <View
                key={`${item.local}-${index}`}
                style={styles.localCard}
              >
                <View style={styles.localIcone}>
                  <MaterialIcons
                    name="place"
                    size={21}
                    color="#7259B8"
                  />
                </View>

                <View style={styles.localInformacoes}>
                  <Text style={styles.localNome} numberOfLines={1}>
                    {item.local || "Local não informado"}
                  </Text>

                  <Text style={styles.localDetalhes}>
                    {Number(item.total_denuncias) || 0} denúncias
                    {"  ·  "}
                    {Number(item.total_ocorrencias) || 0} ocorrências
                  </Text>

                  <View style={styles.barraFundo}>
                    <View
                      style={[
                        styles.barraPreenchimento,
                        { width: `${proporcao}%` },
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.localContador}>
                  <Text style={styles.localTotal}>{total}</Text>
                  <Text style={styles.localLegenda}>registros</Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={atualizarTudo}
            colors={["#8971D3"]}
            tintColor="#8971D3"
          />
        }
      >
        {/* CABEÇALHO */}
        <View style={styles.topo}>
          <View style={styles.topoIcone}>
            <MaterialIcons
              name="analytics"
              size={27}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.tituloContainer}>
            <Text style={styles.titulo}>Estatísticas</Text>
            <Text style={styles.subtitulo}>
              Segurança pública em Registro-SP
            </Text>
          </View>

          <TouchableOpacity
            style={styles.botaoRecarregar}
            onPress={atualizarTudo}
            activeOpacity={0.7}
          >
            <MaterialIcons name="refresh" size={23} color="#7259B8" />
          </TouchableOpacity>
        </View>

        {/* FILTRO */}
        <View style={styles.filtroArea}>
          <View style={styles.filtroTituloLinha}>
            <MaterialIcons
              name="calendar-month"
              size={17}
              color="#8971D3"
            />
            <Text style={styles.filtroLabel}>Período de análise</Text>
          </View>

          <View style={styles.filtrosLinha}>
            {[15, 30, 90].map((dias) => {
              const ativo = filtroAtivo === dias;

              return (
                <TouchableOpacity
                  key={dias}
                  style={[
                    styles.filtroBotao,
                    ativo && styles.filtroBotaoAtivo,
                  ]}
                  onPress={() => setFiltroAtivo(dias)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.filtroBotaoTexto,
                      ativo && styles.filtroBotaoTextoAtivo,
                    ]}
                  >
                    {dias} dias
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {carregando ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#8971D3" />
            <Text style={styles.loaderText}>
              Atualizando estatísticas...
            </Text>
          </View>
        ) : (
          <>
            {/* MÉTRICA GERAL */}
            <View style={styles.totalCard}>
              <View style={styles.totalTextoContainer}>
                <Text style={styles.totalLegenda}>
                  TOTAL DE REGISTROS
                </Text>
                <Text style={styles.totalValor}>
                  {totalRegistros.toLocaleString("pt-BR")}
                </Text>
                <Text style={styles.totalDescricao}>
                  Nos últimos {filtroAtivo} dias
                </Text>
              </View>

              <View style={styles.totalIcone}>
                <MaterialIcons
                  name="shield"
                  size={34}
                  color="#FFFFFF"
                />
              </View>

              <View style={styles.totalDecoracao} />
            </View>

            {/* CARDS POR CATEGORIA */}
            <View style={styles.secaoCabecalho}>
              <View style={styles.secaoIcone}>
                <MaterialIcons
                  name="donut-small"
                  size={22}
                  color="#8971D3"
                />
              </View>

              <View style={styles.secaoCabecalhoTexto}>
                <Text style={styles.secaoTitulo}>
                  Por categoria
                </Text>
                <Text style={styles.secaoSubtitulo}>
                  Registros no período
                </Text>
              </View>
            </View>

            <View style={styles.cardsGrid}>
              {CATEGORIAS.map((categoria) => (
                <Card
                  key={categoria.chave}
                  titulo={categoria.titulo}
                  valor={dados[categoria.chave]}
                  cor={categoria.cor}
                  icone={categoria.icone}
                />
              ))}
            </View>

            {/* GRÁFICO */}
            <View style={styles.secaoCabecalho}>
              <View style={styles.secaoIcone}>
                <MaterialIcons
                  name="show-chart"
                  size={22}
                  color="#8971D3"
                />
              </View>

              <View style={styles.secaoCabecalhoTexto}>
                <Text style={styles.secaoTitulo}>
                  Evolução das ocorrências
                </Text>
                <Text style={styles.secaoSubtitulo}>
                  Comparação por categoria
                </Text>
              </View>
            </View>

            <View style={styles.graficoCard}>
              <GraficoLinhas />
            </View>

            {/* LOCAIS */}
            <ResumoPorLocal />
          </>
        )}

        <View style={styles.rodape}>
          <MaterialIcons
            name="verified-user"
            size={15}
            color="#A0A5B5"
          />
          <Text style={styles.rodapeTexto}>
            SMC · Sistema de Monitoramento Colaborativo
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Card({ titulo, valor, cor, icone }) {
  return (
    <View style={styles.card}>
      <View style={[styles.cardIcone, { backgroundColor: `${cor}18` }]}>
        <MaterialIcons name={icone} size={21} color={cor} />
      </View>

      <Text style={styles.cardValor}>
        {Number(valor || 0).toLocaleString("pt-BR")}
      </Text>

      <Text style={styles.cardTitulo}>{titulo}</Text>

      <View style={[styles.cardLinha, { backgroundColor: cor }]} />
    </View>
  );
}

function Legenda({ cor, texto }) {
  return (
    <View style={styles.legendaItem}>
      <View style={[styles.legendaBolinha, { backgroundColor: cor }]} />
      <Text style={styles.legendaTexto}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },

  container: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 28,
  },

  topo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    gap: 11,
  },

  topoIcone: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#152D63",
    alignItems: "center",
    justifyContent: "center",
  },

  tituloContainer: {
    flex: 1,
  },

  titulo: {
    fontSize: 22,
    fontWeight: "800",
    color: "#152D63",
  },

  subtitulo: {
    fontSize: 12,
    color: "#858B9B",
    marginTop: 4,
  },

  botaoRecarregar: {
    width: 40,
    height: 40,
    backgroundColor: "#EEE9FF",
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  filtroArea: {
    marginBottom: 20,
  },

  filtroTituloLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },

  filtroLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "700",
  },

  filtrosLinha: {
    flexDirection: "row",
    gap: 9,
  },

  filtroBotao: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7E9F1",
  },

  filtroBotaoAtivo: {
    backgroundColor: "#7259B8",
    borderColor: "#7259B8",
  },

  filtroBotaoTexto: {
    fontSize: 12,
    fontWeight: "700",
    color: "#687186",
  },

  filtroBotaoTextoAtivo: {
    color: "#FFFFFF",
  },

  totalCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#152D63",
    borderRadius: 20,
    padding: 20,
    minHeight: 135,
    marginBottom: 24,
    overflow: "hidden",
  },

  totalTextoContainer: {
    flex: 1,
    zIndex: 1,
  },

  totalLegenda: {
    color: "#D6DDF1",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  totalValor: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
    marginTop: 5,
  },

  totalDescricao: {
    color: "#D6DDF1",
    fontSize: 12,
    marginTop: 2,
  },

  totalIcone: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.13)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  totalDecoracao: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(137,113,211,0.18)",
    right: 15,
    bottom: -85,
  },

  secaoCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
    gap: 11,
  },

  secaoIcone: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#EEE9FF",
    alignItems: "center",
    justifyContent: "center",
  },

  secaoCabecalhoTexto: {
    flex: 1,
  },

  secaoTitulo: {
    fontSize: 16,
    fontWeight: "800",
    color: "#152D63",
  },

  secaoSubtitulo: {
    fontSize: 11,
    color: "#8B93A3",
    marginTop: 4,
  },

  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 11,
    marginBottom: 25,
  },

  card: {
    width: "48.3%",
    minHeight: 126,
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#ECEEF5",
    padding: 13,
    overflow: "hidden",
  },

  cardIcone: {
    width: 37,
    height: 37,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  cardValor: {
    fontSize: 23,
    fontWeight: "800",
    color: "#24304A",
  },

  cardTitulo: {
    fontSize: 12,
    color: "#7B8497",
    fontWeight: "600",
    marginTop: 2,
  },

  cardLinha: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
  },

  graficoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    paddingVertical: 17,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#ECEEF5",
    marginBottom: 25,
  },

  graficoVazio: {
    minHeight: 190,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  graficoVazioIcone: {
    width: 57,
    height: 57,
    borderRadius: 19,
    backgroundColor: "#F0EBFF",
    alignItems: "center",
    justifyContent: "center",
  },

  graficoVazioTitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    marginTop: 12,
  },

  graficoVazioTexto: {
    fontSize: 12,
    color: "#8B93A3",
    textAlign: "center",
    lineHeight: 18,
    marginTop: 5,
  },

  legenda: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 13,
    marginTop: 8,
    paddingHorizontal: 6,
  },

  legendaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  legendaBolinha: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  legendaTexto: {
    fontSize: 10,
    color: "#687186",
    fontWeight: "600",
  },

  locaisContainer: {
    gap: 10,
    marginBottom: 10,
  },

  localCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ECEEF5",
  },

  localIcone: {
    width: 41,
    height: 41,
    borderRadius: 13,
    backgroundColor: "#F0EBFF",
    alignItems: "center",
    justifyContent: "center",
  },

  localInformacoes: {
    flex: 1,
  },

  localNome: {
    color: "#26324A",
    fontSize: 13,
    fontWeight: "700",
  },

  localDetalhes: {
    color: "#8B93A3",
    fontSize: 10,
    marginTop: 5,
  },

  barraFundo: {
    height: 4,
    backgroundColor: "#F0EDF8",
    borderRadius: 4,
    marginTop: 9,
    overflow: "hidden",
  },

  barraPreenchimento: {
    height: "100%",
    backgroundColor: "#8971D3",
    borderRadius: 4,
  },

  localContador: {
    minWidth: 47,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },

  localTotal: {
    fontSize: 19,
    fontWeight: "800",
    color: "#7259B8",
  },

  localLegenda: {
    fontSize: 9,
    color: "#8B93A3",
    marginTop: 2,
  },

  estadoLocal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ECEEF5",
  },

  estadoTitulo: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 10,
    textAlign: "center",
  },

  estadoTexto: {
    color: "#8B93A3",
    fontSize: 11,
    textAlign: "center",
    marginTop: 7,
    lineHeight: 17,
  },

  loaderContainer: {
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
  },

  loaderText: {
    marginTop: 12,
    color: "#858B9B",
    fontSize: 12,
  },

  rodape: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 22,
    paddingBottom: 12,
  },

  rodapeTexto: {
    color: "#A0A5B5",
    fontSize: 9,
    textAlign: "center",
  },
});
