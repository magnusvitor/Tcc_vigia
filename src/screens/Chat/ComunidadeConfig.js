import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';

import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const API_URL = `http://localhost/TCC`;

export default function ComunidadeConfig({ route, navigation }) {
  const { comunidadeId } = route.params || { comunidadeId: 1 };
  
  const [dadosComunidade, setDadosComunidade] = useState(null);
  const [membros, setMembros] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // States de configuração estilo WhatsApp
  const [apenasAdminPosta, setApenasAdminPosta] = useState(false);
  const [notificacoesSilenciadas, setNotificacoesSilenciadas] = useState(false);

  // Busca os dados da comunidade e lista os moradores direto do MySQL
  const buscarDadosConfig = useCallback(async () => {
    try {
      setCarregando(true);
      const url = `${API_URL}/obter_config_comunidade.php?comunidade_id=${comunidadeId}`;
      const resposta = await fetch(url);
      
      if (!resposta.ok) throw new Error();
      
      const dados = await resposta.json();
      if (dados.sucesso) {
        setDadosComunidade(dados.comunidade);
        setMembros(dados.membros || []);
      } else {
        Alert.alert('Erro', dados.mensagem || 'Erro ao carregar dados do grupo.');
      }
    } catch (e) {
      Alert.alert('Erro de Conexão', 'Não foi possível carregar as informações do banco de dados.');
    } finally {
      setCarregando(false);
    }
  }, [comunidadeId]);

  useEffect(() => {
    buscarDadosConfig();
  }, [buscarDadosConfig]);

  const sairDoGrupo = () => {
    Alert.alert('Sair da comunidade', 'Tem certeza que deseja sair deste grupo de moradores?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => navigation.popToTop() }
    ]);
  };

  if (carregando) {
    return (
      <SafeAreaView style={styles.centro}>
        <ActivityIndicator size="large" color="#7159C1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Botão flutuante para voltar no topo superior esquerdo */}
      <View style={styles.topoVoltar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botaoVoltarCirculo}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner de Identificação puxando dados reais */}
        <View style={styles.banner}>
          <View style={styles.avatarGrande}>
            <MaterialIcons name="people" size={50} color="#7159C1" />
          </View>
          <Text style={styles.tituloGrupo}>{dadosComunidade?.nome || 'Comunidade'}</Text>
          <Text style={styles.subtituloGrupo}>Bairro: {dadosComunidade?.bairro} · {membros.length} participantes</Text>
          {dadosComunidade?.descricao ? (
            <Text style={styles.descricaoGrupo}>{dadosComunidade.descricao}</Text>
          ) : null}
        </View>

        {/* Seção 1: Configurações estilo WhatsApp */}
        <View style={styles.secao}>
          <View style={styles.linhaConfig}>
            <View style={styles.configInfo}>
              <MaterialIcons name="lock" size={22} color="#555" />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.configTitulo}>Apenas administradores postam</Text>
                <Text style={styles.configSub}>Restringir o envio de mensagens no chat</Text>
              </View>
            </View>
            <Switch 
              value={apenasAdminPosta} 
              onValueChange={setApenasAdminPosta}
              trackColor={{ false: '#767577', true: '#B3A7E0' }}
              thumbColor={apenasAdminPosta ? '#7159C1' : '#f4f3f4'}
            />
          </View>

          <View style={styles.linhaConfig}>
            <View style={styles.configInfo}>
              <MaterialIcons name="notifications-off" size={22} color="#555" />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.configTitulo}>Silenciar notificações</Text>
                <Text style={styles.configSub}>Desativar alertas sonoros deste grupo</Text>
              </View>
            </View>
            <Switch 
              value={notificacoesSilenciadas} 
              onValueChange={setNotificacoesSilenciadas}
              trackColor={{ false: '#767577', true: '#B3A7E0' }}
              thumbColor={notificacoesSilenciadas ? '#7159C1' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Seção 2: Lista Dinâmica de Membros */}
        <Text style={styles.secaoTitulo}>{membros.length} participantes</Text>
        <View style={styles.secao}>
          <TouchableOpacity style={styles.adicionarMembro} onPress={() => Alert.alert('Convite', 'Código de convite copiado!')}>
            <Ionicons name="share-social-outline" size={22} color="#7159C1" />
            <Text style={styles.adicionarMembroTexto}>Convidar moradores para o grupo</Text>
          </TouchableOpacity>

          {membros.map((item, index) => (
            <View key={String(item.usuario_id || index)} style={styles.itemMembro}>
              <View style={styles.avatarMembro}><MaterialIcons name="person" size={18} color="#666" /></View>
              <Text style={styles.nomeMembro}>{item.nome}</Text>
              {item.cargo === 'Administrador(a)' && (
                <View style={styles.badgeAdmin}><Text style={styles.badgeAdminTexto}>Admin</Text></View>
              )}
            </View>
          ))}
        </View>

        {/* Botão Sair */}
        <TouchableOpacity style={styles.botaoSair} onPress={sairDoGrupo}>
          <MaterialIcons name="exit-to-app" size={22} color="#D8000C" />
          <Text style={styles.botaoSairTexto}>Sair da comunidade</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FA' },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topoVoltar: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 15, left: 15, zIndex: 10 },
  botaoVoltarCirculo: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2 },
  banner: { backgroundColor: '#FFF', alignItems: 'center', paddingVertical: 30, paddingHorizontal: 20, borderBottomWidth: 1, borderColor: '#EAEAEA', paddingTop: Platform.OS === 'ios' ? 80 : 60 },
  avatarGrande: { width: 84, height: 84, borderRadius: 42, backgroundColor: '#EEE9FC', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  tituloGrupo: { fontSize: 20, fontWeight: '700', color: '#1E1E1E', textAlign: 'center' },
  subtituloGrupo: { fontSize: 13, color: '#777', marginTop: 4, textAlign: 'center' },
  descricaoGrupo: { fontSize: 13, color: '#555', marginTop: 12, textAlign: 'center', lineHeight: 18, backgroundColor: '#F9F9F9', padding: 10, borderRadius: 8, width: '100%' },
  secao: { backgroundColor: '#FFF', marginTop: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#EAEAEA', paddingHorizontal: 16 },
  linhaConfig: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  configInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  configTitulo: { fontSize: 15, fontWeight: '600', color: '#333' },
  configSub: { fontSize: 12, color: '#777', marginTop: 2 },
  secaoTitulo: { fontSize: 13, fontWeight: '700', color: '#666', marginLeft: 16, marginTop: 18, marginBottom: 6, textTransform: 'uppercase' },
  adicionarMembro: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  adicionarMembroTexto: { fontSize: 15, color: '#7159C1', fontWeight: '600', marginLeft: 12 },
  itemMembro: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  avatarMembro: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  nomeMembro: { fontSize: 15, color: '#333', marginLeft: 12, flex: 1 },
  badgeAdmin: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: '#EEE9FC', borderWidth: 1, borderColor: '#B3A7E0' },
  badgeAdminTexto: { fontSize: 10, color: '#7159C1', fontWeight: '700' },
  botaoSair: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', marginTop: 20, padding: 14, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#EAEAEA', marginBottom: 40 },
  botaoSairTexto: { color: '#D8000C', fontSize: 15, fontWeight: '700', marginLeft: 8 }
});
