import React from 'react';
import SubtelaPerfil, {
  CardInfo,
  TextoTitulo,
  Texto,
} from './SubtelaPerfil';

export default function ComoFuncionaMapa({ navigation }) {
  return (
    <SubtelaPerfil
      navigation={navigation}
      titulo="Como funciona o mapa?"
    >
      <CardInfo>
        <TextoTitulo>Mapa de segurança</TextoTitulo>

        <Texto>
          O mapa permite visualizar informações relacionadas à segurança na
          região.
        </Texto>
      </CardInfo>

      <CardInfo>
        <TextoTitulo>Câmeras</TextoTitulo>

        <Texto>
          Câmeras comunitárias compartilhadas podem aparecer no mapa de acordo
          com suas configurações de acesso.
        </Texto>
      </CardInfo>

      <CardInfo>
        <TextoTitulo>Ocorrências</TextoTitulo>

        <Texto>
          Ocorrências registradas podem ser representadas no mapa para
          facilitar a visualização das áreas com registros.
        </Texto>
      </CardInfo>

      <CardInfo>
        <TextoTitulo>Áreas de risco</TextoTitulo>

        <Texto>
          O sistema pode apresentar regiões com maior concentração de
          ocorrências.
        </Texto>
      </CardInfo>
    </SubtelaPerfil>
  );
}