import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

import { DrawerContentScrollView } from '@react-navigation/drawer';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { styles } from './styles';

export default function CustomDrawer(props) {

  const { navigation } = props;

  const [nomeUsuario, setNomeUsuario] = useState('');

  useEffect(() => {
    carregarUsuario();
  }, []);

  async function carregarUsuario() {
    try {
      const nome = await AsyncStorage.getItem('usuario_nome');

      console.log('NOME SALVO:', nome);

      if (nome) {
        setNomeUsuario(nome);
      } else {
        setNomeUsuario('Usuário');
      }

    } catch (error) {
      console.log('Erro ao carregar usuário:', error);
      setNomeUsuario('Usuário');
    }
  }

  function goTo(screen) {
    navigation.navigate(screen);
    navigation.closeDrawer();
  }

  async function logout() {

    try {
      await AsyncStorage.removeItem('usuario_id');
      await AsyncStorage.removeItem('usuario_nome');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });

    } catch (error) {
      console.log('Erro ao sair:', error);
    }
  }

  return (
    <View style={styles.container}>

      {/* CABEÇALHO */}
      <View style={styles.header}>

        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.ola}>
          Olá!
        </Text>

        <Text style={styles.nome}>
          {nomeUsuario || 'Usuário'}
        </Text>

        <Text style={styles.subtitulo}>
          Sistema de Monitoramento Colaborativo
        </Text>

      </View>


      {/* MENU */}
      <DrawerContentScrollView
        {...props}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menu}
      >

        <TouchableOpacity
          style={styles.item}
          onPress={() => goTo('Home')}
        >
          <MaterialIcons
            name="home"
            size={24}
            color="#152D63"
          />

          <Text style={styles.itemText}>
            Feed
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.item}
          onPress={() => goTo('Mapa')}
        >
          <MaterialIcons
            name="map"
            size={24}
            color="#152D63"
          />

          <Text style={styles.itemText}>
            Mapa
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.item}
          onPress={() => goTo('Alertas')}
        >
          <MaterialIcons
            name="notifications-active"
            size={24}
            color="#152D63"
          />

          <Text style={styles.itemText}>
            Alertas
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.item}
          onPress={() => goTo('Chat')}
        >
          <MaterialIcons
            name="chat"
            size={24}
            color="#152D63"
          />

          <Text style={styles.itemText}>
            Chat
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.item}
          onPress={() => goTo('Comunidade')}
        >
          <MaterialIcons
            name="groups"
            size={24}
            color="#152D63"
          />

          <Text style={styles.itemText}>
            Comunidades
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.item}
          onPress={() => goTo('Cameras')}
        >
          <Entypo
            name="video-camera"
            size={22}
            color="#152D63"
          />

          <Text style={styles.itemText}>
            Minhas Câmeras
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.item}
          onPress={() => goTo('Denuncia')}
        >
          <MaterialIcons
            name="report-problem"
            size={24}
            color="#8971D3"
          />

          <Text style={styles.itemPurple}>
            Realizar Denúncia
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.item}
          onPress={() => goTo('MinhasDenuncias')}
        >
          <MaterialIcons
            name="assignment"
            size={24}
            color="#8971D3"
          />

          <Text style={styles.itemPurple}>
            Minhas Denúncias
          </Text>
        </TouchableOpacity>


        {/* EMERGÊNCIA */}
        <TouchableOpacity
          style={styles.emergencia}
          onPress={() => goTo('Botao')}
        >
          <MaterialIcons
            name="add-alert"
            size={24}
            color="#D32F2F"
          />

          <Text style={styles.emergenciaText}>
            Emergência
          </Text>
        </TouchableOpacity>

      </DrawerContentScrollView>


      {/* SAIR */}
      <View style={styles.footer}>

        <TouchableOpacity
          style={styles.sair}
          onPress={logout}
        >
          <MaterialIcons
            name="logout"
            size={24}
            color="#D32F2F"
          />

          <Text style={styles.sairText}>
            Sair da conta
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}