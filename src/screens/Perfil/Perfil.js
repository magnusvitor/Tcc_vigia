import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "@react-navigation/native";

const API_URL = "http://localhost/TCC/perfil.php";

export default function Perfil({ navigation }) {
  const [usuario, setUsuario] = useState({
    id: null,
    nome: "",
    email: "",
    telefone: "",
    cep: "",
    bairro: "",
    endereco: "",
    foto_perfil: null,
  });

  const [editando, setEditando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [fotoCarregando, setFotoCarregando] = useState(false);

  // ================================
  // CARREGAR PERFIL
  // ================================
  const obterDadosPerfil = async () => {
    try {
      setCarregando(true);

      let usuarioId = await AsyncStorage.getItem("usuario_id");

      console.log("ID salvo no AsyncStorage:", usuarioId);

      if (!usuarioId) {
        const usuarioSalvo = await AsyncStorage.getItem("usuario");

        if (usuarioSalvo) {
          try {
            const dadosUsuario = JSON.parse(usuarioSalvo);

            usuarioId =
              dadosUsuario?.usuario?.id ||
              dadosUsuario?.id ||
              null;

            console.log(
              "ID encontrado no objeto usuario:",
              usuarioId
            );
          } catch (erro) {
            console.log(
              "Erro ao interpretar usuario:",
              erro
            );
          }
        }
      }

      if (!usuarioId) {
        throw new Error(
          "Usuário não encontrado. Faça login novamente."
        );
      }

      const resposta = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          acao: "buscar",
          id: Number(usuarioId),
        }),
      });

      console.log("STATUS PERFIL:", resposta.status);
      console.log(
        "TIPO DA RESPOSTA:",
        resposta.headers.get("content-type")
      );

      // LER A RESPOSTA APENAS UMA VEZ
      const texto = await resposta.text();

      console.log(
        "RESPOSTA BRUTA PERFIL:",
        texto
      );

      let dados;

      try {
        dados = JSON.parse(texto);
      } catch (erro) {
        console.log(
          "Resposta não é JSON:",
          texto
        );

        throw new Error(
          "O servidor não retornou um JSON válido."
        );
      }

      if (!dados.sucesso) {
        throw new Error(
          dados.erro ||
            "Não foi possível carregar o perfil."
        );
      }

      const usuarioBanco = dados.usuario;

      if (!usuarioBanco) {
        throw new Error(
          "O servidor não retornou os dados do usuário."
        );
      }

      let foto = null;

      if (usuarioBanco.foto_perfil) {
        foto = usuarioBanco.foto_perfil.startsWith("http")
          ? `${usuarioBanco.foto_perfil}?t=${Date.now()}`
          : `http://localhost/TCC/${usuarioBanco.foto_perfil}?t=${Date.now()}`;
      }

      setUsuario({
        id: usuarioBanco.id,
        nome: usuarioBanco.nome || "",
        email: usuarioBanco.email || "",
        telefone: usuarioBanco.telefone || "",
        cep: usuarioBanco.cep || "",
        bairro: usuarioBanco.bairro || "",
        endereco: usuarioBanco.endereco || "",
        foto_perfil: foto,
      });

      await AsyncStorage.setItem(
        "usuario_id",
        String(usuarioBanco.id)
      );

      await AsyncStorage.setItem(
        "usuario_nome",
        usuarioBanco.nome || ""
      );

      await AsyncStorage.setItem(
        "usuario_email",
        usuarioBanco.email || ""
      );
    } catch (erro) {
      console.error(
        "Erro ao carregar perfil:",
        erro
      );

      Alert.alert(
        "Erro",
        erro.message ||
          "Não foi possível carregar seu perfil."
      );
    } finally {
      setCarregando(false);
    }
  };

  // ================================
  // CARREGAR AO ABRIR A TELA
  // ================================
  useFocusEffect(
    useCallback(() => {
      obterDadosPerfil();
    }, [])
  );

  // ================================
  // SALVAR ALTERAÇÕES
  // ================================
  const salvarPerfil = async () => {
    try {
      if (!usuario.id) {
        Alert.alert(
          "Erro",
          "ID do usuário não encontrado."
        );
        return;
      }

      if (!usuario.nome.trim()) {
        Alert.alert(
          "Atenção",
          "Digite seu nome."
        );
        return;
      }

      setSalvando(true);

      const resposta = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          acao: "salvar",
          id: Number(usuario.id),
          nome: usuario.nome,
          email: usuario.email,
          telefone: usuario.telefone,
          cep: usuario.cep,
          bairro: usuario.bairro,
          endereco: usuario.endereco,
        }),
      });

      const texto = await resposta.text();

      console.log(
        "Resposta salvar perfil:",
        texto
      );

      let dados;

      try {
        dados = JSON.parse(texto);
      } catch (erro) {
        throw new Error(
          "O servidor não retornou um JSON válido."
        );
      }

      if (!dados.sucesso) {
        throw new Error(
          dados.erro ||
            "Não foi possível salvar os dados."
        );
      }

      await AsyncStorage.setItem(
        "usuario_nome",
        usuario.nome
      );

      await AsyncStorage.setItem(
        "usuario_email",
        usuario.email
      );

      setEditando(false);

      Alert.alert(
        "Sucesso",
        "Seus dados foram atualizados."
      );

      await obterDadosPerfil();
    } catch (erro) {
      console.error(
        "Erro ao salvar perfil:",
        erro
      );

      Alert.alert(
        "Erro",
        erro.message ||
          "Não foi possível salvar os dados."
      );
    } finally {
      setSalvando(false);
    }
  };

  // ================================
  // ESCOLHER FOTO
  // ================================
  const alterarFoto = async () => {
    try {
      const permissao =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissao.granted) {
        Alert.alert(
          "Permissão necessária",
          "Permita o acesso às fotos para alterar sua foto de perfil."
        );
        return;
      }

      const resultado =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
          base64: true,
        });

      if (
        resultado.canceled ||
        !resultado.assets ||
        !resultado.assets[0]
      ) {
        return;
      }

      const imagem = resultado.assets[0];

      if (!imagem.base64) {
        Alert.alert(
          "Erro",
          "Não foi possível obter a imagem."
        );
        return;
      }

      if (!usuario.id) {
        Alert.alert(
          "Erro",
          "Usuário não identificado."
        );
        return;
      }

      setFotoCarregando(true);

      const resposta = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          acao: "foto",
          id: Number(usuario.id),
          imagem: `data:image/jpeg;base64,${imagem.base64}`,
        }),
      });

      const texto = await resposta.text();

      console.log(
        "Resposta foto:",
        texto
      );

      let dados;

      try {
        dados = JSON.parse(texto);
      } catch (erro) {
        throw new Error(
          "O servidor não retornou um JSON válido."
        );
      }

      if (!dados.sucesso) {
        throw new Error(
          dados.erro ||
            "Não foi possível alterar a foto."
        );
      }

      let fotoNova = null;

      if (dados.foto_perfil) {
        fotoNova = dados.foto_perfil.startsWith("http")
          ? `${dados.foto_perfil}?t=${Date.now()}`
          : `http://localhost/TCC/${dados.foto_perfil}?t=${Date.now()}`;
      }

      setUsuario((anterior) => ({
        ...anterior,
        foto_perfil: fotoNova,
      }));

      Alert.alert(
        "Sucesso",
        "Foto de perfil atualizada."
      );
    } catch (erro) {
      console.error(
        "Erro ao alterar foto:",
        erro
      );

      Alert.alert(
        "Erro",
        erro.message ||
          "Não foi possível alterar sua foto."
      );
    } finally {
      setFotoCarregando(false);
    }
  };

  // ================================
  // EXCLUIR CONTA
  // ================================
  const excluirConta = () => {
    Alert.alert(
      "Excluir conta",
      "Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: confirmarExclusao,
        },
      ]
    );
  };

  const confirmarExclusao = async () => {
    try {
      if (!usuario.id) {
        Alert.alert(
          "Erro",
          "Usuário não identificado."
        );
        return;
      }

      const resposta = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          acao: "excluir",
          id: Number(usuario.id),
        }),
      });

      const texto = await resposta.text();

      console.log(
        "Resposta excluir:",
        texto
      );

      let dados;

      try {
        dados = JSON.parse(texto);
      } catch (erro) {
        throw new Error(
          "O servidor não retornou um JSON válido."
        );
      }

      if (!dados.sucesso) {
        throw new Error(
          dados.erro ||
            "Não foi possível excluir a conta."
        );
      }

      await AsyncStorage.multiRemove([
        "usuario_id",
        "usuario_nome",
        "usuario_email",
        "usuario",
      ]);

      Alert.alert(
        "Conta excluída",
        "Sua conta foi excluída com sucesso.",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            },
          },
        ]
      );
    } catch (erro) {
      console.error(
        "Erro ao excluir conta:",
        erro
      );

      Alert.alert(
        "Erro",
        erro.message ||
          "Não foi possível excluir a conta."
      );
    }
  };

  // ================================
  // COMPONENTE DE CAMPO
  // ================================
  const Campo = ({
    label,
    valor,
    campo,
    teclado = "default",
    editavel = true,
  }) => (
    <View style={styles.campoContainer}>
      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        style={[
          styles.input,
          !editando && styles.inputBloqueado,
        ]}
        value={valor}
        editable={editando && editavel}
        keyboardType={teclado}
        onChangeText={(texto) =>
          setUsuario((anterior) => ({
            ...anterior,
            [campo]: texto,
          }))
        }
        placeholder={`Digite seu ${label.toLowerCase()}`}
        placeholderTextColor="#999"
      />
    </View>
  );

  // ================================
  // TELA
  // ================================
  if (carregando) {
    return (
      <SafeAreaView style={styles.carregandoContainer}>
        <ActivityIndicator
          size="large"
          color="#152D63"
        />

        <Text style={styles.textoCarregando}>
          Carregando perfil...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons
              name="arrow-back"
              size={25}
              color="#152D63"
            />
          </TouchableOpacity>

          <View>
            <Text style={styles.titulo}>
              Meu perfil
            </Text>

            <Text style={styles.subtitulo}>
              Gerencie seus dados pessoais
            </Text>
          </View>

          {!editando && (
            <TouchableOpacity
              style={styles.botaoEditar}
              onPress={() => setEditando(true)}
            >
              <MaterialIcons
                name="edit"
                size={19}
                color="#FFFFFF"
              />

              <Text style={styles.textoBotaoEditar}>
                Editar
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* FOTO */}
        <View style={styles.cardFoto}>
          <View style={styles.fotoContainer}>
            {usuario.foto_perfil ? (
              <Image
                source={{
                  uri: usuario.foto_perfil,
                }}
                style={styles.foto}
              />
            ) : (
              <View style={styles.fotoPlaceholder}>
                <MaterialIcons
                  name="person"
                  size={55}
                  color="#FFFFFF"
                />
              </View>
            )}

            {fotoCarregando && (
              <View style={styles.loadingFoto}>
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.botaoFoto}
            onPress={alterarFoto}
            disabled={fotoCarregando}
          >
            <MaterialIcons
              name="photo-camera"
              size={18}
              color="#152D63"
            />

            <Text style={styles.textoBotaoFoto}>
              Alterar foto
            </Text>
          </TouchableOpacity>
        </View>

        {/* DADOS PESSOAIS */}
        <View style={styles.card}>
          <Text style={styles.tituloCard}>
            Dados pessoais
          </Text>

          <Campo
            label="Nome"
            valor={usuario.nome}
            campo="nome"
          />

          <Campo
            label="E-mail"
            valor={usuario.email}
            campo="email"
            teclado="email-address"
            editavel={false}
          />

          <Campo
            label="Telefone"
            valor={usuario.telefone}
            campo="telefone"
            teclado="phone-pad"
          />
        </View>

        {/* ENDEREÇO */}
        <View style={styles.card}>
          <Text style={styles.tituloCard}>
            Endereço
          </Text>

          <Campo
            label="CEP"
            valor={usuario.cep}
            campo="cep"
            teclado="numeric"
          />

          <Campo
            label="Bairro"
            valor={usuario.bairro}
            campo="bairro"
          />

          <Campo
            label="Endereço"
            valor={usuario.endereco}
            campo="endereco"
          />
        </View>

        {/* BOTÕES */}
        {editando && (
          <View style={styles.botoesEdicao}>
            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={() => {
                setEditando(false);
                obterDadosPerfil();
              }}
              disabled={salvando}
            >
              <Text style={styles.textoCancelar}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoSalvar}
              onPress={salvarPerfil}
              disabled={salvando}
            >
              {salvando ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <>
                  <MaterialIcons
                    name="check"
                    size={20}
                    color="#FFFFFF"
                  />

                  <Text style={styles.textoSalvar}>
                    Salvar alterações
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* SEGURANÇA */}
        <View style={styles.cardSeguranca}>
          <View style={styles.iconeSeguranca}>
            <MaterialIcons
              name="security"
              size={25}
              color="#152D63"
            />
          </View>

          <View style={styles.textoSeguranca}>
            <Text style={styles.tituloSeguranca}>
              Conta protegida
            </Text>

            <Text style={styles.subtituloSeguranca}>
              Seus dados pessoais são armazenados
              com segurança.
            </Text>
          </View>
        </View>

        {/* EXCLUIR */}
        <TouchableOpacity
          style={styles.botaoExcluir}
          onPress={excluirConta}
        >
          <MaterialIcons
            name="delete-outline"
            size={21}
            color="#EF4444"
          />

          <Text style={styles.textoExcluir}>
            Excluir minha conta
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
// ================================
// ESTILOS
// ================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },

  conteudo: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 35,
  },

  carregandoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F8FC",
  },

  textoCarregando: {
    marginTop: 10,
    fontSize: 13,
    color: "#64748B",
  },

  // ================================
  // HEADER
  // ================================

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  botaoVoltar: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
    borderWidth: 1,
    borderColor: "#E8EAF0",
  },

  titulo: {
    fontSize: 22,
    fontWeight: "800",
    color: "#152D63",
  },

  subtitulo: {
    marginTop: 2,
    fontSize: 12,
    color: "#64748B",
  },

  botaoEditar: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#152D63",
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 10,
    gap: 5,
  },

  textoBotaoEditar: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "700",
  },

  // ================================
  // FOTO
  // ================================

  cardFoto: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 13,
    borderWidth: 1,
    borderColor: "#E8EAF0",
  },

  fotoContainer: {
    width: 92,
    height: 92,
    borderRadius: 46,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E8EAF0",
  },

  foto: {
    width: "100%",
    height: "100%",
  },

  fotoPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#152D63",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingFoto: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(21,45,99,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },

  botaoFoto: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 13,
    height: 36,
    borderRadius: 9,
    backgroundColor: "#F1EFFB",
  },

  textoBotaoFoto: {
    color: "#152D63",
    fontWeight: "700",
    fontSize: 12,
  },

  // ================================
  // CARD PRINCIPAL
  // ================================

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 16,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: "#E8EAF0",
  },

  tituloCard: {
    fontSize: 15,
    fontWeight: "800",
    color: "#152D63",
    marginBottom: 15,
  },

  // ================================
  // CAMPOS
  // ================================

  campoContainer: {
    marginBottom: 13,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 6,
  },

  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#DDE1E8",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    color: "#1E293B",
    fontSize: 13,
  },

  inputBloqueado: {
    backgroundColor: "#F4F6F9",
    color: "#64748B",
    borderColor: "#E3E6EC",
  },

  // ================================
  // BOTÕES DE EDIÇÃO
  // ================================

  botoesEdicao: {
    flexDirection: "row",
    gap: 9,
    marginBottom: 14,
  },

  botaoCancelar: {
    flex: 1,
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D5DAE2",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  textoCancelar: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "700",
  },

  botaoSalvar: {
    flex: 2,
    height: 45,
    borderRadius: 10,
    backgroundColor: "#152D63",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },

  textoSalvar: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  // ================================
  // SEGURANÇA
  // ================================

  cardSeguranca: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F1FA",
    borderRadius: 14,
    padding: 13,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E3DDF2",
  },

  iconeSeguranca: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  textoSeguranca: {
    flex: 1,
  },

  tituloSeguranca: {
    fontSize: 13,
    fontWeight: "800",
    color: "#152D63",
    marginBottom: 2,
  },

  subtituloSeguranca: {
    fontSize: 11.5,
    color: "#64748B",
    lineHeight: 16,
  },

  // ================================
  // EXCLUIR
  // ================================

  botaoExcluir: {
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F1CACA",
    backgroundColor: "#FFF9F9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  textoExcluir: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "700",
  },

});