import React from 'react';
import { Alert } from 'react-native';
import SubtelaPerfil, {
  CardInfo,
  Linha,
  Texto,
} from './SubtelaPerfil';

export default function DispositivosConectados({ navigation }) {
  function encerrar() {
    Alert.alert(
      'Encerrar sessão',
      'A sessão deste dispositivo será encerrada.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Encerrar',
          style: 'destructive',
          onPress: () =>
            Alert.alert('Sessão encerrada'),
        },
      ]
    );
  }

  return (
    <SubtelaPerfil
      navigation={navigation}
      titulo="Dispositivos conectados"
    >
      <CardInfo>
        <Texto>
          Consulte os dispositivos que possuem uma sessão ativa da sua conta.
        </Texto>
      </CardInfo>

      <CardInfo>
        <Linha
          icone="phone-android"
          titulo="Este dispositivo"
          descricao="Sessão atual"
        />

        <Linha
          icone="logout"
          titulo="Encerrar outras sessões"
          descricao="Desconecte outros dispositivos"
          onPress={encerrar}
        />
      </CardInfo>
    </SubtelaPerfil>
  );
}