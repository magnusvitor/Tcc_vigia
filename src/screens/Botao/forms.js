
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
  StyleSheet,
  Platform,
} from 'react-native';

import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

export default function Forms({ navigation }) {
  const [tipo, setTipo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [localizacao, setLocalizacao] = useState(null);
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [carregandoGPS, setCarregandoGPS] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const categorias = ['Roubo', 'Furto', 'Homicídio', 'Outro'];

  async function capturarLocalizacao() {
    try {
      setCarregandoGPS(true);

      const permissao =
        await Location.requestForegroundPermissionsAsync();

      if (permissao.status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Permita o acesso à localização para compartilhar sua posição no alerta.'
        );
        return;
      }

      const posicao = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const latitude = posicao.coords.latitude;
      const longitude = posicao.coords.longitude;

      setLocalizacao({ latitude, longitude });

      try {
        const enderecos = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (enderecos.length > 0) {
          const local = enderecos[0];

          setEndereco(
            [
              local.street,
              local.streetNumber,
              local.subregion,
              local.city,
            ]
              .filter(Boolean)
              .join(', ')
          );

          setBairro(local.district || local.subregion || '');
        }
      } catch (erroEndereco) {
        console.log('Não foi possível obter o endereço:', erroEndereco);
      }

      Alert.alert('Localização obtida', 'O GPS capturou sua localização.');
    } catch (erro) {
      Alert.alert(
        'Erro de localização',
        'Não foi possível obter sua localização. Verifique se o GPS está ativado.'
      );
    } finally {
      setCarregandoGPS(false);
    }
  }

  function normalizarTelefone(telefone) {
    let numero = String(telefone || '').replace(/\D/g, '');

    // Considera números brasileiros com DDD.
    if (numero.startsWith('0')) {
      numero = numero.replace(/^0+/, '');
    }

    if (!numero.startsWith('55')) {
      numero = `55${numero}`;
    }

    return numero;
  }

  async function abrirWhatsApp(contatos, dados) {
    if (!Array.isArray(contatos) || contatos.length === 0) {
      Alert.alert(
        'Nenhum contato encontrado',
        'O alerta foi registrado, mas não foram retornados contatos de emergência. Verifique os contatos cadastrados no seu perfil.'
      );
      return;
    }

    const contato = contatos.find(item => item.telefone);

    if (!contato) {
      Alert.alert(
        'Telefone indisponível',
        'Nenhum dos contatos retornados possui telefone cadastrado.'
      );
      return;
    }

    const telefone = normalizarTelefone(contato.telefone);

    const linkMapa =
      dados.latitude != null && dados.longitude != null
        ? `https://www.google.com/maps?q=${dados.latitude},${dados.longitude}`
        : 'Localização indisponível';

    const mensagem =
      `🚨 ALERTA DE EMERGÊNCIA - SMC\n\n` +
      `Olá, ${contato.nome || 'preciso da sua ajuda'}!\n` +
      `Estou acionando meu alerta de emergência pelo SMC e preciso de ajuda.\n\n` +
      `Tipo: ${dados.tipo}\n` +
      `Descrição: ${dados.descricao || 'Não informada'}\n` +
      `Endereço: ${dados.endereco || 'Não identificado'}\n` +
      `Bairro: ${dados.bairro || 'Não identificado'}\n` +
      `Minha localização: ${linkMapa}\n\n` +
      `Por favor, tente entrar em contato comigo assim que possível.`;

    const url =
      `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    try {
      await Linking.openURL(url);
    } catch (erro) {
      Alert.alert(
        'Erro ao abrir o WhatsApp',
        'Não foi possível abrir o WhatsApp neste dispositivo.'
      );
    }
  }

  async function acionarEmergencia() {
    if (!tipo) {
      Alert.alert('Atenção', 'Selecione o tipo de emergência.');
      return;
    }

    setEnviando(true);

    try {
      const usuarioId = await AsyncStorage.getItem('usuario_id');

      if (!usuarioId) {
        Alert.alert(
          'Sessão não encontrada',
          'Entre novamente na sua conta para acionar a emergência.'
        );
        return;
      }

      // Atualiza a localização no momento do acionamento.
      let coordenadas = localizacao;

      try {
        const permissao =
          await Location.requestForegroundPermissionsAsync();

        if (permissao.status === 'granted') {
          const posicao = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

          coordenadas = {
            latitude: posicao.coords.latitude,
            longitude: posicao.coords.longitude,
          };

          setLocalizacao(coordenadas);

          try {
            const lista = await Location.reverseGeocodeAsync(coordenadas);

            if (lista.length > 0) {
              const local = lista[0];

              const novoEndereco = [
                local.street,
                local.streetNumber,
                local.subregion,
                local.city,
              ]
                .filter(Boolean)
                .join(', ');

              setEndereco(novoEndereco);
              setBairro(local.district || local.subregion || '');

              // Usa os valores recém-capturados na mensagem e no registro.
              var enderecoAtual = novoEndereco;
              var bairroAtual = local.district || local.subregion || '';
            }
          } catch (erro) {
            console.log('Falha ao identificar endereço:', erro);
          }
        }
      } catch (erroGPS) {
        console.log('GPS indisponível:', erroGPS);
      }

      const enderecoFinal =
        typeof enderecoAtual !== 'undefined' ? enderecoAtual : endereco;

      const bairroFinal =
        typeof bairroAtual !== 'undefined' ? bairroAtual : bairro;

      const latitude = coordenadas?.latitude ?? null;
      const longitude = coordenadas?.longitude ?? null;

      const urlPHP =
        Platform.OS === 'android'
          ? 'http://10.0.239.198/TCC/salvar_alerta_emergencia.php'
          : 'http://localhost/TCC/salvar_alerta_emergencia.php';

      const resposta = await fetch(urlPHP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          usuario_id: Number(usuarioId),
          tipo,
          descricao: descricao.trim(),
          bairro: bairroFinal,
          endereco: enderecoFinal,
          latitude,
          longitude,
        }),
      });

      const resultado = await resposta.json();

      if (!resposta.ok || resultado.sucesso !== true) {
        throw new Error(
          resultado.mensagem || 'Não foi possível registrar o alerta.'
        );
      }

      const dadosAlerta = {
        tipo,
        descricao: descricao.trim(),
        bairro: bairroFinal,
        endereco: enderecoFinal,
        latitude,
        longitude,
      };

      Alert.alert(
        'Alerta registrado',
        'O alerta foi registrado. Deseja abrir o WhatsApp para avisar seu contato de emergência?',
        [
          {
            text: 'Agora não',
            style: 'cancel',
            onPress: () => navigation?.goBack?.(),
          },
          {
            text: 'Avisar contato',
            onPress: () => {
              abrirWhatsApp(resultado.contatos, dadosAlerta);
            },
          },
        ],
        { cancelable: false }
      );
    } catch (erro) {
      Alert.alert(
        'Erro',
        erro.message || 'Ocorreu um erro ao acionar a emergência.'
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity
        style={styles.voltar}
        onPress={() => navigation?.goBack?.()}
      >
        <MaterialIcons name="arrow-back" size={25} color="#152D63" />
        <Text style={styles.textoVoltar}>Voltar</Text>
      </TouchableOpacity>

      <View style={styles.cabecalho}>
        <View style={styles.iconeEmergencia}>
          <MaterialIcons name="emergency" size={36} color="#FFFFFF" />
        </View>

        <Text style={styles.titulo}>Alerta de emergência</Text>
        <Text style={styles.subtitulo}>
          Informe a situação e avise seu contato de emergência.
        </Text>
      </View>

      <View style={styles.aviso}>
        <MaterialIcons name="info-outline" size={22} color="#7259B8" />
        <Text style={styles.textoAviso}>
          Use este recurso para solicitar ajuda em uma situação de emergência.
        </Text>
      </View>

      <Text style={styles.rotulo}>Tipo de emergência *</Text>

      <View style={styles.categorias}>
        {categorias.map(categoria => (
          <TouchableOpacity
            key={categoria}
            style={[
              styles.categoria,
              tipo === categoria && styles.categoriaSelecionada,
            ]}
            onPress={() => setTipo(categoria)}
          >
            <Text
              style={[
                styles.textoCategoria,
                tipo === categoria && styles.textoCategoriaSelecionada,
              ]}
            >
              {categoria}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.rotulo}>Descrição</Text>

      <TextInput
        style={styles.campoDescricao}
        placeholder="Descreva brevemente o que está acontecendo..."
        placeholderTextColor="#858B98"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        textAlignVertical="top"
        maxLength={1000}
      />

      <Text style={styles.rotulo}>Sua localização</Text>

      <View style={styles.localizacao}>
        <MaterialIcons name="location-on" size={25} color="#7259B8" />

        <View style={styles.dadosLocalizacao}>
          <Text style={styles.tituloLocalizacao}>
            {localizacao ? 'GPS localizado' : 'Localização não capturada'}
          </Text>

          <Text style={styles.textoLocalizacao}>
            {localizacao
              ? `${localizacao.latitude.toFixed(6)}, ${localizacao.longitude.toFixed(6)}`
              : 'Capture sua localização para incluir no alerta.'}
          </Text>

          {!!endereco && (
            <Text style={styles.textoEndereco}>{endereco}</Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.botaoGPS}
        onPress={capturarLocalizacao}
        disabled={carregandoGPS || enviando}
      >
        {carregandoGPS ? (
          <ActivityIndicator color="#7259B8" />
        ) : (
          <MaterialIcons name="my-location" size={21} color="#7259B8" />
        )}

        <Text style={styles.textoBotaoGPS}>
          {carregandoGPS ? 'Obtendo localização...' : 'Atualizar localização'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.botaoEmergencia,
          enviando && styles.botaoDesabilitado,
        ]}
        onPress={acionarEmergencia}
        disabled={enviando || carregandoGPS}
      >
        {enviando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <MaterialIcons name="notifications-active" size={24} color="#FFFFFF" />
        )}

        <Text style={styles.textoBotaoEmergencia}>
          {enviando ? 'Acionando emergência...' : 'ACIONAR EMERGÊNCIA'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.rodape}>
        Após registrar o alerta, você poderá abrir o WhatsApp para enviar a
        mensagem ao contato de emergência.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
  conteudo: {
    padding: 22,
    paddingBottom: 40,
  },
  voltar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  textoVoltar: {
    color: '#152D63',
    fontSize: 15,
    fontWeight: '600',
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconeEmergencia: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#D93445',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  titulo: {
    fontSize: 25,
    fontWeight: '800',
    color: '#152D63',
    textAlign: 'center',
  },
  subtitulo: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 8,
  },
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEE8FF',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    marginBottom: 24,
  },
  textoAviso: {
    color: '#493B78',
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },
  rotulo: {
    color: '#152D63',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 12,
  },
  categorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoria: {
    paddingVertical: 12,
    paddingHorizontal: 17,
    borderWidth: 1,
    borderColor: '#D7DCE7',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  categoriaSelecionada: {
    backgroundColor: '#152D63',
    borderColor: '#152D63',
  },
  textoCategoria: {
    fontSize: 14,
    fontWeight: '600',
    color: '#48536A',
  },
  textoCategoriaSelecionada: {
    color: '#FFFFFF',
  },
  campoDescricao: {
    minHeight: 115,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7DCE7',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#202938',
  },
  localizacao: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E5EF',
    borderRadius: 12,
    padding: 15,
  },
  dadosLocalizacao: {
    flex: 1,
  },
  tituloLocalizacao: {
    fontSize: 14,
    fontWeight: '700',
    color: '#152D63',
    marginBottom: 5,
  },
  textoLocalizacao: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  textoEndereco: {
    fontSize: 12,
    color: '#48536A',
    marginTop: 6,
    lineHeight: 18,
  },
  botaoGPS: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
    padding: 14,
    borderWidth: 1,
    borderColor: '#8971D3',
    borderRadius: 12,
    marginTop: 12,
  },
  textoBotaoGPS: {
    color: '#7259B8',
    fontSize: 14,
    fontWeight: '700',
  },
  botaoEmergencia: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#D93445',
    borderRadius: 14,
    paddingVertical: 17,
    marginTop: 28,
  },
  botaoDesabilitado: {
    opacity: 0.7,
  },
  textoBotaoEmergencia: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  rodape: {
    color: '#777F8E',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 16,
  },
});
