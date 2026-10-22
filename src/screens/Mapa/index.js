import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "./styles";

const API = "http://localhost/TCC";

const REGISTRO_SP = {
  latitude: -24.4882,
  longitude: -47.8431,
};

const LIMITES_REGISTRO = {
  norte: -24.43,
  sul: -24.55,
  leste: -47.78,
  oeste: -47.91,
};

const CATEGORIAS = [
  { nome: "Todos", icone: "apps", cor: "#7259B8" },
  { nome: "Roubo", icone: "report-problem", cor: "#E34B53" },
  { nome: "Furto", icone: "lock-open", cor: "#D58A1C" },
  { nome: "Homicídio", icone: "warning", cor: "#963D55" },
  { nome: "Outros", icone: "more-horiz", cor: "#64748B" },
];

function normalizar(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function Mapa() {
  const [filtroAtivo, setFiltroAtivo] = useState("Todos");
  const [denuncias, setDenuncias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);
  const [legendaAberta, setLegendaAberta] = useState(false);

  const carregarDenuncias = useCallback(async (silencioso = false) => {
    try {
      if (!silencioso) setCarregando(true);
      setErro("");

      const resposta = await fetch(`${API}/listar_denuncias.php`);
      const texto = await resposta.text();

      console.log("Status da API:", resposta.status);
      console.log("Resposta do PHP:", texto);

      if (!resposta.ok) {
        throw new Error(`Erro HTTP ${resposta.status}: ${texto}`);
      }

      let resultado;

      try {
        resultado = JSON.parse(texto);
      } catch {
        throw new Error("O PHP não retornou um JSON válido.");
      }

      if (
        resultado.sucesso === true &&
        Array.isArray(resultado.denuncias)
      ) {
        setDenuncias(resultado.denuncias);
      } else {
        throw new Error(
          resultado.mensagem || "Não foi possível listar as denúncias."
        );
      }
    } catch (error) {
      console.error("Erro ao carregar denúncias:", error);
      setErro(error.message || "Não foi possível conectar à API.");
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    carregarDenuncias();
  }, [carregarDenuncias]);

  const atualizar = useCallback(() => {
    setAtualizando(true);
    carregarDenuncias(true);
  }, [carregarDenuncias]);

  const denunciasFiltradas = useMemo(() => {
    return denuncias.filter((item) => {
      const categoria = normalizar(item.categoria);

      if (filtroAtivo === "Todos") return true;
      if (filtroAtivo === "Roubo") return categoria.includes("roubo");
      if (filtroAtivo === "Furto") return categoria.includes("furto");
      if (filtroAtivo === "Homicídio") {
        return categoria.includes("homicidio");
      }

      if (filtroAtivo === "Outros") {
        return (
          !categoria.includes("roubo") &&
          !categoria.includes("furto") &&
          !categoria.includes("homicidio")
        );
      }

      return true;
    });
  }, [denuncias, filtroAtivo]);

  const pontos = useMemo(() => {
    return denunciasFiltradas
      .map((item, index) => {
        if (
          item.latitude == null ||
          item.longitude == null ||
          item.latitude === "" ||
          item.longitude === ""
        ) {
          return null;
        }

        const latitude = Number(item.latitude);
        const longitude = Number(item.longitude);

        if (
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude) ||
          latitude < -90 ||
          latitude > 90 ||
          longitude < -180 ||
          longitude > 180
        ) {
          return null;
        }

        return {
          id: String(item.id || item.protocolo || index),
          latitude,
          longitude,
          categoria: item.categoria || "Denúncia",
          bairro: item.bairro || "Local não informado",
          descricao: item.descricao || "Nenhuma descrição informada.",
          protocolo: item.protocolo || "Não informado",
        };
      })
      .filter(Boolean);
  }, [denunciasFiltradas]);

  const mapaHTML = useMemo(() => {
    const pontosJSON = JSON.stringify(pontos);

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<link rel="stylesheet"
 href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">

<style>
* { box-sizing: border-box; }

html, body, #map {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  overflow: hidden;
  background: #F7F7FB;
}

.leaflet-control-zoom {
  border: none !important;
  border-radius: 10px !important;
  overflow: hidden;
  box-shadow: 0 3px 12px rgba(21,45,99,.15) !important;
}

.leaflet-control-zoom a {
  color: #7259B8 !important;
  border: none !important;
}

.leaflet-control-attribution {
  font-size: 8px !important;
  background: rgba(255,255,255,.9) !important;
}

.leaflet-popup-content-wrapper {
  border-radius: 14px;
  box-shadow: 0 8px 25px rgba(21,45,99,.18);
}

.leaflet-popup-content {
  margin: 13px;
  min-width: 175px;
  max-width: 240px;
}

.popup-tag {
  display: inline-block;
  padding: 5px 9px;
  border-radius: 7px;
  font-size: 11px;
  font-weight: bold;
  margin-bottom: 8px;
}

.popup-title {
  color: #292442;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
}

.popup-detail {
  color: #64748B;
  font-size: 11px;
  line-height: 1.5;
  margin-bottom: 5px;
  overflow-wrap: anywhere;
}

.popup-protocol {
  color: #94A3B8;
  font-size: 9px;
  border-top: 1px solid #E9EAF0;
  padding-top: 8px;
  margin-top: 8px;
  overflow-wrap: anywhere;
}
</style>
</head>

<body>
<div id="map"></div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet.heat/dist/leaflet-heat.js"></script>

<script>
(function() {
  const denuncias = ${pontosJSON};

  const REGISTRO = [
    ${REGISTRO_SP.latitude},
    ${REGISTRO_SP.longitude}
  ];

  const LIMITES = [
    [${LIMITES_REGISTRO.sul}, ${LIMITES_REGISTRO.oeste}],
    [${LIMITES_REGISTRO.norte}, ${LIMITES_REGISTRO.leste}]
  ];

  const map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: true,
    maxBounds: LIMITES,
    maxBoundsViscosity: 0.85,
    minZoom: 12,
    maxZoom: 18
  }).setView(REGISTRO, 14);

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
  ).addTo(map);

  const limitesPontos = [];

  if (denuncias.length > 0 && typeof L.heatLayer === "function") {
    const pontosCalor = denuncias.map(function(item) {
      return [item.latitude, item.longitude, 0.7];
    });

    L.heatLayer(pontosCalor, {
      radius: 34,
      blur: 24,
      maxZoom: 17,
      minOpacity: 0.2,
      gradient: {
        0.15: "#8971D3",
        0.4: "#6366F1",
        0.65: "#FACC15",
        0.82: "#F97316",
        1.0: "#EF4444"
      }
    }).addTo(map);
  }

  function adicionarTexto(elemento, classe, texto) {
    elemento.className = classe;
    elemento.textContent = texto;
    return elemento;
  }

  denuncias.forEach(function(item) {
    const categoria = String(item.categoria || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\\u0300-\\u036f]/g, "");

    let cor = "#7259B8";
    let fundo = "#EEE9FF";

    if (categoria.includes("roubo")) {
      cor = "#E34B53";
      fundo = "#FCE8EA";
    } else if (categoria.includes("furto")) {
      cor = "#D58A1C";
      fundo = "#FFF2D9";
    } else if (categoria.includes("homicidio")) {
      cor = "#963D55";
      fundo = "#F8E6EC";
    }

    const ponto = L.circleMarker(
      [item.latitude, item.longitude],
      {
        radius: 8,
        color: "#FFFFFF",
        weight: 2.5,
        fillColor: cor,
        fillOpacity: 1
      }
    ).addTo(map);

    const popup = document.createElement("div");

    const etiqueta = adicionarTexto(
      document.createElement("div"),
      "popup-tag",
      item.categoria
    );

    etiqueta.style.backgroundColor = fundo;
    etiqueta.style.color = cor;

    const titulo = adicionarTexto(
      document.createElement("div"),
      "popup-title",
      "Denúncia registrada"
    );

    const bairro = adicionarTexto(
      document.createElement("div"),
      "popup-detail",
      "Local: " + item.bairro
    );

    const descricao = adicionarTexto(
      document.createElement("div"),
      "popup-detail",
      item.descricao
    );

    const protocolo = adicionarTexto(
      document.createElement("div"),
      "popup-protocol",
      "Protocolo: " + item.protocolo
    );

    popup.appendChild(etiqueta);
    popup.appendChild(titulo);
    popup.appendChild(bairro);
    popup.appendChild(descricao);
    popup.appendChild(protocolo);

    ponto.bindPopup(popup);
    limitesPontos.push([item.latitude, item.longitude]);
  });

  if (limitesPontos.length > 0) {
    map.fitBounds(L.latLngBounds(limitesPontos), {
      padding: [35, 35],
      maxZoom: 16
    });
  } else {
    map.setView(REGISTRO, 14);
  }

  setTimeout(function() {
    map.invalidateSize();
  }, 300);
})();
</script>
</body>
</html>`;
  }, [pontos]);

  const totalFiltrado = denunciasFiltradas.length;
  const totalLocalizadas = pontos.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
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
        <View style={styles.header}>
          <View style={styles.headerTexto}>
            <Text style={styles.titulo}>Mapa de denúncias</Text>
            <Text style={styles.subtitulo}>
              Acompanhe os registros da sua região
            </Text>
          </View>

          <TouchableOpacity
            style={styles.botaoIcone}
            onPress={atualizar}
            activeOpacity={0.7}
            accessibilityLabel="Atualizar mapa"
          >
            <MaterialIcons name="refresh" size={23} color="#7259B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoIcone}
            onPress={() => setMenuAberto((aberto) => !aberto)}
            activeOpacity={0.7}
            accessibilityLabel="Abrir menu"
          >
            <MaterialIcons
              name={menuAberto ? "close" : "more-vert"}
              size={24}
              color="#7259B8"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.resumoCard}>
          <View style={styles.resumoIcone}>
            <MaterialIcons name="location-on" size={25} color="#7259B8" />
          </View>

          <View style={styles.resumoTexto}>
            <Text style={styles.resumoTitulo}>Registros localizados</Text>
            <Text style={styles.resumoNumero}>{totalLocalizadas}</Text>
            <Text style={styles.resumoDescricao}>
              {totalFiltrado} denúncia(s) no filtro atual
            </Text>
          </View>

          <View style={styles.resumoSelo}>
            <MaterialIcons name="map" size={17} color="#7259B8" />
            <Text style={styles.resumoSeloTexto}>Registro-SP</Text>
          </View>
        </View>

        {menuAberto && (
          <View style={styles.menuCard}>
            <Text style={styles.menuTitulo}>Opções do mapa</Text>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setFiltroAtivo("Todos");
                setMenuAberto(false);
              }}
              activeOpacity={0.7}
            >
              <MaterialIcons name="filter-alt-off" size={20} color="#7259B8" />
              <View style={styles.menuInformacao}>
                <Text style={styles.menuTexto}>Limpar filtros</Text>
                <Text style={styles.menuDescricao}>
                  Mostrar todas as categorias
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={21} color="#A5A0B5" />
            </TouchableOpacity>

            <View style={styles.menuItem}>
              <MaterialIcons name="whatshot" size={20} color="#E9A23B" />
              <View style={styles.menuInformacao}>
                <Text style={styles.menuTexto}>Mapa de calor</Text>
                <Text style={styles.menuDescricao}>
                  As áreas coloridas indicam concentração de registros, não
                  uma classificação oficial de risco.
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.secaoCabecalho}>
          <Text style={styles.secaoTitulo}>Categorias</Text>
          <Text style={styles.secaoSubtitulo}>
            Selecione uma categoria para filtrar
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtrosLinha}
        >
          {CATEGORIAS.map((categoria) => {
            const ativo = filtroAtivo === categoria.nome;

            return (
              <TouchableOpacity
                key={categoria.nome}
                style={[
                  styles.filtroBotao,
                  ativo && styles.filtroBotaoAtivo,
                  !ativo && { borderColor: `${categoria.cor}35` },
                ]}
                onPress={() => setFiltroAtivo(categoria.nome)}
                activeOpacity={0.75}
              >
                <MaterialIcons
                  name={categoria.icone}
                  size={17}
                  color={ativo ? "#FFFFFF" : categoria.cor}
                />
                <Text
                  style={[
                    styles.filtroTexto,
                    ativo && styles.filtroTextoAtivo,
                  ]}
                >
                  {categoria.nome}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.mapaCabecalho}>
          <View>
            <Text style={styles.secaoTitulo}>Mapa interativo</Text>
            <Text style={styles.secaoSubtitulo}>
              Toque nos pontos para ver os detalhes
            </Text>
          </View>

          <TouchableOpacity
            style={styles.mapaIndicador}
            onPress={atualizar}
            activeOpacity={0.7}
          >
            <View style={styles.statusBolinha} />
            <Text style={styles.mapaIndicadorTexto}>
              {carregando ? "Carregando" : erro ? "Erro" : "Atualizar"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mapFrameBox}>
          {carregando ? (
            <View style={styles.estadoMapa}>
              <ActivityIndicator size="large" color="#8971D3" />
              <Text style={styles.estadoTitulo}>Carregando mapa...</Text>
            </View>
          ) : erro ? (
            <View style={styles.estadoMapa}>
              <MaterialIcons name="cloud-off" size={38} color="#8971D3" />
              <Text style={styles.estadoTitulo}>
                Não foi possível carregar os registros
              </Text>
              <Text style={styles.estadoDescricao}>
                {erro.length > 180 ? `${erro.slice(0, 180)}...` : erro}
              </Text>
              <TouchableOpacity
                style={styles.tentarBotao}
                onPress={() => carregarDenuncias()}
                activeOpacity={0.8}
              >
                <Text style={styles.tentarTexto}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : Platform.OS === "web" ? (
            <iframe
              key={`${filtroAtivo}-${pontos.length}-${mapaHTML.length}`}
              title="Mapa de denúncias SMC"
              srcDoc={mapaHTML}
              width="100%"
              height="100%"
              style={{ border: "none", display: "block" }}
            />
          ) : (
            <View style={styles.estadoMapa}>
              <MaterialIcons name="map" size={40} color="#8971D3" />
              <Text style={styles.estadoTitulo}>
                Mapa disponível na versão Web
              </Text>
              <Text style={styles.estadoDescricao}>
                O mapa utiliza Leaflet e OpenStreetMap.
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.legendaBotao}
          onPress={() => setLegendaAberta((aberta) => !aberta)}
          activeOpacity={0.7}
        >
          <View style={styles.legendaBotaoIcone}>
            <MaterialIcons name="info-outline" size={20} color="#7259B8" />
          </View>

          <View style={styles.legendaBotaoTexto}>
            <Text style={styles.menuTexto}>Legenda do mapa</Text>
            <Text style={styles.menuDescricao}>
              Entenda as cores dos marcadores
            </Text>
          </View>

          <MaterialIcons
            name={legendaAberta ? "expand-less" : "expand-more"}
            size={23}
            color="#7259B8"
          />
        </TouchableOpacity>

        {legendaAberta && (
          <View style={styles.legendaCard}>
            {CATEGORIAS.filter((item) => item.nome !== "Todos").map(
              (categoria) => (
                <View key={categoria.nome} style={styles.legendaItem}>
                  <View
                    style={[
                      styles.legendaPonto,
                      { backgroundColor: categoria.cor },
                    ]}
                  />
                  <Text style={styles.legendaTexto}>{categoria.nome}</Text>
                </View>
              )
            )}
          </View>
        )}

        <Text style={styles.rodapeTexto}>
          SMC · Sistema de Monitoramento Colaborativo
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}