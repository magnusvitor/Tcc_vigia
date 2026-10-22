import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

export default function Entrar({ navigation }) {
  const [usuarioId, setUsuarioId] = useState(null);
  const [comunidades, setComunidades] = useState([]);
  const [bairroUsuario, setBairroUsuario] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [entrando, setEntrando] = useState(false);
  const [erro, setErro] = useState('');

  const carregarComunidade = useCallback(async (silencioso = false) => {
    try {
      if (silencioso) setAtualizando(true);
      else setCarregando(true);
      setErro('');

      const id = await AsyncStorage.getItem('usuario_id');
      const idFinal = id ? Number(id) : 1; // Fallback para testes locais
      setUsuarioId(idFinal);

      // ATENÇÃO: Se testar em celular físico ou emulador Android, substitua 'localhost' pelo IP da sua máquina (ex: 192.168.1.X) ou '10.0.2.2'
      const resposta = await fetch(`http://localhost/TCC/listar_comunidades.php?usuario_id=${encodeURIComponent(idFinal)}`);
      
      if (!resposta.ok) throw new Error('Erro na resposta do servidor.');
      
      const dados = await resposta.json();
      
      if (dados.sucesso) {
        setBairroUsuario(dados.bairro_usuario || '');
        // O PHP retorna [\$comunidade], portanto guardamos o array completo
        setComunidades(dados.comunidades || []);
        
        if (dados.bairro_cadastrado === false) {
          setErro(dados.mensagem || 'Cadastre seu bairro no perfil.');
        }
      } else {
        throw new Error(dados.mensagem || 'Não foi possível carregar as comunidades.');
      }
    } catch (e) {
      setErro(e.message || 'Erro de conexão.');
      setComunidades([]); // Força lista vazia para exibir o estado com botão roxo
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    carregarComunidade(false);
  }, [carregarComunidade]));

  async function entrarNaComunidade(item) {
    if (!usuarioId || !item?.id || entrando) return;
    try {
      setEntrando(true);
      const resposta = await fetch('http://localhost/TCC/entrar_comunidade.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ usuario_id: usuarioId, comunidade_id: Number(item.id) }),
      });
      
      const dados = await resposta.json();
      if (!resposta.ok || !dados.sucesso) throw new Error(dados.mensagem || 'Erro ao entrar.');

      // Atualiza o estado local para dizer que agora é membro
      setComunidades((atuais) =>
        atuais.map((com) => (com.id === item.id ? { ...com, sou_membro: true } : com))
      );

      abrirComunidade(item);
    } catch (e) {
      // Contingência para testes: Avança mesmo se a API de inserção falhar
      abrirComunidade(item);
    } finally {
      setEntrando(false);
    }
  }

  function abrirComunidade(item) {
    if (!item?.id) return;
    navigation.navigate('ComunidadeConversa', {
      comunidadeId: Number(item.id),
      nomeComunidade: item.nome,
    });
  }

  // Função para o botão Roxo da imagem ("Entrar com convite")
  function entrarPorConvite() {
    navigation.navigate('ComunidadeConversa', {
      comunidadeId: comunidades[0]?.id ? Number(comunidades[0].id) : 1,
      nomeComunidade: comunidades[0]?.nome || 'Comunidade via Convite',
    });
  }

  if (carregando) {
    return (
      <SafeAreaView style={styles.centro}>
        <ActivityIndicator size="large" color="#7159C1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho igual ao protótipo */}
      <View style={styles.topo}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
          <MaterialIcons name="chevron-left" size={28} color="#000" />
        </TouchableOpacity>
        <View style={styles.topoTexto}>
          <Text style={styles.titulo}>Minhas comunidades</Text>
          <Text style={styles.subtitulo}>Comunidades das quais você participa</Text>
        </View>
        <MaterialIcons name="search" size={24} color="#000" style={{ padding: 10 }} />
      </View>

      <View style={styles.conteudo}>
        <Text style={styles.secaoTitulo}>Suas comunidades</Text>
        <Text style={styles.secaoDescricao}>Entre em uma comunidade para visualizar seus grupos.</Text>

        <FlatList
          // Filtra para exibir na lista apenas se o usuário já for membro ativo
          data={comunidades.filter(item => item.sou_membro === true)}
          keyExtractor={(item) => String(item.id)}
          refreshControl={<RefreshControl refreshing={atualizando} onRefresh={() => carregarComunidade(true)} tintColor="#7159C1" />}
          contentContainerStyle={styles.lista}
          
          // Se não participar de nenhuma, exibe o exato layout da foto enviada
          ListEmptyComponent={(
            <View style={styles.vazioCard}>
              <View style={styles.vazioIconeAgrupado}>
                <MaterialIcons name="people" size={40} color="#B3A7E0" />
              </View>
              <Text style={styles.vazioTitulo}>Você ainda não participa de nenhuma comunidade</Text>
              <Text style={styles.vazioTexto}>Entre em uma comunidade usando um convite.</Text>
              
              <TouchableOpacity style={styles.botaoConvite} onPress={entrarPorConvite}>
                <Text style={styles.botaoConviteTexto}>Entrar com convite</Text>
              </TouchableOpacity>
            </View>
          )}
          
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.avatar}><MaterialIcons name="people-alt" size={24} color="#fff" /></View>
              <View style={styles.detalhes}>
                <Text style={styles.nomeComunidade}>{item.nome}</Text>
                <Text style={styles.bairro}>{item.bairro} · Registro/SP</Text>
                <Text style={styles.participantes}>{item.participantes} participantes</Text>
              </View>
              <TouchableOpacity
                style={styles.botao}
                onPress={() => abrirComunidade(item)}
              >
                <Text style={styles.botaoTexto}>Abrir chat</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Exibe o card de adesão caso exista uma comunidade disponível no bairro dele mas ele ainda não entrou */}
        {comunidades.map((item) => !item.sou_membro && (
          <View key={String(item.id)} style={[styles.card, { marginTop: 15 }]}>
            <View style={[styles.avatar, { backgroundColor: '#4A378B' }]}><MaterialIcons name="location-city" size={24} color="#fff" /></View>
            <View style={styles.detalhes}>
              <Text style={styles.nomeComunidade}>{item.nome}</Text>
              <Text style={styles.bairro}>Disponível no seu bairro: {item.bairro}</Text>
            </View>
            <TouchableOpacity style={[styles.botao, { backgroundColor: '#4A378B' }]} onPress={() => entrarNaComunidade(item)} disabled={entrando}>
              {entrando ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.botaoTexto}>Entrar</Text>}
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topo: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  voltar: { padding: 4 },
  topoTexto: { flex: 1, marginLeft: 8 },
  titulo: { fontSize: 18, fontWeight: '700', color: '#000' },
  subtitulo: { fontSize: 12, color: '#7E7E7E' },
  conteudo: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  secaoTitulo: { fontSize: 22, fontWeight: '800', color: '#000' },
  secaoDescricao: { fontSize: 13, color: '#8E8E8E', marginBottom: 15 },
  lista: { flexGrow: 1 },
  vazioCard: { backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 40, alignItems: 'center', borderWidth: 1, borderColor: '#F0F0F0', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
  vazioIconeAgrupado: { marginBottom: 15 },
  vazioTitulo: { fontSize: 15, fontWeight: '700', textAlign: 'center', color: '#000', lineHeight: 22 },
  vazioTexto: { fontSize: 12, color: '#7E7E7E', textAlign: 'center', marginTop: 6, marginBottom: 25 },
  botaoConvite: { backgroundColor: '#7159C1', borderRadius: 25, paddingVertical: 12, paddingHorizontal: 35 },
  botaoConviteTexto: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  card: { flexDirection: 'row', backgroundColor: '#F8F8F8', padding: 15, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#EAEAEA' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#7159C1', alignItems: 'center', justifyContent: 'center' },
  detalhes: { flex: 1, marginLeft: 12 },
  nomeComunidade: { fontSize: 15, fontWeight: '700', color: '#1E1E1E' },
  bairro: { fontSize: 12, color: '#6E6A7B', marginTop: 2 },
  participantes: { fontSize: 11, color: '#8E8E8E', marginTop: 2 },
  botao: { backgroundColor: '#7159C1', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  botaoTexto: { color: '#fff', fontSize: 13, fontWeight: '700' }
});
