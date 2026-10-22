import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MinhasDenuncias({ navigation }) {
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [bairro, setBairro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const categorias = [
    'Roubo',
    'Furto',
    'Homicídio',
    'Outro',
  ];

  async function enviarDenuncia() {
    if (!categoria) {
      Alert.alert(
        'Atenção',
        'Selecione o tipo da ocorrência.'
      );
      return;
    }

    if (!descricao.trim()) {
      Alert.alert(
        'Atenção',
        'Digite uma descrição da ocorrência.'
      );
      return;
    }

    try {
      setEnviando(true);

      const usuarioId = await AsyncStorage.getItem('usuario_id');

      if (!usuarioId) {
        Alert.alert(
          'Erro',
          'Não foi possível identificar o usuário logado.'
        );
        return;
      }

      const resposta = await fetch(
        'http://localhost/TCC/salvar_denuncia.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            usuario_id: usuarioId,
            categoria: categoria,
            descricao: descricao.trim(),
            bairro: bairro.trim() || 'Centro',
          }),
        }
      );

      const texto = await resposta.text();

      console.log('Resposta do PHP:', texto);

      let data;

      try {
        data = JSON.parse(texto);
      } catch (erro) {
        Alert.alert(
          'Erro',
          'O servidor retornou uma resposta inválida.'
        );
        return;
      }

      if (data.sucesso) {
        Alert.alert(
          'Denúncia enviada',
          `Sua denúncia foi registrada com sucesso.\n\nProtocolo: ${data.protocolo}`,
          [
            {
              text: 'OK',
              onPress: () => {
                setCategoria('');
                setDescricao('');
                setBairro('');

                navigation.navigate('Ocorrencias');
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Erro',
          data.mensagem ||
            'Não foi possível registrar a denúncia.'
        );
      }

    } catch (erro) {
      console.log('Erro ao enviar denúncia:', erro);

      Alert.alert(
        'Erro',
        'Não foi possível conectar ao servidor.'
      );

    } finally {
      setEnviando(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >

      {/* CABEÇALHO */}
      <View style={styles.header}>

        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.voltarIcone}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerTexto}>
          <Text style={styles.titulo}>
            Registrar denúncia
          </Text>

          <Text style={styles.subtitulo}>
            Compartilhe uma ocorrência para ajudar na segurança da comunidade.
          </Text>
        </View>

      </View>

      {/* CARD PRINCIPAL */}
      <View style={styles.card}>

        {/* TIPO */}
        <Text style={styles.label}>
          Tipo da ocorrência
        </Text>

        <Text style={styles.labelSecundario}>
          Selecione uma categoria
        </Text>

        <View style={styles.categorias}>
          {categorias.map((item) => (
            <TouchableOpacity
              key={item}
              activeOpacity={0.8}
              style={[
                styles.categoriaButton,
                categoria === item &&
                  styles.categoriaButtonAtiva,
              ]}
              onPress={() => setCategoria(item)}
            >
              <Text
                style={[
                  styles.categoriaTexto,
                  categoria === item &&
                    styles.categoriaTextoAtiva,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* BAIRRO */}
        <Text style={styles.label}>
          Bairro
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite o bairro da ocorrência"
          placeholderTextColor="#9CA3AF"
          value={bairro}
          onChangeText={setBairro}
        />

        {/* DESCRIÇÃO */}
        <Text style={styles.label}>
          Descrição
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.textArea,
          ]}
          placeholder="Descreva o que aconteceu..."
          placeholderTextColor="#9CA3AF"
          value={descricao}
          onChangeText={setDescricao}
          multiline
          textAlignVertical="top"
        />

        <Text style={styles.contador}>
          {descricao.length} caracteres
        </Text>

      </View>

      {/* AVISO */}
      <View style={styles.aviso}>

        <View style={styles.avisoIcone}>
          <Text style={styles.avisoIconeTexto}>
            i
          </Text>
        </View>

        <View style={styles.avisoConteudo}>

          <Text style={styles.avisoTitulo}>
            Sobre sua denúncia
          </Text>

          <Text style={styles.avisoTexto}>
            As informações enviadas serão encaminhadas
            para análise pelas autoridades responsáveis.
          </Text>

        </View>

      </View>

      {/* BOTÃO ENVIAR */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          styles.enviarButton,
          enviando && styles.enviarButtonDesativado,
        ]}
        onPress={enviarDenuncia}
        disabled={enviando}
      >

        {enviando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.enviarTexto}>
            Enviar denúncia
          </Text>
        )}

      </TouchableOpacity>

      <Text style={styles.rodape}>
        Ao enviar, você confirma que as informações fornecidas são verdadeiras.
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },

  content: {
    padding: 20,
    paddingTop: 18,
    paddingBottom: 45,
  },

  /* HEADER */

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 22,
  },

  botaoVoltar: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EAF0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  voltarIcone: {
    fontSize: 29,
    lineHeight: 30,
    color: '#152D63',
    fontWeight: '400',
    marginTop: -3,
  },

  headerTexto: {
    flex: 1,
  },

  titulo: {
    fontSize: 23,
    fontWeight: '700',
    color: '#152D63',
    marginBottom: 5,
  },

  subtitulo: {
    fontSize: 13,
    color: '#718096',
    lineHeight: 19,
  },

  /* CARD */

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ECEEF4',
    marginBottom: 14,
  },

  /* LABELS */

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#152D63',
    marginBottom: 6,
    marginTop: 4,
  },

  labelSecundario: {
    fontSize: 12,
    color: '#8A94A6',
    marginBottom: 12,
  },

  /* CATEGORIAS */

  categorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },

  categoriaButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E1E5ED',
  },

  categoriaButtonAtiva: {
    backgroundColor: '#745CD4',
    borderColor: '#745CD4',
  },

  categoriaTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },

  categoriaTextoAtiva: {
    color: '#FFFFFF',
  },

  /* INPUT */

  input: {
    backgroundColor: '#F9FAFC',
    borderWidth: 1,
    borderColor: '#E1E5ED',
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1C1C1E',
    marginBottom: 14,
  },

  textArea: {
    height: 125,
    paddingTop: 13,
    textAlignVertical: 'top',
  },

  contador: {
    textAlign: 'right',
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: -8,
  },

  /* AVISO */

  aviso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0EDFF',
    borderRadius: 13,
    padding: 14,
    marginBottom: 18,
  },

  avisoIcone: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#745CD4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  avisoIconeTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  avisoConteudo: {
    flex: 1,
  },

  avisoTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B46B5',
    marginBottom: 4,
  },

  avisoTexto: {
    fontSize: 12,
    color: '#6B5FA3',
    lineHeight: 18,
  },

  /* BOTÃO */

  enviarButton: {
    height: 52,
    backgroundColor: '#745CD4',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  enviarButtonDesativado: {
    opacity: 0.65,
  },

  enviarTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  /* RODAPÉ */

  rodape: {
    textAlign: 'center',
    fontSize: 11,
    color: '#9CA3AF',
    lineHeight: 16,
    marginTop: 13,
    paddingHorizontal: 15,
  },

});