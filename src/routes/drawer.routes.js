import React, { useState, useEffect } from 'react';

import {
  StyleSheet,
  Platform,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ======================================================
// TELAS
// ======================================================

import Home from '../screens/Home';
import Mapa from '../screens/Mapa';
import Alertas from '../screens/Alertas';
import ChatList from '../screens/Chat/MinhasComunidades';
import Ocorrencias from '../screens/Ocorrencias';
import Botao from '../screens/Botao';
import Cameras from '../screens/Cameras';

import PerfilPrincipal from '../screens/Perfil/index';

// ======================================================
// DRAWER
// ======================================================

const Drawer = createDrawerNavigator();

// ======================================================
// ITENS DO MENU LATERAL
// ======================================================

const menuItems = [
  {
    name: 'Home',
    label: 'Início',
    icon: 'home-outline',
    activeIcon: 'home',
  },

  {
    name: 'Botao',
    label: 'Emergência',
    icon: 'alert-circle-outline',
    activeIcon: 'alert-circle',
    danger: true,
  },

  {
    name: 'Chat',
    label: 'Mensagens',
    icon: 'message-outline',
    activeIcon: 'message',
  },

  {
    name: 'Mapa',
    label: 'Mapa',
    icon: 'map-marker-outline',
    activeIcon: 'map-marker',
  },

  {
    name: 'Alertas',
    label: 'Estatísticas',
    icon: 'chart-box-outline',
    activeIcon: 'chart-box',
  },

  {
    name: 'Ocorrencias',
    label: 'Ocorrências',
    icon: 'clipboard-text-outline',
    activeIcon: 'clipboard-text',
  },

  {
    name: 'Cameras',
    label: 'Câmeras',
    icon: 'cctv',
    activeIcon: 'cctv',
  },
];

// ======================================================
// MENU LATERAL PERSONALIZADO
// ======================================================

const CustomDrawer = ({ navigation, state }) => {
  const [usuario, setUsuario] = useState(null);

  // ====================================================
  // BUSCAR USUÁRIO LOGADO
  // ====================================================

  useEffect(() => {
    async function buscarUsuario() {
      try {
        const idUsuario =
          await AsyncStorage.getItem('usuario_id');

        if (!idUsuario) {
          console.log('Nenhum usuário logado.');
          return;
        }

        const response = await fetch(
          'http://localhost/TCC/perfil.php',
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({
              acao: 'buscar',
              id: parseInt(idUsuario, 10),
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Erro HTTP: ${response.status}`
          );
        }

        const data = await response.json();

        console.log(
          'Usuário do Drawer:',
          data
        );

        if (data.sucesso) {
          setUsuario(data.usuario);
        } else {
          console.log(
            'Erro ao buscar usuário:',
            data.erro
          );
        }

      } catch (error) {
        console.log(
          'Erro ao buscar usuário:',
          error
        );
      }
    }

    buscarUsuario();
  }, []);

  // ====================================================
  // PEGAR PRIMEIRO NOME
  // ====================================================

  const primeiroNome =
    usuario?.nome
      ? usuario.nome.trim().split(' ')[0]
      : 'Usuário';

  // ====================================================
  // FOTO DE PERFIL
  // ====================================================

  const fotoPerfil =
    usuario?.foto_perfil
      ? usuario.foto_perfil.startsWith('http')
        ? usuario.foto_perfil
        : `http://localhost/TCC/${usuario.foto_perfil}`
      : null;

  // ====================================================
  // ROTA ATUAL
  // ====================================================

  const currentRoute =
    state?.routes?.[state.index]?.name;

  // ====================================================
  // SAIR
  // ====================================================

  function sair() {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },

        {
          text: 'Sair',
          style: 'destructive',

          onPress: async () => {

            await AsyncStorage.removeItem(
              'usuario_id'
            );

            await AsyncStorage.removeItem(
              'usuario_nome'
            );

            navigation.navigate('Login');
          },
        },
      ]
    );
  }

  return (
    <View style={styles.drawerContainer}>

      {/* ==================================================
          CABEÇALHO DO DRAWER
      ================================================== */}

      <View style={styles.drawerHeader}>

        <View style={styles.headerPurpleDetail} />

        {/* FOTO */}

        <View style={styles.logoArea}>

          <View style={styles.logoCircle}>

            {fotoPerfil ? (

              <Image
                source={{
                  uri: fotoPerfil,
                }}
                style={styles.topProfileImage}
              />

            ) : (

              <MaterialCommunityIcons
                name="account"
                size={36}
                color="#8971D3"
              />

            )}

          </View>

        </View>

        {/* INFORMAÇÕES */}

        <View style={styles.headerInfo}>

          <Text style={styles.welcomeText}>
            Olá,
          </Text>

          <Text
            style={styles.userName}
            numberOfLines={1}
          >
            {primeiroNome}!
          </Text>

          <Text style={styles.userDescription}>
            Sistema de Monitoramento
          </Text>

          <Text style={styles.userDescription}>
            Colaborativo
          </Text>

        </View>

      </View>

      {/* ==================================================
          MENU
      ================================================== */}

      <DrawerContentScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <Text style={styles.sectionTitle}>
          NAVEGAÇÃO
        </Text>

        {menuItems.map((item) => {

          const active =
            currentRoute === item.name;

          return (

            <TouchableOpacity
              key={item.name}
              activeOpacity={0.75}

              onPress={() => {
                navigation.navigate(item.name);
              }}

              style={[
                styles.menuItem,
                active &&
                  styles.menuItemActive,
              ]}
            >

              {active && (
                <View style={styles.activeBar} />
              )}

              <View
                style={[
                  styles.iconContainer,
                  active &&
                    styles.iconContainerActive,
                ]}
              >

                <MaterialCommunityIcons
                  name={
                    active
                      ? item.activeIcon
                      : item.icon
                  }

                  size={22}

                  color={
                    item.danger
                      ? '#D96B77'
                      : active
                        ? '#8971D3'
                        : '#64748B'
                  }
                />

              </View>

              <Text
                style={[
                  styles.menuText,

                  active &&
                    styles.menuTextActive,

                  item.danger &&
                    styles.dangerText,
                ]}
              >
                {item.label}
              </Text>

              {active && (

                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color="#8971D3"
                />

              )}

            </TouchableOpacity>
          );
        })}

        {/* ==================================================
            DIVISOR
        ================================================== */}

        <View style={styles.menuDivider} />

        {/* ==================================================
            MEU PERFIL
        ================================================== */}

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.menuItem}

          onPress={() => {
            navigation.navigate(
              'PerfilPrincipal'
            );
          }}
        >

          <View style={styles.iconContainer}>

            <MaterialCommunityIcons
              name="account-outline"
              size={22}
              color="#64748B"
            />

          </View>

          <Text style={styles.menuText}>
            Meu perfil
          </Text>

        </TouchableOpacity>

        {/* ==================================================
            CONFIGURAÇÕES
        ================================================== */}

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.menuItem}

          onPress={() => {
            Alert.alert(
              'Configurações',
              'Configurações do aplicativo'
            );
          }}
        >

          <View style={styles.iconContainer}>

            <MaterialCommunityIcons
              name="cog-outline"
              size={22}
              color="#64748B"
            />

          </View>

          <Text style={styles.menuText}>
            Configurações
          </Text>

        </TouchableOpacity>

        {/* ==================================================
            AJUDA
        ================================================== */}

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.menuItem}

          onPress={() => {
            Alert.alert(
              'Ajuda e suporte',
              'Entre em contato com o suporte do SMC.'
            );
          }}
        >

          <View style={styles.iconContainer}>

            <MaterialCommunityIcons
              name="help-circle-outline"
              size={22}
              color="#64748B"
            />

          </View>

          <Text style={styles.menuText}>
            Ajuda e suporte
          </Text>

        </TouchableOpacity>

      </DrawerContentScrollView>

      {/* ==================================================
          RODAPÉ
      ================================================== */}

      <View style={styles.footer}>

        <View style={styles.footerLine} />

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.logoutButton}
          onPress={sair}
        >

          <View style={styles.logoutIcon}>

            <MaterialCommunityIcons
              name="logout"
              size={21}
              color="#D56572"
            />

          </View>

          <Text style={styles.logoutText}>
            Sair da conta
          </Text>

          <MaterialCommunityIcons
            name="chevron-right"
            size={21}
            color="#D56572"
          />

        </TouchableOpacity>

        <Text style={styles.versionText}>
          SMC • Sistema de Monitoramento Colaborativo
        </Text>

      </View>

    </View>
  );
};

// ======================================================
// BARRA SUPERIOR
// ======================================================

const HeaderNavigation = ({ navigation }) => {
  const [usuarioTop, setUsuarioTop] = useState(null);

  useEffect(() => {

    async function buscarUsuarioTop() {

      try {

        const idUsuario =
          await AsyncStorage.getItem(
            'usuario_id'
          );

        if (!idUsuario) {
          return;
        }

        const response = await fetch(
          'http://localhost/TCC/perfil.php',
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({
              acao: 'buscar',
              id: parseInt(idUsuario, 10),
            }),
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        console.log(
          'Usuário do Header:',
          data
        );

        if (data.sucesso) {
          setUsuarioTop(data.usuario);
        }

      } catch (error) {

        console.log(
          'Erro ao buscar usuário do header:',
          error
        );

      }

    }

    buscarUsuarioTop();

  }, []);

  // ====================================================
  // FOTO
  // ====================================================

  const fotoPerfil =
    usuarioTop?.foto_perfil
      ? usuarioTop.foto_perfil.startsWith('http')
        ? usuarioTop.foto_perfil
        : `http://localhost/TCC/${usuarioTop.foto_perfil}`
      : null;

  return (

    <View style={styles.topHeader}>

      {/* MENU */}

      <TouchableOpacity
        activeOpacity={0.7}

        onPress={() =>
          navigation.openDrawer()
        }

        style={styles.headerMenuButton}
      >

        <MaterialCommunityIcons
          name="menu"
          size={28}
          color="#222222"
        />

      </TouchableOpacity>

      {/* LOGO */}

      <View style={styles.centerLogo}>

        <Image
          source={require('../../assets/logo.png')}
          style={styles.topLogoImage}
          resizeMode="contain"
        />

      </View>

      {/* PERFIL */}

      <TouchableOpacity
        activeOpacity={0.7}

        onPress={() =>
          navigation.navigate(
            'PerfilPrincipal'
          )
        }

        style={styles.headerProfile}
      >

        {fotoPerfil ? (

          <Image
            source={{
              uri: fotoPerfil,
            }}
            style={styles.headerProfileImage}
          />

        ) : (

          <MaterialCommunityIcons
            name="account-circle-outline"
            size={38}
            color="#333333"
          />

        )}

      </TouchableOpacity>

    </View>
  );
};

// ======================================================
// ROTAS
// ======================================================

const DrawerRoutes = () => {

  return (

    <Drawer.Navigator

      initialRouteName="Home"

      drawerContent={(props) => (

        <CustomDrawer
          {...props}
        />

      )}

      screenOptions={{

        headerShown: true,

        drawerType: 'front',

        drawerStyle: {

          width:
            Platform.OS === 'web'
              ? 300
              : 295,

          backgroundColor:
            '#FFFFFF',
        },

        overlayColor:
          'rgba(0,0,0,0.20)',

        swipeEnabled: true,

        header: ({ navigation }) => (

          <HeaderNavigation
            navigation={navigation}
          />

        ),

      }}

    >

      {/* HOME */}

      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Início',
        }}
      />

      {/* EMERGÊNCIA */}

      <Drawer.Screen
        name="Botao"
        component={Botao}
        options={{
          title:
            'Alerta de Emergência',
        }}
      />

      {/* CHAT */}

      <Drawer.Screen
        name="Chat"
        component={ChatList}
        options={{
          title:
            'Mensagens',
        }}
      />

      {/* MAPA */}

      <Drawer.Screen
        name="Mapa"
        component={Mapa}
        options={{
          title:
            'Mapa Interativo',
        }}
      />

      {/* ESTATÍSTICAS */}

      <Drawer.Screen
        name="Alertas"
        component={Alertas}
        options={{
          title:
            'Estatísticas',
        }}
      />

      {/* OCORRÊNCIAS */}

      <Drawer.Screen
        name="Ocorrencias"
        component={Ocorrencias}
        options={{
          title:
            'Minhas Ocorrências',
        }}
      />

      {/* OCORRÊNCIAS */}

      <Drawer.Screen
        name="Cameras"
        component={Cameras}
        options={{
          title:
            'Minhas Ocorrências',
        }}
      />

      {/* ==================================================
          PERFIL PRINCIPAL
          ESCONDIDO DO DRAWER
      ================================================== */}

      <Drawer.Screen
        name="PerfilPrincipal"
        component={PerfilPrincipal}
        options={{
          drawerItemStyle: {
            display: 'none',
          },
        }}
      />

    </Drawer.Navigator>

  );
};

// ======================================================
// ESTILOS
// ======================================================

const styles = StyleSheet.create({

  drawerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  drawerHeader: {
    minHeight: 155,

    backgroundColor: '#F5F2FD',

    paddingHorizontal: 20,
    paddingVertical: 20,

    flexDirection: 'row',

    alignItems: 'center',

    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,

    overflow: 'hidden',
  },

  headerPurpleDetail: {
    position: 'absolute',

    left: 0,
    top: 0,

    width: 6,
    height: '100%',

    backgroundColor: '#8971D3',
  },

  logoArea: {
    width: 78,
    height: 78,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 15,
  },

  logoCircle: {
    width: 70,
    height: 70,

    borderRadius: 35,

    backgroundColor: '#FFFFFF',

    alignItems: 'center',
    justifyContent: 'center',

    overflow: 'hidden',
  },

  topProfileImage: {
    width: '100%',
    height: '100%',

    borderRadius: 35,
  },

  headerInfo: {
    flex: 1,

    justifyContent: 'center',
  },

  welcomeText: {
    fontSize: 12,

    color: '#777777',

    marginBottom: 2,
  },

  userName: {
    fontSize: 18,

    fontWeight: '700',

    color: '#2c2c2c',

    marginBottom: 5,
  },

  userDescription: {
    fontSize: 10,

    color: '#666666',

    fontWeight: '500',

    lineHeight: 14,
  },

  scrollContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },

  sectionTitle: {
    fontSize: 10,

    fontWeight: '800',

    color: '#A0A6B2',

    letterSpacing: 1.2,

    marginLeft: 21,

    marginBottom: 8,
  },

  menuItem: {
    height: 54,

    marginHorizontal: 10,
    marginVertical: 2,

    paddingHorizontal: 10,

    flexDirection: 'row',

    alignItems: 'center',

    borderRadius: 13,

    position: 'relative',
  },

  menuItemActive: {
    backgroundColor: '#F2EFFB',
  },

  activeBar: {
    position: 'absolute',

    left: 0,

    top: 11,
    bottom: 11,

    width: 4,

    borderRadius: 5,

    backgroundColor: '#8971D3',
  },

  iconContainer: {
    width: 42,
    height: 42,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 6,

    borderRadius: 12,
  },

  iconContainerActive: {
    backgroundColor: '#EAE5F8',
  },

  menuText: {
    flex: 1,

    fontSize: 14,

    color: '#4B5563',

    fontWeight: '500',
  },

  menuTextActive: {
    color: '#6D58B3',

    fontWeight: '800',
  },

  dangerText: {
    color: '#D96B77',
  },

  menuDivider: {
    height: 1,

    backgroundColor: '#EEEEF2',

    marginVertical: 12,
    marginHorizontal: 20,
  },

  footer: {
    paddingHorizontal: 12,

    paddingBottom:
      Platform.OS === 'ios'
        ? 22
        : 12,

    backgroundColor: '#FFFFFF',
  },

  footerLine: {
    height: 1,

    backgroundColor: '#EEEEF2',

    marginBottom: 9,
  },

  logoutButton: {
    minHeight: 56,

    paddingHorizontal: 9,

    flexDirection: 'row',

    alignItems: 'center',

    borderRadius: 14,

    backgroundColor: '#FAF9FD',
  },

  logoutIcon: {
    width: 42,
    height: 42,

    borderRadius: 12,

    backgroundColor: '#FEF2F3',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 10,
  },

  logoutText: {
    flex: 1,

    fontSize: 14,

    color: '#D56572',

    fontWeight: '700',
  },

  versionText: {
    textAlign: 'center',

    fontSize: 9,

    color: '#A0A6B2',

    marginTop: 10,

    paddingHorizontal: 5,
  },

  topHeader: {
    height:
      Platform.OS === 'web'
        ? 68
        : 75,

    backgroundColor: '#FFFFFF',

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    position: 'relative',

    borderBottomWidth: 1,

    borderBottomColor: '#EEEEEE',
  },

  headerMenuButton: {
    width: 46,
    height: 46,

    alignItems: 'center',
    justifyContent: 'center',

    marginLeft: 14,

    backgroundColor: 'transparent',
  },

  centerLogo: {
    position: 'absolute',

    left: 0,
    right: 0,

    top: 0,
    bottom: 0,

    alignItems: 'center',
    justifyContent: 'center',

    pointerEvents: 'none',
  },

  topLogoImage: {
    width: 115,
    height: 48,
  },

  headerProfile: {
    width: 46,
    height: 46,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 14,

    backgroundColor: 'transparent',
  },

  headerProfileImage: {
    width: 38,
    height: 38,

    borderRadius: 19,
  },

});

export default DrawerRoutes;