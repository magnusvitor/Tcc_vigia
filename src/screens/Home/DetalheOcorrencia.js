import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import { WebView } from "react-native-webview";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function DetalheOcorrencia() {
  const navigation = useNavigation();
  const route = useRoute();

  const ocorrencia =
    route.params?.ocorrencia ||
    route.params?.denuncia ||
    {};

  const tipo = route.params?.tipo || "denuncia";

  function obterCategoria(categoria) {
    const texto = (categoria || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (texto.includes("roubo")) {
      return {
        fundo: "#FEE2E2",
        cor: "#DC2626",
        icone: "alert-circle",
      };
    }

    if (texto.includes("furto")) {
      return {
        fundo: "#FEF3C7",
        cor: "#D97706",
        icone: "warning",
      };
    }

    if (texto.includes("homic")) {
      return {
        fundo: "#FEE2E2",
        cor: "#B91C1C",
        icone: "skull-outline",
      };
    }

    return {
      fundo: "#EEE9FF",
      cor: "#745CD4",
      icone: "information-circle",
    };
  }

  function obterStatus(status) {
    const texto = (status || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (
      texto.includes("resolvid") ||
      texto.includes("conclu") ||
      texto.includes("finaliz") ||
      texto.includes("solucion")
    ) {
      return {
        texto: "Resolvida",
        fundo: "#DCFCE7",
        cor: "#15803D",
        bolinha: "#22C55E",
      };
    }

    if (
      texto.includes("andamento") ||
      texto.includes("analise")
    ) {
      return {
        texto: "Em andamento",
        fundo: "#EDE9FE",
        cor: "#6D28D9",
        bolinha: "#8B5CF6",
      };
    }

    return {
      texto: "Pendente",
      fundo: "#FEF3C7",
      cor: "#B45309",
      bolinha: "#F59E0B",
    };
  }

  function formatarData(data) {
    if (!data) return "Não informada";

    const valor = String(data);
    const dataObj = new Date(valor.replace(" ", "T"));

    if (isNaN(dataObj.getTime())) {
      return valor;
    }

    return dataObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const categoria = obterCategoria(ocorrencia.categoria);
  const status = obterStatus(ocorrencia.status);
  const ehDenuncia = tipo === "denuncia";

  const local =
    ocorrencia.bairro ||
    ocorrencia.endereco ||
    "Local não informado";

  const latitude = Number(ocorrencia.latitude);
  const longitude = Number(ocorrencia.longitude);

  const coordenadasValidas =
    ocorrencia.latitude !== null &&
    ocorrencia.latitude !== undefined &&
    String(ocorrencia.latitude).trim() !== "" &&
    ocorrencia.longitude !== null &&
    ocorrencia.longitude !== undefined &&
    String(ocorrencia.longitude).trim() !== "" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

  // HTML usado pelo Leaflet dentro da WebView no Expo.
  const mapaHTML = useMemo(() => {
    if (!coordenadasValidas) return "";

    const corSegura = /^#[0-9A-Fa-f]{6}$/.test(categoria.cor)
      ? categoria.cor
      : "#745CD4";

    const categoriaSegura = JSON.stringify(
      String(ocorrencia.categoria || "Ocorrência")
    );

    const localSeguro = JSON.stringify(String(local));

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1">
        <link rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
        <style>
          html, body, #map {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }
          body { overflow: hidden; }
          .marcador-smc {
            width: 20px;
            height: 20px;
            border: 3px solid white;
            border-radius: 50%;
            background: ${corSegura};
            box-shadow: 0 2px 8px #0005;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          const lat = ${latitude};
          const lng = ${longitude};

          const mapa = L.map("map").setView([lat, lng], 16);

          L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              maxZoom: 19,
              attribution: "&copy; OpenStreetMap"
            }
          ).addTo(mapa);

          const icone = L.divIcon({
            className: "",
            html: '<div class="marcador-smc"></div>',
            iconSize: [26, 26],
            iconAnchor: [13, 13]
          });

          L.marker([lat, lng], { icon: icone })
            .addTo(mapa)
            .bindPopup(
              "<strong>" + ${categoriaSegura} + "</strong><br>" +
              ${localSeguro}
            );

          setTimeout(() => mapa.invalidateSize(), 250);
        </script>
      </body>
      </html>
    `;
  }, [
    coordenadasValidas,
    latitude,
    longitude,
    categoria.cor,
    ocorrencia.categoria,
    local,
  ]);

  function abrirGoogleMaps() {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url);
  }

  function renderizarMapa() {
    if (!coordenadasValidas) {
      return (
        <View style={styles.semLocalizacao}>
          <Ionicons
            name="location-outline"
            size={34}
            color="#8971D3"
          />

          <Text style={styles.semLocalizacaoTitulo}>
            Localização indisponível
          </Text>

          <Text style={styles.semLocalizacaoTexto}>
            Esta ocorrência não possui coordenadas válidas
            registradas no sistema.
          </Text>
        </View>
      );
    }

    if (Platform.OS === "web") {
      return (
        <View style={styles.mapaReal}>
          <MapContainer
            key={`${latitude}-${longitude}`}
            center={[latitude, longitude]}
            zoom={16}
            scrollWheelZoom
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <CircleMarker
              center={[latitude, longitude]}
              radius={10}
              pathOptions={{
                color: "#FFFFFF",
                weight: 3,
                fillColor: categoria.cor,
                fillOpacity: 1,
              }}
            >
              <Popup>
                <strong>
                  {ocorrencia.categoria || "Ocorrência"}
                </strong>
                <br />
                {local}
              </Popup>
            </CircleMarker>
          </MapContainer>
        </View>
      );
    }

    return (
      <View style={styles.mapaReal}>
        <WebView
          originWhitelist={["*"]}
          source={{ html: mapaHTML }}
          javaScriptEnabled
          domStorageEnabled
          scrollEnabled={false}
          style={styles.webview}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.voltar}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="#152D63"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitulo}>Detalhes</Text>

        <View style={styles.headerEspaco} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* CARD PRINCIPAL */}

        <View style={styles.cardPrincipal}>
          <View
            style={[
              styles.iconeCategoria,
              { backgroundColor: categoria.fundo },
            ]}
          >
            <Ionicons
              name={categoria.icone}
              size={32}
              color={categoria.cor}
            />
          </View>

          <View style={styles.principalInfo}>
            <Text style={styles.tipoPequeno}>
              {ehDenuncia ? "DENÚNCIA" : "OCORRÊNCIA"}
            </Text>

            <Text style={styles.tituloPrincipal}>
              {ocorrencia.categoria || "Ocorrência"}
            </Text>

            <View
              style={[
                styles.status,
                { backgroundColor: status.fundo },
              ]}
            >
              <View
                style={[
                  styles.statusBolinha,
                  { backgroundColor: status.bolinha },
                ]}
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
        </View>

        {/* PROTOCOLO */}

        <View style={styles.protocoloCard}>
          <View style={styles.protocoloIcone}>
            <Ionicons
              name="document-text-outline"
              size={20}
              color="#745CD4"
            />
          </View>

          <View style={styles.protocoloInfo}>
            <Text style={styles.protocoloLabel}>
              PROTOCOLO
            </Text>

            <Text style={styles.protocoloNumero}>
              {ocorrencia.protocolo || "Não informado"}
            </Text>
          </View>

          <Ionicons
            name="checkmark-circle"
            size={21}
            color="#22C55E"
          />
        </View>

        {/* INFORMAÇÕES */}

        <Text style={styles.tituloSecao}>Informações</Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <View style={styles.infoIcone}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#745CD4"
              />
            </View>

            <Text style={styles.infoLabel}>DATA</Text>

            <Text style={styles.infoValor}>
              {formatarData(
                ocorrencia.data_criacao ||
                ocorrencia.data_hora
              )}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIcone}>
              <Ionicons
                name="location-outline"
                size={20}
                color="#745CD4"
              />
            </View>

            <Text style={styles.infoLabel}>LOCAL</Text>

            <Text style={styles.infoValor} numberOfLines={2}>
              {local}
            </Text>
          </View>
        </View>

        {/* DESCRIÇÃO */}

        <Text style={styles.tituloSecao}>Descrição</Text>

        <View style={styles.descricaoCard}>
          <View style={styles.descricaoTopo}>
            <View style={styles.descricaoIcone}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={19}
                color="#745CD4"
              />
            </View>

            <Text style={styles.descricaoTitulo}>Relato</Text>
          </View>

          <Text style={styles.descricaoTexto}>
            {ocorrencia.descricao ||
              "Nenhuma descrição informada."}
          </Text>
        </View>

        {/* LOCALIZAÇÃO LEAFLET */}

        <Text style={styles.tituloSecao}>Localização</Text>

        <View style={styles.localCard}>
          {renderizarMapa()}

          {coordenadasValidas && (
            <View style={styles.localInfo}>
              <View style={styles.localTituloLinha}>
                <View
                  style={[
                    styles.marcadorLegenda,
                    { backgroundColor: categoria.cor },
                  ]}
                />

                <Text style={styles.localTitulo}>
                  {local}
                </Text>
              </View>

              <Text style={styles.localSubtitulo}>
                Local registrado para esta ocorrência
              </Text>

              <Text style={styles.coordenadas}>
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </Text>

              <TouchableOpacity
                style={styles.botaoMapa}
                onPress={abrirGoogleMaps}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="navigate-outline"
                  size={18}
                  color="#FFFFFF"
                />

                <Text style={styles.botaoMapaTexto}>
                  Abrir no Google Maps
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* AVISO */}

        <View style={styles.aviso}>
          <View style={styles.avisoIcone}>
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color="#745CD4"
            />
          </View>

          <View style={styles.avisoConteudo}>
            <Text style={styles.avisoTitulo}>
              Informação do SMC
            </Text>

            <Text style={styles.avisoTexto}>
              {ehDenuncia
                ? "Esta denúncia foi compartilhada pela comunidade e está sendo acompanhada pelo sistema."
                : "Esta ocorrência faz parte dos registros acompanhados pelo Sistema de Monitoramento Colaborativo."}
            </Text>
          </View>
        </View>

        {/* VOLTAR */}

        <TouchableOpacity
          style={styles.botaoVoltarPagina}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Ionicons
            name="arrow-back"
            size={19}
            color="#FFFFFF"
          />

          <Text style={styles.botaoVoltarTexto}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },

  header: {
    height: 76,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F5",
  },

  voltar: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#F2F4F9",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitulo: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#152D63",
    marginRight: 43,
  },

  headerEspaco: {
    width: 0,
  },

  scroll: {
    padding: 18,
    paddingBottom: 35,
  },

  cardPrincipal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
    shadowColor: "#152D63",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  iconeCategoria: {
    width: 67,
    height: 67,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  principalInfo: {
    flex: 1,
  },

  tipoPequeno: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#94A3B8",
    marginBottom: 3,
  },

  tituloPrincipal: {
    fontSize: 22,
    fontWeight: "800",
    color: "#152D63",
    marginBottom: 9,
  },

  status: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  statusBolinha: {
    width: 7,
    height: 7,
    borderRadius: 5,
    marginRight: 6,
  },

  statusTexto: {
    fontSize: 11,
    fontWeight: "700",
  },

  protocoloCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 23,
    shadowColor: "#152D63",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  protocoloIcone: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#F0ECFF",
    alignItems: "center",
    justifyContent: "center",
  },

  protocoloInfo: {
    flex: 1,
    marginLeft: 12,
  },

  protocoloLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#A0A7B5",
    letterSpacing: 0.8,
    marginBottom: 3,
  },

  protocoloNumero: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
  },

  tituloSecao: {
    fontSize: 16,
    fontWeight: "800",
    color: "#152D63",
    marginBottom: 11,
    marginTop: 2,
  },

  infoGrid: {
    flexDirection: "row",
    gap: 11,
    marginBottom: 23,
  },

  infoCard: {
    flex: 1,
    minHeight: 125,
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 15,
    shadowColor: "#152D63",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  infoIcone: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#F1EDFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  infoLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#A0A7B5",
    letterSpacing: 0.7,
    marginBottom: 4,
  },

  infoValor: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    color: "#334155",
  },

  descricaoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 17,
    marginBottom: 23,
    shadowColor: "#152D63",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  descricaoTopo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },

  descricaoIcone: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F1EDFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  descricaoTitulo: {
    fontSize: 13,
    fontWeight: "700",
    color: "#152D63",
  },

  descricaoTexto: {
    fontSize: 14,
    lineHeight: 22,
    color: "#64748B",
  },

  localCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 23,
    shadowColor: "#152D63",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  mapaReal: {
    width: "100%",
    height: 220,
  },

  webview: {
    flex: 1,
    backgroundColor: "#F0ECFF",
  },

  localInfo: {
    padding: 15,
  },

  localTituloLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },

  marcadorLegenda: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  localTitulo: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: "800",
    color: "#334155",
  },

  localSubtitulo: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 4,
  },

  coordenadas: {
    fontSize: 10,
    color: "#A0A7B5",
    marginTop: 8,
  },

  botaoMapa: {
    alignSelf: "flex-start",
    marginTop: 13,
    paddingVertical: 10,
    paddingHorizontal: 13,
    backgroundColor: "#152D63",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  botaoMapaTexto: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 7,
  },

  semLocalizacao: {
    minHeight: 190,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0ECFF",
  },

  semLocalizacaoTitulo: {
    fontSize: 15,
    fontWeight: "800",
    color: "#152D63",
    marginTop: 12,
    marginBottom: 6,
  },

  semLocalizacaoTexto: {
    fontSize: 12,
    lineHeight: 18,
    color: "#667085",
    textAlign: "center",
  },

  aviso: {
    backgroundColor: "#F0ECFF",
    borderRadius: 17,
    padding: 14,
    flexDirection: "row",
    marginBottom: 18,
  },

  avisoIcone: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  avisoConteudo: {
    flex: 1,
    marginLeft: 10,
  },

  avisoTitulo: {
    fontSize: 12,
    fontWeight: "800",
    color: "#5E4DB0",
    marginBottom: 3,
  },

  avisoTexto: {
    fontSize: 11,
    lineHeight: 17,
    color: "#746E8A",
  },

  botaoVoltarPagina: {
    height: 52,
    borderRadius: 15,
    backgroundColor: "#152D63",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
  },

  botaoVoltarTexto: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
  },
});