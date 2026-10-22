import React from 'react';
import SubtelaPerfil, {
  CardInfo,
  TextoTitulo,
  Texto,
} from './SubtelaPerfil';

export default function ComoFuncionamAlertas({ navigation }) {
  return (
    <SubtelaPerfil
      navigation={navigation}
      titulo="Como funcionam os alertas?"
    >
      <CardInfo>
        <TextoTitulo>Alertas de emergência</TextoTitulo>

        <Texto>
          Os alertas ajudam a comunicar rapidamente uma situação de emergência
          registrada pelo usuário.
        </Texto>
      </CardInfo>

      <CardInfo>
        <TextoTitulo>Contatos de emergência</TextoTitulo>

        <Texto>
          Você pode cadastrar contatos para receber informações quando um
          alerta de emergência for acionado.
        </Texto>
      </CardInfo>

      <CardInfo>
        <TextoTitulo>Autoridades</TextoTitulo>

        <Texto>
          Informações de ocorrências podem ser encaminhadas para o portal
          utilizado pelas autoridades responsáveis.
        </Texto>
      </CardInfo>
    </SubtelaPerfil>
  );
}