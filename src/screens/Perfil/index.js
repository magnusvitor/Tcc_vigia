import React,{useEffect,useState} from "react";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";

import {MaterialIcons} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

import styles from "./styles";

const API_PERFIL = "http://localhost/TCC/perfil.php";
const API_UPLOAD = "http://localhost/TCC/upload_avatar.php";

export default function PerfilPrincipal({navigation}) {

  const [usuario,setUsuario] = useState(null);
  const [carregando,setCarregando] = useState(true);
  const [enviandoFoto,setEnviandoFoto] = useState(false);

  // ============================================================
  // BUSCAR USUÁRIO NO BANCO
  // ============================================================

  const obterDadosPerfil = async () => {
    try {

      setCarregando(true);

      const usuarioId =
        await AsyncStorage.getItem("usuario_id");

      if (!usuarioId) {

        Alert.alert(
          "Sessão expirada",
          "Não foi possível identificar o usuário."
        );

        return;
      }

      console.log(
        "Buscando usuário:",
        usuarioId
      );

      const resposta = await fetch(API_PERFIL,{
        method:"POST",

        headers:{
          "Content-Type":"application/json",
          "Accept":"application/json",
        },

        body:JSON.stringify({
          acao:"buscar",
          id:Number(usuarioId),
        }),
      });

      console.log(
        "STATUS PERFIL:",
        resposta.status
      );

      const texto = await resposta.text();

      console.log(
        "Resposta perfil:",
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
          "O servidor retornou uma resposta inválida."
        );
      }

      if (!dados.sucesso) {

        throw new Error(
          dados.erro ||
          "Não foi possível carregar o perfil."
        );
      }

      if (!dados.usuario) {

        throw new Error(
          "O servidor não retornou os dados do usuário."
        );
      }

      console.log(
        "Usuário carregado do banco:",
        dados.usuario
      );

      setUsuario(dados.usuario);

      // Atualiza os dados salvos localmente

      if (dados.usuario.nome) {

        await AsyncStorage.setItem(
          "usuario_nome",
          dados.usuario.nome
        );
      }

      if (dados.usuario.email) {

        await AsyncStorage.setItem(
          "usuario_email",
          dados.usuario.email
        );
      }

    } catch (erro) {

      console.log(
        "Erro ao carregar perfil:",
        erro
      );

      Alert.alert(
        "Erro",
        erro.message ||
        "Não foi possível carregar seus dados."
      );

    } finally {

      setCarregando(false);
    }
  };

  // ============================================================
  // ATUALIZAR QUANDO ENTRAR NA TELA
  // ============================================================

  useEffect(() => {

    const unsubscribe =
      navigation.addListener(
        "focus",
        () => {
          obterDadosPerfil();
        }
      );

    return unsubscribe;

  },[navigation]);

  // ============================================================
  // ESCOLHER FOTO
  // ============================================================

  const escolherFoto = async () => {

    try {

      const permissao =
        await ImagePicker
          .requestMediaLibraryPermissionsAsync();

      if (!permissao.granted) {

        Alert.alert(
          "Permissão necessária",
          "Permita o acesso às suas fotos para alterar a foto de perfil."
        );

        return;
      }

      const resultado =
        await ImagePicker.launchImageLibraryAsync({

          mediaTypes:["images"],

          allowsEditing:true,

          aspect:[1,1],

          quality:0.8,
        });

      if (
        resultado.canceled ||
        !resultado.assets ||
        resultado.assets.length === 0
      ) {

        return;
      }

      const uri =
        resultado.assets[0].uri;

      await enviarFoto(uri);

    } catch (erro) {

      console.log(
        "Erro ao escolher foto:",
        erro
      );

      Alert.alert(
        "Erro",
        "Não foi possível selecionar a foto."
      );
    }
  };

  // ============================================================
  // ENVIAR FOTO
  // ============================================================

  const enviarFoto = async (uri) => {

    try {

      if (!usuario?.id) {

        Alert.alert(
          "Erro",
          "Usuário não identificado."
        );

        return;
      }

      setEnviandoFoto(true);

      const formData = new FormData();

      formData.append(
        "id",
        String(usuario.id)
      );

      formData.append(
        "avatar",
        {
          uri:uri,
          name:"avatar.jpg",
          type:"image/jpeg",
        }
      );

      const resposta =
        await fetch(
          API_UPLOAD,
          {
            method:"POST",
            body:formData,
          }
        );

      const texto =
        await resposta.text();

      console.log(
        "Resposta upload:",
        texto
      );

      let dados;

      try {

        dados = JSON.parse(texto);

      } catch (erro) {

        throw new Error(
          "O servidor retornou uma resposta inválida."
        );
      }

      if (!dados.sucesso) {

        throw new Error(
          dados.mensagem ||
          dados.erro ||
          "Não foi possível alterar a foto."
        );
      }

      // Busca novamente os dados do banco

      await obterDadosPerfil();

      Alert.alert(
        "Sucesso",
        "Foto de perfil atualizada!"
      );

    } catch (erro) {

      console.log(
        "Erro ao enviar foto:",
        erro
      );

      Alert.alert(
        "Erro",
        erro.message ||
        "Não foi possível atualizar sua foto."
      );

    } finally {

      setEnviandoFoto(false);
    }
  };

  // ============================================================
  // CARREGAMENTO
  // ============================================================

  if (carregando) {

    return (
      <SafeAreaView style={styles.safeArea}>

        <View style={styles.loadingContainer}>

          <ActivityIndicator
            size="large"
            color="#8971D3"
          />

          <Text
            style={{
              marginTop:12,
              color:"#64748B",
              fontSize:14,
            }}
          >
            Carregando seus dados...
          </Text>

        </View>

      </SafeAreaView>
    );
  }

  // ============================================================
  // ERRO
  // ============================================================

  if (!usuario) {

    return (
      <SafeAreaView style={styles.safeArea}>

        <View style={styles.loadingContainer}>

          <MaterialIcons
            name="person-off"
            size={50}
            color="#94A3B8"
          />

          <Text
            style={{
              marginTop:12,
              fontSize:16,
              fontWeight:"700",
              color:"#0F172A",
            }}
          >
            Não foi possível carregar seu perfil.
          </Text>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                width:180,
                marginTop:20,
              },
            ]}
            onPress={obterDadosPerfil}
          >

            <Text style={styles.primaryButtonText}>
              Tentar novamente
            </Text>

          </TouchableOpacity>

        </View>

      </SafeAreaView>
    );
  }

  // ============================================================
  // FOTO
  // ============================================================

  let fotoPerfil = null;

  if (usuario.foto_perfil) {

    if (
      usuario.foto_perfil.startsWith("http://") ||
      usuario.foto_perfil.startsWith("https://")
    ) {

      fotoPerfil =
        usuario.foto_perfil;

    } else {

      fotoPerfil =
        `http://localhost/TCC/${usuario.foto_perfil}`;
    }
  }

  // ============================================================
  // TELA
  // ============================================================

  return (
    <SafeAreaView style={styles.safeArea}>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          paddingBottom:30,
        }}
        showsVerticalScrollIndicator={false}
      >

        {/* CABEÇALHO */}

        <View style={styles.profileHeaderCard}>

          <View
            style={{
              position:"relative",
            }}
          >

            {fotoPerfil ? (

              <Image
                source={{
                  uri:fotoPerfil,
                }}
                style={styles.avatarImg}
              />

            ) : (

              <View
                style={[
                  styles.avatarImg,
                  {
                    alignItems:"center",
                    justifyContent:"center",
                  },
                ]}
              >

                <MaterialIcons
                  name="person"
                  size={55}
                  color="#8971D3"
                />

              </View>
            )}

            <TouchableOpacity
              onPress={escolherFoto}
              disabled={enviandoFoto}
              style={{
                position:"absolute",
                right:-2,
                bottom:10,
                width:36,
                height:36,
                borderRadius:18,
                backgroundColor:"#8971D3",
                alignItems:"center",
                justifyContent:"center",
                borderWidth:3,
                borderColor:"#FFFFFF",
              }}
            >

              {enviandoFoto ? (

                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />

              ) : (

                <MaterialIcons
                  name="photo-camera"
                  size={19}
                  color="#FFFFFF"
                />

              )}

            </TouchableOpacity>

          </View>

          <Text style={styles.userName}>
            {usuario.nome}
          </Text>

          <Text style={styles.userEmail}>
            {usuario.email}
          </Text>

          <TouchableOpacity
            onPress={escolherFoto}
            disabled={enviandoFoto}
            style={{
              marginTop:10,
            }}
          >

            <Text
              style={{
                color:"#8971D3",
                fontSize:13,
                fontWeight:"700",
              }}
            >
              Alterar foto
            </Text>

          </TouchableOpacity>

        </View>

        {/* CONTA */}

        <Text style={styles.sectionTitle}>
          Conta
        </Text>

        <TouchableOpacity
          style={styles.menuItemRow}
          onPress={() =>
            navigation.navigate("Perfil")
          }
        >

          <View style={styles.menuItemIconBox}>

            <MaterialIcons
              name="person-outline"
              size={22}
              color="#8971D3"
            />

          </View>

          <View style={styles.menuItemTextBox}>

            <Text style={styles.menuItemTitle}>
              Informações pessoais
            </Text>

            <Text style={styles.menuItemSubtitle}>
              Nome,telefone,endereço e outros dados
            </Text>

          </View>

          <MaterialIcons
            name="chevron-right"
            size={24}
            color="#94A3B8"
          />

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItemRow}
          onPress={() =>
            navigation.navigate("Configuracoes")
          }
        >

          <View style={styles.menuItemIconBox}>

            <MaterialIcons
              name="settings"
              size={22}
              color="#8971D3"
            />

          </View>

          <View style={styles.menuItemTextBox}>

            <Text style={styles.menuItemTitle}>
              Configurações
            </Text>

            <Text style={styles.menuItemSubtitle}>
              Preferências,notificações e segurança
            </Text>

          </View>

          <MaterialIcons
            name="chevron-right"
            size={24}
            color="#94A3B8"
          />

        </TouchableOpacity>

        {/* SEGURANÇA */}

        <Text style={styles.sectionTitle}>
          Segurança
        </Text>

        <TouchableOpacity
          style={styles.menuItemRow}
          onPress={() =>
            navigation.navigate(
              "ContatosEmergencia"
            )
          }
        >

          <View style={styles.menuItemIconBox}>

            <MaterialIcons
              name="contact-emergency"
              size={22}
              color="#8971D3"
            />

          </View>

          <View style={styles.menuItemTextBox}>

            <Text style={styles.menuItemTitle}>
              Contatos de emergência
            </Text>

            <Text style={styles.menuItemSubtitle}>
              Pessoas que serão avisadas em uma emergência
            </Text>

          </View>

          <MaterialIcons
            name="chevron-right"
            size={24}
            color="#94A3B8"
          />

        </TouchableOpacity>

        {/* CÂMERAS */}

        <Text style={styles.sectionTitle}>
          Câmeras
        </Text>

        <TouchableOpacity
          style={styles.menuItemRow}
          onPress={() =>
            navigation.navigate(
              "MinhasCameras"
            )
          }
        >

          <View style={styles.menuItemIconBox}>

            <MaterialIcons
              name="videocam"
              size={22}
              color="#8971D3"
            />

          </View>

          <View style={styles.menuItemTextBox}>

            <Text style={styles.menuItemTitle}>
              Minhas câmeras
            </Text>

            <Text style={styles.menuItemSubtitle}>
              Visualizar e gerenciar suas câmeras cadastradas
            </Text>

          </View>

          <MaterialIcons
            name="chevron-right"
            size={24}
            color="#94A3B8"
          />

        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
}