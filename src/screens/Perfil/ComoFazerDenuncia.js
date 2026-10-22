import React from 'react';
import SubtelaPerfil, {
  CardInfo,
  TextoTitulo,
  Texto,
} from './SubtelaPerfil';

export default function ComoFazerDenuncia({ navigation }) {
  return (
    <SubtelaPerfil
      navigation={navigation}
      titulo="Como fazer uma denúncia?"
    >
      <CardInfo>
        <TextoTitulo>1. Acesse as denúncias</TextoTitulo>
        <Texto>
          Entre na área de denúncias do SMC pelo menu principal.
        </Texto>
      </CardInfo>

      <CardInfo>
        <TextoTitulo>2. Escolha a categoria</TextoTitulo>
        <Texto>
          Selecione o tipo de ocorrência que deseja informar.
        </Texto>
      </CardInfo>

      <CardInfo>
        <TextoTitulo>3. Informe os detalhes</TextoTitulo>
        <Texto>
          Adicione uma descrição, localização e, quando necessário, uma
          imagem.
        </Texto>
      </CardInfo>

      <CardInfo>
        <TextoTitulo>4. Envie</TextoTitulo>
        <Texto>
          Revise as informações e envie a denúncia para o sistema.
        </Texto>
      </CardInfo>
    </SubtelaPerfil>
  );
}