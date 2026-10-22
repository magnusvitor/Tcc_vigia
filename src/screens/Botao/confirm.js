import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './styles';

export default function Confirm({ route, navigation }) {
  // Resgata o protocolo vindo da tela anterior, ou usa um padrão caso falhe
  const { protocolo } = route.params || { protocolo: 'SMC28471' };

  const voltarParaHome = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'App',
          state: {
            routes: [{ name: 'Home' }],
          },
        },
      ],
    });
  };

return (
  <SafeAreaView style={styles.safeArea}>
    
    {/* Ajustado aqui: topHeaderConfirm */}
    <View style={styles.topHeaderConfirm}>
      {/* Ajustado aqui: backButtonConfirm */}
      <TouchableOpacity onPress={voltarParaHome} style={styles.backButtonConfirm}>
        <Ionicons name="chevron-back" size={24} color="#152d63" />
      </TouchableOpacity>
    </View>

    {/* Ajustado aqui: containerConfirm */}
    <View style={styles.containerConfirm}>
      
      <View style={styles.successCircle}>
         <Ionicons name="checkmark" size={48} color="#fff" />
      </View>


        {/* TÍTULO E SUBTÍTULO */}
        <Text style={styles.title}>Alerta enviado!</Text>
        <Text style={styles.subtitle}>
          Seu alerta de emergência foi enviado com sucesso.
        </Text>

        {/* LISTA DE STATUS COMPLETA DA IMAGEM */}
        <View style={styles.statusList}>
          
          {/* Item 1: Contato de emergência */}
          <View style={styles.statusItem}>
            <View style={styles.iconBox}>
              <MaterialCommunityIcons name="account-multiple-plus-outline" size={24} color="#1a1a1a" />
            </View>
            <View style={styles.textGroup}>
              <Text style={styles.itemTitle}>Contato de emergência</Text>
              <Text style={styles.itemSubtitle}>Notificado</Text>
            </View>
            <Ionicons name="checkmark-circle-outline" size={20} color="#2ecc71" />
          </View>

          {/* Item 2: Portal das Autoridades */}
          <View style={styles.statusItem}>
            <View style={styles.iconBox}>
              <MaterialCommunityIcons name="shield-cross-outline" size={24} color="#152d63" />
            </View>
            <View style={styles.textGroup}>
              <Text style={styles.itemTitle}>Portal das Autoridades</Text>
              <Text style={styles.itemSubtitle}>Ocorrência encaminhada</Text>
            </View>
            <Ionicons name="checkmark-circle-outline" size={20} color="#2ecc71" />
          </View>

          {/* Item 3: Localização */}
          <View style={styles.statusItem}>
            <View style={styles.iconBox}>
              <Ionicons name="location-outline" size={24} color="#7259c1" />
            </View>
            <View style={styles.textGroup}>
              <Text style={styles.itemTitle}>Localização</Text>
              <Text style={styles.itemSubtitle}>Enviada automaticamente</Text>
            </View>
            <Ionicons name="checkmark-circle-outline" size={20} color="#2ecc71" />
          </View>

        </View>

        {/* EXIBIÇÃO DO PROTOCOLO DO BANCO */}
        <Text style={styles.protocolText}>
          Protocolo: <Text style={styles.protocolBold}>#{protocolo}</Text>
        </Text>

        {/* BOTÃO AZUL ESCURO INFERIOR */}
        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.9} 
          onPress={voltarParaHome}
        >
          <Text style={styles.buttonText}>Voltar para Home</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}
