import 'react-native-gesture-handler'; 
import React, { useEffect, useState } from 'react';
import { View,Text,TextInput, TouchableOpacity,ActivityIndicator, Image,Alert} from 'react-native';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const valid =
      email.includes('@') &&
      password.trim().length >= 6;
    setIsValid(valid);

    if(error){
      setError('');
    }
  },[email,password]);

  async function handleLogin(){

    setError('');
    if(!isValid){
      setError(
        'Preencha email e senha corretamente.'
      );
      return;
    }
    setLoading(true);
    try{
      const response = await fetch(

        "http://localhost/TCC/login.php",

        {

          method:"POST",

          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
          email:email,
          senha:password
          })
        }
      );

      const data = await response.json();
      if(data.id){

        await AsyncStorage.setItem(

          "usuario_id",data.id.toString()
        );
        await AsyncStorage.setItem(
          "usuario_nome",data.nome
        );

        // Login realizado
        navigation.replace('App');
      }else{
        if(data.erro === "Usuário não encontrado"){

          Alert.alert(
            "Conta não encontrada",
            "Você ainda não possui cadastro. Deseja criar uma conta?",
            [
              {
                text:"Cancelar",
                style:"cancel"
              },

              {
                text:"Cadastrar",
                onPress:()=>{
                navigation.navigate('Cadastro');

                }
              }
            ]
          );

        }else{
          setError(
            data.erro ||
            "Erro ao realizar login"
          );
        }
      }

    }
    catch(error){
    Alert.alert(
        "Erro",
        "Não foi possível conectar ao servidor."
      );

    }finally{
      setLoading(false);
    }
  }

  return (

    <View style={styles.container}>

      <Image
        source={
          require('../../../assets/logo.png')
        }
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Bem-vindo de volta!</Text>

      <Text style={styles.subtitle}>Faça login para acessar sua conta </Text>

      <Text style={styles.label}>E-mail</Text>

      <TextInput
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />

      <Text style={styles.label}> Senha</Text>
      <TextInput
        placeholder="Digite sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {
        error ?

        <Text style={styles.error}>
          {error}
        </Text>
        :
        null
      }
      <TouchableOpacity
        style={[
          styles.button,
          (!isValid || loading) &&
          styles.buttonDisabled
        ]}
        onPress={handleLogin}
        disabled={

          !isValid || loading
        }
      >
        {
          loading ?<ActivityIndicator color="#fff"/>: 
          <Text style={styles.buttonText}> Entrar</Text>
        }
      </TouchableOpacity>
      <TouchableOpacity

        onPress={() =>
        navigation.navigate('Cadastro')
        }
      >
      <Text style={styles.footerText}> Ainda não tem conta? <Text style={styles.link}>

            {' '}Faça já seu cadastro

          </Text>
        </Text>
      </TouchableOpacity>
   </View>
  );
}