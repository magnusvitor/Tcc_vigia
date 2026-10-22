import React from 'react';

import SubtelaPerfil, {
  CardInfo,
  TextoTitulo,
  Texto,
} from './SubtelaPerfil';

export default function PoliticaPrivacidade({ navigation }) {
  return (
    <SubtelaPerfil
      navigation={navigation}
      titulo="Política de Privacidade"
    >
      <CardInfo>
        <TextoTitulo>Sobre seus dados</TextoTitulo>

        <Texto>
          O SMC utiliza informações necessárias para oferecer recursos
          relacionados à segurança pública e ao compartilhamento de
          ocorrências.
        </Texto>
      </CardInfo>

      <CardInfo>
        <TextoTitulo>Informações coletadas</TextoTitulo>

        <Texto>
          Podemos utilizar informações da conta, localização, registros de
          ocorrências, imagens enviadas e informações relacionadas às câmeras
          cadastradas.
        </Texto>
      </CardInfo>

      <CardInfo>
        <TextoTitulo>Uso das informações</TextoTitulo>

        <Texto>
          Os dados são utilizados para funcionamento do aplicativo,
          identificação de ocorrências, comunicação de alertas e melhoria dos
          serviços do SMC.
        </Texto>
      </CardInfo>

      <CardInfo>
        <TextoTitulo>Compartilhamento</TextoTitulo>

        <Texto>
          Informações de ocorrências podem ser disponibilizadas às autoridades
          responsáveis quando necessário para o atendimento e encaminhamento
          dos casos.
        </Texto>
      </CardInfo>

      <CardInfo>
        <TextoTitulo>Segurança</TextoTitulo>

        <Texto>
          O SMC busca utilizar medidas de segurança para proteger as
          informações armazenadas no sistema.
        </Texto>
      </CardInfo>
    </SubtelaPerfil>
  );
}