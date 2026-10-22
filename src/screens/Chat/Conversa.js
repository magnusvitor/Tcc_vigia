import React, { useState, useRef, useEffect } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from './styles';

export default function ComunidadeConversa({ route, navigation }) {

  // Pega o grupo com segurança
  const grupo = route?.params?.grupo;

  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [usuarioId, setUsuarioId] = useState(null);
  const [erroMensagens, setErroMensagens] = useState(null);

  const scrollViewRef = useRef();

  // =====================================================
  // IDENTIDADE DO USUÁRIO
  // (o backend aceita Bearer token ou usuario_id na requisição)
  // =====================================================

  async function carregarIdentidade() {
    try {
      const [idLogado, token] = await Promise.all([
        AsyncStorage.getItem('usuario_id'),
        AsyncStorage.getItem('token'),
      ]);

      return { usuarioId: idLogado, token };
    } catch (erro) {
      console.log('Erro ao carregar identidade:', erro);
      return { usuarioId: null, token: null };
    }
  }

  function cabecalhos(token) {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Se o grupo não foi enviado pela tela anterior
  useEffect(() => {
    if (!grupo) {
      setCarregando(false);

      Alert.alert(
        'Erro',
        'Não foi possível carregar os dados do grupo.',
        [
          {
            text: 'Voltar',
            onPress: () => navigation.goBack()
          }
        ]
      );
    }
  }, [grupo]);

  // Regras do grupo
  const apenasAdminsPodemEnviar =
    grupo?.somente_admins_enviam == 1 ||
    grupo?.somente_admins_enviam === true;

  const souAdminDoGrupo =
    grupo?.sou_admin == 1 ||
    grupo?.sou_admin === true;

  async function carregarMensagens() {

    if (!grupo?.id) {
      return;
    }

    try {
      const { usuarioId: idLogado, token } = await carregarIdentidade();

      if (idLogado) {
        setUsuarioId(Number(idLogado));
      }

      let url =
        `http://localhost/TCC/listar_mensagens.php?grupo_id=${grupo.id}`;

      if (idLogado) {
        url += `&usuario_id=${encodeURIComponent(idLogado)}`;
      }

      const response = await fetch(
        url,
        {
          method: 'GET',
          cache: 'no-store',
          headers: cabecalhos(token)
        }
      );

      if (!response.ok) {
        // Explica o motivo real (403 = não é membro, 401 = sessão inválida).
        let mensagem = 'Erro ao carregar mensagens.';

        try {
          const corpo = await response.json();

          if (corpo && corpo.mensagem) {
            mensagem = corpo.mensagem;
          }
        } catch (ignorado) {
          // Resposta sem JSON: mantém a mensagem padrão.
        }

        throw new Error(mensagem);
      }

      const dados = await response.json();

      if (dados.sucesso && Array.isArray(dados.mensagens)) {
        setMensagens(dados.mensagens);
        setErroMensagens(null);
      } else {
        setMensagens([]);
        setErroMensagens(
          dados.mensagem || 'Resposta inesperada do servidor.'
        );
        console.error('Resposta inesperada:', dados);
      }

    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      setMensagens([]);
      setErroMensagens(
        error.message || 'Erro ao carregar mensagens.'
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {

    if (!grupo?.id) {
      return;
    }

    carregarMensagens();

    const intervalo = setInterval(() => {
      carregarMensagens();
    }, 4000);

    return () => clearInterval(intervalo);

  }, [grupo?.id]);

  async function enviarMensagem() {

    if (!texto.trim()) {
      return;
    }

    if (!grupo?.id) {
      Alert.alert(
        'Erro',
        'O grupo não foi identificado.'
      );
      return;
    }

    // Regra de hierarquia
    if (apenasAdminsPodemEnviar && !souAdminDoGrupo) {

      Alert.alert(
        'Bloqueado',
        'Somente administradores podem enviar mensagens neste canal.'
      );

      return;
    }    try {

      const { usuarioId: idLogado, token } = await carregarIdentidade();

      const form = new FormData();

      form.append(
        'grupo_id',
        String(grupo.id)
      );

      form.append(
        'conteudo',
        texto.trim()
      );

      if (idLogado) {
        form.append('usuario_id', String(idLogado));
      }

      const response = await fetch(
        'http://localhost/TCC/enviar_mensagem.php',
        {
          method: 'POST',
          body: form,
          headers: cabecalhos(token)
        }
      );

      let resultado = null;

      try {
        resultado = await response.json();
      } catch (ignorado) {
        // Resposta sem JSON.
      }

      console.log('Resposta enviar mensagem:', resultado);

      if (!response.ok || !resultado || !resultado.sucesso) {

        Alert.alert(
          'Erro',
          (resultado && resultado.mensagem) ||
            'Não foi possível enviar a mensagem.'
        );

        return;
      }

      setTexto('');

      await carregarMensagens();

    } catch (error) {

      console.error(
        'Erro ao enviar mensagem:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível enviar a mensagem.'
      );
    }
  }

  // Enquanto verifica o grupo
  if (carregando && !grupo) {

    return (
      <View style={styles.loadingContainer}>

        <ActivityIndicator
          size="large"
          color="#745CD4"
        />

        <Text style={styles.loadingText}>
          Carregando grupo...
        </Text>

      </View>
    );
  }

  // Caso o grupo realmente não tenha sido enviado
  if (!grupo) {

    return (
      <View style={styles.loadingContainer}>

        <MaterialIcons
          name="error-outline"
          size={42}
          color="#745CD4"
        />

        <Text style={styles.errorTitle}>
          Grupo não encontrado
        </Text>

        <TouchableOpacity
          style={styles.backErrorButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backErrorText}>
            Voltar
          </Text>
        </TouchableOpacity>

      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }
      style={styles.container}
    >

      {/* Barra superior */}
      <View style={styles.navBar}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons
            name="keyboard-arrow-left"
            size={22}
            color="#1C1C1E"
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>

          <Text
            style={styles.navTitle}
            numberOfLines={1}
          >
            {grupo.nome || 'Grupo'}
          </Text>

          <Text style={styles.navSubtitle}>
            {grupo.participantes || '0'} participantes
          </Text>

        </View>

        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              'Informações',
              'Ações adicionais do grupo.'
            )
          }
        >
          <MaterialIcons
            name="more-vert"
            size={22}
            color="#1C1C1E"
          />
        </TouchableOpacity>

      </View>

      {/* Mensagens */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesScroll}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => {

          if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({
              animated: true
            });
          }

        }}
      >

        {mensagens.length === 0 ? (

          <View style={styles.emptyContainer}>

            <MaterialIcons
              name="forum"
              size={42}
              color="#C4B8EC"
            />

            <Text style={styles.emptyTitle}>
              {erroMensagens
                ? 'Não foi possível carregar as mensagens'
                : 'Nenhuma mensagem ainda'}
            </Text>

            <Text style={styles.emptyText}>
              {erroMensagens ||
                'Seja o primeiro a enviar uma mensagem.'}
            </Text>

          </View>

        ) : (

          mensagens.map((msg) => {

            const minha = usuarioId
              ? String(msg.usuario_id) === String(usuarioId)
              : String(msg.usuario_id) === String(
                  grupo?.criador_id || grupo?.criador || ''
                );

            return (

              <View
                key={msg.id}
                style={[
                  styles.msgWrapper,
                  minha
                    ? styles.myMessage
                    : styles.otherMessage
                ]}
              >

                {!minha && (

                  <Text style={styles.senderName}>
                    {msg.nome_usuario || 'Usuário'}
                  </Text>

                )}

                <View
                  style={[
                    styles.msgBubble,
                    minha
                      ? styles.msgBubbleMine
                      : styles.msgBubbleOther
                  ]}
                >

                  <Text
                    style={[
                      styles.msgText,
                      minha
                        ? styles.myText
                        : styles.otherText
                    ]}
                  >
                    {msg.conteudo}
                  </Text>

                </View>

              </View>
            );
          })

        )}

      </ScrollView>

      {/* Campo de mensagem */}
      <View style={styles.inputArea}>

        {apenasAdminsPodemEnviar &&
        !souAdminDoGrupo ? (

          <View style={styles.blockedBar}>

            <MaterialIcons
              name="lock"
              size={16}
              color="#A0AEC0"
            />

            <Text style={styles.blockedText}>
              Apenas administradores podem enviar mensagens.
            </Text>

          </View>

        ) : (

          <View style={styles.inputRow}>

            <TextInput
              style={styles.chatInput}
              placeholder="Digite uma mensagem..."
              placeholderTextColor="#A0AEC0"
              value={texto}
              onChangeText={setTexto}
              multiline
              maxLength={500}
            />

            <TouchableOpacity
              style={styles.sendButton}
              onPress={enviarMensagem}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="send"
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>

          </View>

        )}

      </View>

    </KeyboardAvoidingView>
  );
}


