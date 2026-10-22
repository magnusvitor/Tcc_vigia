import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
  ActivityIndicator,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CadastrarCamera({ navigation }) {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [tipo, setTipo] = useState("webcam");
  const [urlStream, setUrlStream] = useState("");
  const [nivelAcesso, setNivelAcesso] = useState("privada");
  const [compartilhada, setCompartilhada] = useState(true);
  const [carregando, setCarregando] = useState(false);

  const cadastrarCamera = async () => {
    if (!nome.trim()) {
      Alert.alert("Atenção", "Digite o nome da câmera.");
      return;
    }

    if (!latitude.trim() || !longitude.trim()) {
      Alert.alert(
        "Atenção",
        "Digite a latitude e a longitude da câmera."
      );
      return;
    }

    const latitudeNumero = Number(
      latitude.replace(",", ".")
    );

    const longitudeNumero = Number(
      longitude.replace(",", ".")
    );

    if (
      Number.isNaN(latitudeNumero) ||
      Number.isNaN(longitudeNumero)
    ) {
      Alert.alert(
        "Atenção",
        "Digite valores válidos para latitude e longitude."
      );
      return;
    }

    try {
      setCarregando(true);

      const usuarioId =
        await AsyncStorage.getItem("usuario_id");

      if (!usuarioId) {
        Alert.alert(
          "Erro",
          "Usuário não identificado. Faça login novamente."
        );
        return;
      }

      const dados = {
        usuario_id: Number(usuarioId),
        nome: nome.trim(),
        latitude: latitudeNumero,
        longitude: longitudeNumero,
        endereco: endereco.trim(),
        compartilhada: compartilhada ? 1 : 0,
        tipo: tipo,
        url_stream: urlStream.trim(),
        nivel_acesso: compartilhada
          ? nivelAcesso
          : "privada",
      };

      console.log("Dados enviados:", dados);

      const resposta = await fetch(
        "http://localhost/TCC/cadastrar_camera.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dados),
        }
      );

      const texto = await resposta.text();

      console.log("Resposta do PHP:", texto);

      let resultado;

      try {
        resultado = JSON.parse(texto);
      } catch (erro) {
        console.log("JSON inválido:", erro);

        Alert.alert(
          "Erro",
          "O servidor retornou uma resposta inválida."
        );

        return;
      }

      if (resultado.sucesso) {
        Alert.alert(
          "Câmera cadastrada",
          "A câmera foi cadastrada com sucesso.",
          [
            {
              text: "OK",
              onPress: () =>
                navigation.navigate("MinhasCameras"),
            },
          ]
        );

        setNome("");
        setEndereco("");
        setLatitude("");
        setLongitude("");
        setUrlStream("");
      } else {
        Alert.alert(
          "Erro",
          resultado.mensagem ||
            "Não foi possível cadastrar a câmera."
        );
      }
    } catch (erro) {
      console.log("Erro:", erro);

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
          onPress={() =>
            navigation.navigate("MinhasCameras")
          }
          activeOpacity={0.8}
        >
          <MaterialIcons
            name="arrow-back"
            size={23}
            color="#152D63"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Cadastrar câmera
        </Text>

        <View style={styles.headerSpacer} />

      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* INFORMAÇÕES BÁSICAS */}
        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Informações da câmera
          </Text>

          <Text style={styles.label}>
            Nome da câmera
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: Câmera da frente"
            placeholderTextColor="#94A3B8"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>
            Endereço
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: Rua São Paulo, 100"
            placeholderTextColor="#94A3B8"
            value={endereco}
            onChangeText={setEndereco}
          />

          <View style={styles.row}>

            <View style={styles.halfInput}>
              <Text style={styles.label}>
                Latitude
              </Text>

              <TextInput
                style={styles.input}
                placeholder="-24.487500"
                placeholderTextColor="#94A3B8"
                keyboardType="decimal-pad"
                value={latitude}
                onChangeText={setLatitude}
              />
            </View>

            <View style={styles.halfInput}>
              <Text style={styles.label}>
                Longitude
              </Text>

              <TextInput
                style={styles.input}
                placeholder="-47.843200"
                placeholderTextColor="#94A3B8"
                keyboardType="decimal-pad"
                value={longitude}
                onChangeText={setLongitude}
              />
            </View>

          </View>

        </View>

        {/* TIPO */}
        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Tipo da câmera
          </Text>

          <View style={styles.linhaOpcoes}>

            <TouchableOpacity
              style={[
                styles.opcao,
                tipo === "webcam" &&
                  styles.opcaoSelecionada,
              ]}
              onPress={() => setTipo("webcam")}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="computer"
                size={20}
                color={
                  tipo === "webcam"
                    ? "#745CD4"
                    : "#64748B"
                }
              />

              <Text
                style={[
                  styles.textoOpcao,
                  tipo === "webcam" &&
                    styles.textoSelecionado,
                ]}
              >
                Webcam
              </Text>

              {tipo === "webcam" && (
                <MaterialIcons
                  name="check-circle"
                  size={18}
                  color="#745CD4"
                />
              )}

            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.opcao,
                tipo === "ip" &&
                  styles.opcaoSelecionada,
              ]}
              onPress={() => setTipo("ip")}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="videocam"
                size={20}
                color={
                  tipo === "ip"
                    ? "#745CD4"
                    : "#64748B"
                }
              />

              <Text
                style={[
                  styles.textoOpcao,
                  tipo === "ip" &&
                    styles.textoSelecionado,
                ]}
              >
                Câmera IP
              </Text>

              {tipo === "ip" && (
                <MaterialIcons
                  name="check-circle"
                  size={18}
                  color="#745CD4"
                />
              )}

            </TouchableOpacity>

          </View>

          <Text style={styles.label}>
            URL da transmissão
          </Text>

          <TextInput
            style={styles.input}
            placeholder="URL da câmera"
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            autoCorrect={false}
            value={urlStream}
            onChangeText={setUrlStream}
          />

          <Text style={styles.explicacao}>
            A URL será utilizada para acessar a
            transmissão da câmera.
          </Text>

        </View>

        {/* COMPARTILHAMENTO */}
        <View style={styles.card}>

          <View style={styles.compartilhamentoHeader}>

            <View style={styles.compartilhamentoIcon}>
              <MaterialIcons
                name="share"
                size={20}
                color="#745CD4"
              />
            </View>

            <View style={styles.compartilhamentoText}>
              <Text style={styles.textoCompartilhamento}>
                Compartilhar câmera
              </Text>

              <Text style={styles.textoPequeno}>
                Permitir acesso de outras pessoas.
              </Text>
            </View>

            <Switch
              value={compartilhada}
              onValueChange={(valor) => {
                setCompartilhada(valor);

                if (!valor) {
                  setNivelAcesso("privada");
                }
              }}
              trackColor={{
                false: "#CBD5E1",
                true: "#B8ACE8",
              }}
              thumbColor={
                compartilhada
                  ? "#745CD4"
                  : "#FFFFFF"
              }
            />

          </View>

          {compartilhada && (
            <View style={styles.acessoContainer}>

              <Text style={styles.sectionTitleSmall}>
                Nível de acesso
              </Text>

              <TouchableOpacity
                style={[
                  styles.nivel,
                  nivelAcesso === "privada" &&
                    styles.nivelSelecionado,
                ]}
                onPress={() =>
                  setNivelAcesso("privada")
                }
                activeOpacity={0.8}
              >
                <MaterialIcons
                  name="lock-outline"
                  size={19}
                  color={
                    nivelAcesso === "privada"
                      ? "#745CD4"
                      : "#64748B"
                  }
                />

                <View style={styles.nivelText}>
                  <Text
                    style={[
                      styles.textoNivel,
                      nivelAcesso === "privada" &&
                        styles.textoNivelSelecionado,
                    ]}
                  >
                    Privada
                  </Text>

                  <Text style={styles.nivelDescricao}>
                    Apenas você terá acesso.
                  </Text>
                </View>

                {nivelAcesso === "privada" && (
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color="#745CD4"
                  />
                )}

              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.nivel,
                  nivelAcesso === "comunidade" &&
                    styles.nivelSelecionado,
                ]}
                onPress={() =>
                  setNivelAcesso("comunidade")
                }
                activeOpacity={0.8}
              >
                <MaterialIcons
                  name="groups"
                  size={19}
                  color={
                    nivelAcesso === "comunidade"
                      ? "#745CD4"
                      : "#64748B"
                  }
                />

                <View style={styles.nivelText}>
                  <Text
                    style={[
                      styles.textoNivel,
                      nivelAcesso === "comunidade" &&
                        styles.textoNivelSelecionado,
                    ]}
                  >
                    Comunidade
                  </Text>

                  <Text style={styles.nivelDescricao}>
                    Pessoas da comunidade poderão acessar.
                  </Text>
                </View>

                {nivelAcesso === "comunidade" && (
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color="#745CD4"
                  />
                )}

              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.nivel,
                  nivelAcesso === "publica" &&
                    styles.nivelSelecionado,
                ]}
                onPress={() =>
                  setNivelAcesso("publica")
                }
                activeOpacity={0.8}
              >
                <MaterialIcons
                  name="public"
                  size={19}
                  color={
                    nivelAcesso === "publica"
                      ? "#745CD4"
                      : "#64748B"
                  }
                />

                <View style={styles.nivelText}>
                  <Text
                    style={[
                      styles.textoNivel,
                      nivelAcesso === "publica" &&
                        styles.textoNivelSelecionado,
                    ]}
                  >
                    Pública
                  </Text>

                  <Text style={styles.nivelDescricao}>
                    A câmera poderá ser acessada publicamente.
                  </Text>
                </View>

                {nivelAcesso === "publica" && (
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color="#745CD4"
                  />
                )}

              </TouchableOpacity>

            </View>
          )}

        </View>

        {/* BOTÃO */}
        <TouchableOpacity
          style={[
            styles.botao,
            carregando && styles.botaoDesativado,
          ]}
          onPress={cadastrarCamera}
          disabled={carregando}
          activeOpacity={0.85}
        >
          {carregando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <MaterialIcons
                name="add"
                size={21}
                color="#FFFFFF"
              />

              <Text style={styles.textoBotao}>
                Cadastrar câmera
              </Text>
            </>
          )}
        </TouchableOpacity>

      </ScrollView>
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

  scroll: {
    flex: 1,
  },

  conteudo: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 35,
  },

  /* INTRO */

  intro: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  cameraIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#F1EEFA",
    alignItems: "center",
    justifyContent: "center",
  },

  introText: {
    flex: 1,
    marginLeft: 13,
  },

  titulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#152D63",
    marginBottom: 3,
  },

  subtitulo: {
    fontSize: 13,
    lineHeight: 18,
    color: "#718096",
  },

  /* CARDS */

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#E8ECF2",
    padding: 16,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#152D63",
    marginBottom: 3,
  },

  sectionTitleSmall: {
    fontSize: 14,
    fontWeight: "700",
    color: "#152D63",
    marginBottom: 10,
  },

  /* INPUTS */

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginTop: 15,
    marginBottom: 7,
  },

  input: {
    height: 48,
    backgroundColor: "#F8FAFC",
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 13,
    fontSize: 14,
    color: "#1E293B",
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  halfInput: {
    flex: 1,
  },

  /* TIPO */

  linhaOpcoes: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  opcao: {
    flex: 1,
    minHeight: 52,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 7,
  },

  opcaoSelecionada: {
    backgroundColor: "#F3F0FB",
    borderColor: "#B9AFE3",
  },

  textoOpcao: {
    flex: 1,
    color: "#475569",
    fontSize: 13,
    fontWeight: "600",
  },

  textoSelecionado: {
    color: "#5F4AA8",
  },

  explicacao: {
    fontSize: 11.5,
    lineHeight: 17,
    color: "#94A3B8",
    marginTop: 7,
  },

  /* COMPARTILHAMENTO */

  compartilhamentoHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  compartilhamentoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3F0FB",
    alignItems: "center",
    justifyContent: "center",
  },

  compartilhamentoText: {
    flex: 1,
    marginLeft: 11,
  },

  textoCompartilhamento: {
    color: "#152D63",
    fontSize: 14,
    fontWeight: "700",
  },

  textoPequeno: {
    color: "#94A3B8",
    fontSize: 11.5,
    marginTop: 3,
  },

  acessoContainer: {
    marginTop: 18,
    paddingTop: 17,
    borderTopWidth: 1,
    borderTopColor: "#EEF1F5",
  },

  /* NÍVEIS */

  nivel: {
    minHeight: 64,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  nivelSelecionado: {
    backgroundColor: "#F3F0FB",
    borderColor: "#B9AFE3",
  },

  nivelText: {
    flex: 1,
    marginLeft: 10,
  },

  textoNivel: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "700",
  },

  textoNivelSelecionado: {
    color: "#5F4AA8",
  },

  nivelDescricao: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 3,
    lineHeight: 15,
  },

  /* BOTÃO */

  botao: {
    height: 52,
    backgroundColor: "#745CD4",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
  },

  botaoDesativado: {
    opacity: 0.65,
  },

  textoBotao: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 7,
  },
});