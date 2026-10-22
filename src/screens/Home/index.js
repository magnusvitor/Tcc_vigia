
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";

const API = "http://localhost/TCC";

const telasSMC = [
  {
    titulo: "Mapa de ocorrências",
    descricao: "Visualize os registros por localização.",
    icone: "map-outline",
    cor: "#E8E2F7",
    corIcone: "#7259B8",
    rota: "Mapa",
    imagem: null,
  },
  {
    titulo: "Denúncias",
    descricao: "Consulte e acompanhe os registros.",
    icone: "document-text-outline",
    cor: "#E4EAF8",
    corIcone: "#2E5AAC",
    rota: "MinhasDenuncias",
    imagem: null,
  },
  {
    titulo: "Chat comunitário",
    descricao: "Conecte-se com sua comunidade.",
    icone: "people-outline",
    cor: "#F1E7F8",
    corIcone: "#8971D3",
    rota: "MinhasComunidades",
    imagem: null,
  },
];

export default function Home() {
  const navigation = useNavigation();

  const [denuncias, setDenuncias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState(false);

  const carregarDenuncias = useCallback(async () => {
    try {
      setErro(false);

      const resposta = await fetch(`${API}/listar_denuncias.php`);

      if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
      }

      const texto = await resposta.text();
      const dados = JSON.parse(texto);

      if (dados?.sucesso && Array.isArray(dados.denuncias)) {
        setDenuncias(dados.denuncias.slice(0, 5));
      } else {
        setDenuncias([]);
      }
    } catch (e) {
      console.log("Erro ao carregar denúncias:", e);
      setDenuncias([]);
      setErro(true);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarDenuncias();
    }, [carregarDenuncias])
  );

  const atualizar = () => {
    setAtualizando(true);
    carregarDenuncias();
  };

  function normalizar(valor) {
    return String(valor || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
  }

  function obterCategoria(categoria) {
    const tipo = normalizar(categoria);

    if (tipo.includes("homic")) {
      return { fundo: "#FCE8E8", cor: "#C62828", icone: "alert-circle-outline" };
    }

    if (tipo.includes("roubo")) {
      return { fundo: "#FCE8E8", cor: "#D93445", icone: "alert-circle-outline" };
    }

    if (tipo.includes("furto")) {
      return { fundo: "#FFF0D9", cor: "#A86008", icone: "warning-outline" };
    }

    if (tipo.includes("violencia")) {
      return { fundo: "#EEE8FA", cor: "#7259B8", icone: "hand-left-outline" };
    }

    return {
      fundo: "#E7EDFA",
      cor: "#2E5AAC",
      icone: "information-circle-outline",
    };
  }

  function formatarDataHora(valor) {
    if (!valor) {
      return { data: "DATA NÃO INFORMADA", hora: "HORA NÃO INFORMADA" };
    }

    const texto = String(valor).trim();
    const dataObj = new Date(
      texto.includes("T") ? texto : texto.replace(" ", "T")
    );

    if (isNaN(dataObj.getTime())) {
      return {
        data: texto.toUpperCase(),
        hora: "HORA NÃO INFORMADA",
      };
    }

    return {
      data: dataObj.toLocaleDateString("pt-BR").toUpperCase(),
      hora: dataObj.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).toUpperCase(),
    };
  }

  function obterProtocolo(item) {
    return String(
      item.protocolo || item.numero_protocolo || "NÃO INFORMADO"
    ).toUpperCase();
  }

  const bairrosInformados = denuncias.filter(
    (item) => String(item.bairro || item.local || "").trim() !== ""
  ).length;

  const categoriasDiferentes = new Set(
    denuncias
      .map((item) => normalizar(item.categoria))
      .filter(Boolean)
  ).size;

  function irParaDenuncias() {
    navigation.navigate("MinhasDenuncias");
  }

  function irParaMapa() {
    navigation.navigate("Mapa");
  }

  function abrirTela(tela) {
    if (tela.rota === "MinhasComunidades") {
      navigation.navigate("MinhasComunidades");
      return;
    }

    navigation.navigate(tela.rota);
  }

  function abrirDetalhe(item) {
    navigation.navigate("DetalheOcorrencia", {
      ocorrencia: item,
      tipo: "denuncia",
    });
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={atualizando}
          onRefresh={atualizar}
          colors={["#8971D3"]}
          tintColor="#8971D3"
        />
      }
    >
      {/* CABEÇALHO PRINCIPAL */}
      <View style={styles.topo}>
        <View style={styles.marca}>
          <View style={styles.marcaIcone}>
            <Ionicons name="shield-checkmark" size={22} color="#FFFFFF" />
          </View>

          <View>
            <Text style={styles.marcaTitulo}>Central de segurança</Text>
            <Text style={styles.marcaSubtitulo}>
              Informação que aproxima.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.botaoTopo}
          onPress={irParaDenuncias}
          activeOpacity={0.8}
        >
          <Ionicons name="document-text-outline" size={21} color="#7259B8" />
        </TouchableOpacity>
      </View>

      {/* BANNER */}
      <View style={styles.banner}>
        <View style={styles.bannerTexto}>
          <View style={styles.etiqueta}>
            <View style={styles.pontoEtiqueta} />
            <Text style={styles.etiquetaTexto}>SEGURANÇA COLABORATIVA</Text>
          </View>

          <Text style={styles.bannerTitulo}>
            Informação que fortalece a segurança.
          </Text>

          <Text style={styles.bannerDescricao}>
            Comunidade e autoridades conectadas por uma cidade mais segura.
          </Text>

          <TouchableOpacity
            style={styles.bannerBotao}
            onPress={irParaDenuncias}
            activeOpacity={0.85}
          >
            <Text style={styles.bannerBotaoTexto}>Registrar denúncia</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.bannerIlustracao}>
          <View style={styles.bannerCirculoExterno}>
            <View style={styles.bannerCirculoInterno}>
              <Ionicons
                name="shield-checkmark"
                size={48}
                color="#FFFFFF"
              />
            </View>
          </View>
          <View style={styles.bannerSelo}>
            <Ionicons name="people" size={16} color="#7259B8" />
          </View>
        </View>
      </View>

      {/* MÉTRICAS COMPACTAS */}
      <View style={styles.metricas}>
        <View style={styles.metricaCard}>
          <View style={[styles.metricaIcone, { backgroundColor: "#EEE8FA" }]}>
            <Ionicons name="document-text-outline" size={18} color="#7259B8" />
          </View>
          <Text style={styles.metricaNumero}>
            {carregando ? "—" : denuncias.length}
          </Text>
          <Text style={styles.metricaTitulo}>Denúncias</Text>
          <Text style={styles.metricaLegenda}>Exibidas</Text>
        </View>

        <View style={styles.metricaCard}>
          <View style={[styles.metricaIcone, { backgroundColor: "#E7EDFA" }]}>
            <Ionicons name="location-outline" size={18} color="#2E5AAC" />
          </View>
          <Text style={styles.metricaNumero}>
            {carregando ? "—" : bairrosInformados}
          </Text>
          <Text style={styles.metricaTitulo}>Com local</Text>
          <Text style={styles.metricaLegenda}>Informado</Text>
        </View>

        <View style={styles.metricaCard}>
          <View style={[styles.metricaIcone, { backgroundColor: "#F4E8F8" }]}>
            <Ionicons name="layers-outline" size={18} color="#8971D3" />
          </View>
          <Text style={styles.metricaNumero}>
            {carregando ? "—" : categoriasDiferentes}
          </Text>
          <Text style={styles.metricaTitulo}>Categorias</Text>
          <Text style={styles.metricaLegenda}>Diferentes</Text>
        </View>
      </View>

      {/* CONHEÇA O SMC */}
      <View style={styles.secaoCabecalho}>
        <View style={styles.secaoCabecalhoTexto}>
          <Text style={styles.tituloSecao}>Conheça o SMC</Text>
          <Text style={styles.subtituloSecao}>
            Recursos para uma comunidade conectada.
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recursosLista}
      >
        {telasSMC.map((tela) => (
          <TouchableOpacity
            key={tela.titulo}
            style={styles.recursoCard}
            activeOpacity={0.85}
            onPress={() => abrirTela(tela)}
          >
            <View style={styles.recursoTopo}>
              <View
                style={[
                  styles.recursoIcone,
                  { backgroundColor: tela.cor },
                ]}
              >
                <Ionicons
                  name={tela.icone}
                  size={23}
                  color={tela.corIcone}
                />
              </View>

              <Ionicons
                name="arrow-up-forward-outline"
                size={16}
                color="#9A94AA"
              />
            </View>

            <Text style={styles.recursoTitulo}>{tela.titulo}</Text>
            <Text style={styles.recursoDescricao}>{tela.descricao}</Text>

            <View style={styles.recursoRodape}>
              <Text style={styles.recursoLink}>Explorar</Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color="#7259B8"
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* DENÚNCIAS RECENTES */}
      <View style={styles.secaoCabecalho}>
        <View style={styles.secaoCabecalhoTexto}>
          <Text style={styles.tituloSecao}>Denúncias recentes</Text>
          <Text style={styles.subtituloSecao}>
            Os últimos registros recebidos.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.verTodas}
          onPress={irParaDenuncias}
          activeOpacity={0.8}
        >
          <Text style={styles.verTodasTexto}>Ver mais</Text>
          <Ionicons name="arrow-forward" size={14} color="#7259B8" />
        </TouchableOpacity>
      </View>

      {carregando ? (
        <View style={styles.estado}>
          <ActivityIndicator size="small" color="#8971D3" />
          <Text style={styles.estadoTexto}>Carregando denúncias...</Text>
        </View>
      ) : erro ? (
        <View style={styles.estadoVazio}>
          <View style={styles.estadoIcone}>
            <Ionicons
              name="cloud-offline-outline"
              size={25}
              color="#7259B8"
            />
          </View>
          <Text style={styles.estadoTitulo}>Não foi possível carregar</Text>
          <Text style={styles.estadoTexto}>
            Verifique sua conexão com o servidor e tente novamente.
          </Text>
          <TouchableOpacity
            style={styles.botaoRepetir}
            onPress={carregarDenuncias}
          >
            <Ionicons name="refresh-outline" size={16} color="#FFFFFF" />
            <Text style={styles.botaoRepetirTexto}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : denuncias.length === 0 ? (
        <View style={styles.estadoVazio}>
          <View style={styles.estadoIcone}>
            <Ionicons
              name="document-text-outline"
              size={25}
              color="#7259B8"
            />
          </View>
          <Text style={styles.estadoTitulo}>Nenhuma denúncia recente</Text>
          <Text style={styles.estadoTexto}>
            Os registros aparecerão aqui quando estiverem disponíveis.
          </Text>
          <TouchableOpacity
            style={styles.botaoRepetir}
            onPress={irParaDenuncias}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.botaoRepetirTexto}>Registrar denúncia</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.lista}>
          {denuncias.map((item, indice) => {
            const estilo = obterCategoria(item.categoria);
            const { data, hora } = formatarDataHora(
              item.data_criacao || item.data
            );
            const protocolo = obterProtocolo(item);
            const local = String(
              item.bairro || item.local || "LOCAL NÃO INFORMADO"
            ).toUpperCase();

            return (
              <TouchableOpacity
                key={String(item.id ?? item.protocolo ?? indice)}
                style={styles.denunciaCard}
                activeOpacity={0.85}
                onPress={() => abrirDetalhe(item)}
              >
                <View
                  style={[
                    styles.denunciaIcone,
                    { backgroundColor: estilo.fundo },
                  ]}
                >
                  <Ionicons
                    name={estilo.icone}
                    size={20}
                    color={estilo.cor}
                  />
                </View>

                <View style={styles.denunciaConteudo}>
                  <View style={styles.denunciaCabecalho}>
                    <View
                      style={[
                        styles.categoriaTag,
                        { backgroundColor: estilo.fundo },
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoriaTagTexto,
                          { color: estilo.cor },
                        ]}
                        numberOfLines={1}
                      >
                        {String(item.categoria || "OCORRÊNCIA").toUpperCase()}
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={17}
                      color="#A6A0B2"
                    />
                  </View>

                  <Text style={styles.protocoloTexto} numberOfLines={1}>
                    PROTOCOLO: {protocolo}
                  </Text>

                  <Text style={styles.denunciaDescricao} numberOfLines={2}>
                    {item.descricao || "Nenhuma descrição informada."}
                  </Text>

                  <View style={styles.infoLinha}>
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color="#81759C"
                    />
                    <Text style={styles.infoTexto}>{data}</Text>

                    <View style={styles.infoSeparador} />

                    <Ionicons
                      name="time-outline"
                      size={14}
                      color="#81759C"
                    />
                    <Text style={styles.infoTexto}>{hora}</Text>
                  </View>

                  <View style={styles.infoLinha}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#81759C"
                    />
                    <Text style={styles.infoLocal} numberOfLines={1}>
                      {local}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* RODAPÉ */}
      <View style={styles.rodape}>
        <Ionicons
          name="shield-checkmark-outline"
          size={15}
          color="#A5A0B2"
        />
        <Text style={styles.rodapeTexto}>
          Sistema de Monitoramento Colaborativo
        </Text>
      </View>
    </ScrollView>
  );
}
