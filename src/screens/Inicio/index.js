import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';

export default function Inicio() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>

      <Image
        source={require('../../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>SMC</Text>
      <Text style={styles.subtitle}>
        Sistemas de Monitoramento{'\n'}Colaborativo
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Começar</Text>
      </TouchableOpacity>

    </View>
  );
}