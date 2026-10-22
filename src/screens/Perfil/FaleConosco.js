import React from 'react';
import { Alert } from 'react-native';
import SubtelaPerfil, {
  CardInfo,
  Linha,
  Texto,
} from './SubtelaPerfil';

export default function FaleConosco({ navigation }) {
  function contato() {
    Alert.alert(
      'Fale conosco',
      'Entre em contato com a equipe responsável pelo SMC para receber atendimento.'
    );
  }

  return (
    <SubtelaPerfil
      navigation={navigation}
      titulo="Fale conosco"
    >
      <CardInfo>
        <Texto>
          Precisa de ajuda ou deseja entrar em contato com a equipe do SMC?
        </Texto>
      </CardInfo>

      <CardInfo>
        <Linha
          icone="email"
          titulo="Atendimento"
          descricao="Entre em contato com nossa equipe"
          onPress={contato}
        />

        <Linha
          icone="help-outline"
          titulo="Suporte"
          descricao="Tire dúvidas sobre o aplicativo"
          onPress={contato}
        />
      </CardInfo>
    </SubtelaPerfil>
  );
}