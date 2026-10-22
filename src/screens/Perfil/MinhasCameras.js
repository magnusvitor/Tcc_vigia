import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MinhasCameras({ navigation }) {
  const [cameras, setCameras] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarCameras();
  }, []);

  const carregarCameras = async () => {
    try {
      setCarregando(true);

      const usuarioId = await AsyncStorage.getItem("usuario_id");

      if (!usuarioId) {
        Alert.alert("Erro", "Usuário não identificado.");
        setCameras([]);
        return;
      }

      const resposta = await fetch(
        `http://localhost/TCC/listar_minhas_cameras.php?usuario_id=${usuarioId}`
      );

      const data = await resposta.json();

      console.log("RESPOSTA CÂMERAS:", data);

      if (data.status === "sucesso") {
        setCameras(Array.isArray(data.cameras) ? data.cameras : []);
      } else {
        setCameras([]);

        Alert.alert(
          "Erro",
          data.mensagem || "Não foi possível carregar suas câmeras."
        );
      }
    } catch (error) {
      console.error("Erro ao carregar câmeras:", error);

      setCameras([]);

      Alert.alert(
        "Erro",
        "Não foi possível conectar ao servidor."
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Perfil")}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name="arrow-back"
            size={23}
            color="#152D63"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Minhas câmeras
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* CONTEÚDO */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {carregando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color="#745CD4"
            />

            <Text style={styles.loadingText}>
              Carregando câmeras...
            </Text>
          </View>

        ) : (
          <View style={styles.mainCard}>

            {cameras.length === 0 ? (

              <View style={styles.emptyContainer}>
                <View style={styles.emptyIcon}>
                  <MaterialIcons
                    name="videocam-off"
                    size={28}
                    color="#745CD4"
                  />
                </View>

                <Text style={styles.emptyTitle}>
                  Nenhuma câmera cadastrada
                </Text>

                <Text style={styles.emptyText}>
                  Cadastre uma câmera para acompanhar
                  suas informações por aqui.
                </Text>
              </View>

            ) : (

              cameras.map((camera, index) => {

                const isAtiva =
                  camera.status !== "Inativa" &&
                  camera.status !== "offline";

                return (
                  <View
                    key={camera.id || index}
                    style={[
                      styles.cameraRow,
                      index === cameras.length - 1 &&
                        styles.lastCameraRow,
                    ]}
                  >

                    {/* ÍCONE */}
                    <View
                      style={[
                        styles.iconContainer,
                        {
                          backgroundColor: isAtiva
                            ? "#ECFDF3"
                            : "#FEF2F2",
                        },
                      ]}
                    >
                      <MaterialIcons
                        name="videocam"
                        size={21}
                        color={
                          isAtiva
                            ? "#22C55E"
                            : "#EF4444"
                        }
                      />
                    </View>

                    {/* INFORMAÇÕES */}
                    <View style={styles.cameraInfo}>

                      <Text
                        style={styles.cameraTitle}
                        numberOfLines={1}
                      >
                        {camera.nome_camera ||
                          camera.nome ||
                          "Câmera sem nome"}
                      </Text>

                      <Text
                        style={styles.cameraSubtitle}
                        numberOfLines={1}
                      >
                        {camera.endereco ||
                          "Registro / SP"}
                      </Text>

                      <View style={styles.statusRow}>

                        <View
                          style={[
                            styles.statusDot,
                            {
                              backgroundColor: isAtiva
                                ? "#22C55E"
                                : "#EF4444",
                            },
                          ]}
                        />

                        <Text
                          style={[
                            styles.statusText,
                            {
                              color: isAtiva
                                ? "#16A34A"
                                : "#DC2626",
                            },
                          ]}
                        >
                          {isAtiva
                            ? "Ativa"
                            : "Inativa"}
                        </Text>

                      </View>

                    </View>

                    {/* MENU */}
                    <TouchableOpacity
                      style={styles.moreButton}
                      onPress={() =>
                        navigation.navigate(
                          "CadastrarCamera",
                          {
                            camera: camera,
                          }
                        )
                      }
                      activeOpacity={0.7}
                    >
                      <MaterialIcons
                        name="more-vert"
                        size={22}
                        color="#94A3B8"
                      />
                    </TouchableOpacity>

                  </View>
                );
              })
            )}

          </View>
        )}

      </ScrollView>

      {/* BOTÃO INFERIOR */}
      <View style={styles.bottomBar}>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            navigation.navigate("CadastrarCamera")
          }
          activeOpacity={0.85}
        >
          <MaterialIcons
            name="add"
            size={21}
            color="#FFFFFF"
          />

          <Text style={styles.buttonText}>
            Cadastrar câmera
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  /* HEADER */

  header: {
    height: 64,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECF2",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F4F6FA",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#152D63",
  },

  headerSpacer: {
    width: 40,
  },

  /* SCROLL */

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 110,
  },

  /* CARD */

  mainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E8ECF2",
    overflow: "hidden",
  },

  /* LOADING */

  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: "#64748B",
  },

  /* VAZIO */

  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 42,
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#F3F0FB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#152D63",
    marginBottom: 6,
    textAlign: "center",
  },

  emptyText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#718096",
    textAlign: "center",
  },

  /* CÂMERAS */

  cameraRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F5",
  },

  lastCameraRow: {
    borderBottomWidth: 0,
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  cameraInfo: {
    flex: 1,
    marginLeft: 13,
    marginRight: 8,
  },

  cameraTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 3,
  },

  cameraSubtitle: {
    fontSize: 12.5,
    color: "#718096",
    marginBottom: 6,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  moreButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  /* BOTÃO INFERIOR */

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: "#F8FAFC",
  },

  primaryButton: {
    height: 52,
    backgroundColor: "#745CD4",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 7,
  },

});