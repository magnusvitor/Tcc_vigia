import React,{useEffect,useState} from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleSheet,
} from 'react-native';

import {MaterialIcons} from '@expo/vector-icons';

const API_URL = 'http://localhost/TCC';

export default function Cameras({navigation}) {

  const [cameras,setCameras] = useState([]);
  const [carregando,setCarregando] = useState(true);
  const [atualizando,setAtualizando] = useState(false);

  useEffect(() => {
    carregarCameras();
  },[]);

  const carregarCameras = async () => {
    try {

      const resposta = await fetch(
        `${API_URL}/listar_cameras.php`
      );

      const texto = await resposta.text();

      let dados;

      try {
        dados = JSON.parse(texto);
      } catch {
        console.log('Resposta do PHP:',texto);
        throw new Error('Resposta inválida do servidor.');
      }

      if(dados.status === 'sucesso'){
        setCameras(dados.cameras || []);
      }else{
        Alert.alert(
          'Erro',
          dados.mensagem || 'Não foi possível carregar as câmeras.'
        );
      }

    }catch(erro){

      console.log('Erro ao carregar câmeras:',erro);

      Alert.alert(
        'Erro',
        'Não foi possível conectar ao servidor.'
      );

    }finally{

      setCarregando(false);
      setAtualizando(false);

    }
  };

  const atualizar = () => {
    setAtualizando(true);
    carregarCameras();
  };

  const abrirCamera = (camera) => {

    if(navigation){
      navigation.navigate('VisualizarCamera',{
        camera: camera
      });
    }

  };

  const renderCamera = ({item}) => {

    const online =
      String(item.status || '').toLowerCase() === 'online';

    return (

      <TouchableOpacity
        style={styles.cameraCard}
        activeOpacity={0.8}
        onPress={() => abrirCamera(item)}
      >

        <View style={styles.cameraIcon}>

          <MaterialIcons
            name="videocam"
            size={27}
            color="#152D63"
          />

        </View>

        <View style={styles.cameraInfo}>

          <Text
            style={styles.cameraNome}
            numberOfLines={1}
          >
            {item.nome || 'Câmera comunitária'}
          </Text>

          <View style={styles.localizacao}>

            <MaterialIcons
              name="location-on"
              size={15}
              color="#6B7280"
            />

            <Text
              style={styles.endereco}
              numberOfLines={1}
            >
              {item.endereco || 'Localização não informada'}
            </Text>

          </View>

          <View style={styles.informacoes}>

            <View
              style={[
                styles.status,
                online
                  ? styles.statusOnline
                  : styles.statusOffline
              ]}
            >

              <View
                style={[
                  styles.statusPonto,
                  online
                    ? styles.pontoOnline
                    : styles.pontoOffline
                ]}
              />

              <Text
                style={[
                  styles.statusTexto,
                  online
                    ? styles.textoOnline
                    : styles.textoOffline
                ]}
              >
                {online ? 'Online' : 'Offline'}
              </Text>

            </View>

            <Text style={styles.tipo}>
              {item.tipo || 'Webcam'}
            </Text>

          </View>

        </View>

        <MaterialIcons
          name="chevron-right"
          size={24}
          color="#9CA3AF"
        />

      </TouchableOpacity>
    );
  };

  if(carregando){

    return (

      <View style={styles.loadingContainer}>

        <ActivityIndicator
          size="large"
          color="#152D63"
        />

        <Text style={styles.loadingText}>
          Carregando câmeras...
        </Text>

      </View>

    );

  }

  return (

    <View style={styles.container}>

      {/* CABEÇALHO */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.voltar}
          onPress={() => navigation.goBack()}
        >

          <MaterialIcons
            name="arrow-back"
            size={24}
            color="#152D63"
          />

        </TouchableOpacity>

        <View>

          <Text style={styles.titulo}>
            Câmeras
          </Text>

          <Text style={styles.subtitulo}>
            Câmeras comunitárias disponíveis
          </Text>

        </View>

      </View>

      {/* CONTADOR */}

      <View style={styles.contador}>

        <MaterialIcons
          name="videocam"
          size={20}
          color="#152D63"
        />

        <Text style={styles.contadorTexto}>
          {cameras.length}{' '}
          {cameras.length === 1
            ? 'câmera disponível'
            : 'câmeras disponíveis'}
        </Text>

      </View>

      {/* LISTA */}

      {cameras.length === 0 ? (

        <View style={styles.vazio}>

          <View style={styles.vazioIcon}>

            <MaterialIcons
              name="videocam-off"
              size={42}
              color="#9CA3AF"
            />

          </View>

          <Text style={styles.vazioTitulo}>
            Nenhuma câmera encontrada
          </Text>

          <Text style={styles.vazioTexto}>
            Ainda não existem câmeras comunitárias
            cadastradas.
          </Text>

          <TouchableOpacity
            style={styles.botaoAtualizar}
            onPress={carregarCameras}
          >

            <MaterialIcons
              name="refresh"
              size={18}
              color="#FFFFFF"
            />

            <Text style={styles.botaoAtualizarTexto}>
              Atualizar
            </Text>

          </TouchableOpacity>

        </View>

      ) : (

        <FlatList
          data={cameras}
          keyExtractor={(item,index) =>
            String(item.id || index)
          }
          renderItem={renderCamera}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.lista}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={atualizar}
              colors={['#152D63']}
            />
          }
        />

      )}

    </View>

  );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:'#F8FAFC',
    paddingHorizontal:20,
  },

  header:{
    flexDirection:'row',
    alignItems:'center',
    paddingTop:20,
    paddingBottom:18,
  },

  voltar:{
    width:42,
    height:42,
    borderRadius:12,
    backgroundColor:'#FFFFFF',
    alignItems:'center',
    justifyContent:'center',
    marginRight:13,
  },

  titulo:{
    fontSize:23,
    fontWeight:'700',
    color:'#152D63',
  },

  subtitulo:{
    fontSize:13,
    color:'#6B7280',
    marginTop:2,
  },

  contador:{
    height:45,
    backgroundColor:'#EEF2FF',
    borderRadius:12,
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:15,
    marginBottom:15,
  },

  contadorTexto:{
    marginLeft:9,
    fontSize:14,
    fontWeight:'600',
    color:'#152D63',
  },

  lista:{
    paddingBottom:25,
  },

  cameraCard:{
    backgroundColor:'#FFFFFF',
    borderRadius:16,
    padding:14,
    marginBottom:12,
    flexDirection:'row',
    alignItems:'center',

    shadowColor:'#000',
    shadowOffset:{
      width:0,
      height:2,
    },
    shadowOpacity:0.06,
    shadowRadius:5,

    elevation:2,
  },

  cameraIcon:{
    width:52,
    height:52,
    borderRadius:14,
    backgroundColor:'#EEF2FF',
    alignItems:'center',
    justifyContent:'center',
    marginRight:13,
  },

  cameraInfo:{
    flex:1,
  },

  cameraNome:{
    fontSize:16,
    fontWeight:'700',
    color:'#152D63',
    marginBottom:5,
  },

  localizacao:{
    flexDirection:'row',
    alignItems:'center',
    marginBottom:8,
  },

  endereco:{
    flex:1,
    fontSize:12,
    color:'#6B7280',
    marginLeft:3,
  },

  informacoes:{
    flexDirection:'row',
    alignItems:'center',
  },

  status:{
    flexDirection:'row',
    alignItems:'center',
    borderRadius:20,
    paddingHorizontal:8,
    paddingVertical:4,
    marginRight:8,
  },

  statusOnline:{
    backgroundColor:'#ECFDF5',
  },

  statusOffline:{
    backgroundColor:'#FEF2F2',
  },

  statusPonto:{
    width:6,
    height:6,
    borderRadius:3,
    marginRight:5,
  },

  pontoOnline:{
    backgroundColor:'#22C55E',
  },

  pontoOffline:{
    backgroundColor:'#EF4444',
  },

  statusTexto:{
    fontSize:10,
    fontWeight:'600',
  },

  textoOnline:{
    color:'#16A34A',
  },

  textoOffline:{
    color:'#DC2626',
  },

  tipo:{
    fontSize:10,
    color:'#6B7280',
    backgroundColor:'#F3F4F6',
    paddingHorizontal:8,
    paddingVertical:4,
    borderRadius:20,
  },

  vazio:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    paddingHorizontal:30,
  },

  vazioIcon:{
    width:85,
    height:85,
    borderRadius:43,
    backgroundColor:'#F1F5F9',
    alignItems:'center',
    justifyContent:'center',
    marginBottom:18,
  },

  vazioTitulo:{
    fontSize:18,
    fontWeight:'700',
    color:'#152D63',
    textAlign:'center',
  },

  vazioTexto:{
    fontSize:13,
    color:'#6B7280',
    textAlign:'center',
    marginTop:7,
    lineHeight:19,
  },

  botaoAtualizar:{
    marginTop:20,
    height:42,
    paddingHorizontal:18,
    borderRadius:10,
    backgroundColor:'#152D63',
    flexDirection:'row',
    alignItems:'center',
  },

  botaoAtualizarTexto:{
    color:'#FFFFFF',
    fontSize:13,
    fontWeight:'600',
    marginLeft:7,
  },

  loadingContainer:{
    flex:1,
    backgroundColor:'#F8FAFC',
    alignItems:'center',
    justifyContent:'center',
  },

  loadingText:{
    marginTop:12,
    fontSize:14,
    color:'#6B7280',
  },

});