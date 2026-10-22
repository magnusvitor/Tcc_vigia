import React from 'react';
import SubtelaPerfil, {
  CardInfo,
  TextoTitulo,
  Texto,
} from './SubtelaPerfil';

export default function InfoPermissoes({ navigation }) {
  return (
    <SubtelaPerfil
      navigation={navigation}
      titulo="Sobre as permissões"
    >
      <CardInfo>
        <TextoTitulo>Localização</TextoTitulo>

        <Texto>
          Permite identificar a localização aproximada utilizada em recursos
          como registro de ocorrências e mapas.
        </Texto>
      </CardInfo>

      <CardInfo>
        <TextoTitulo>Câmera</TextoTitulo>

        <Texto>
          Permite tirar fotos para anexar às ocorrências e utilizar recursos
          relacionados às câmeras.
        </Texto>
      </CardInfo>

      <CardInfo>
        <TextoTitulo>Notificações</TextoTitulo>

        <Texto>
          Permite receber alertas e informações importantes do SMC.
        </Texto>
      </CardInfo>
    </SubtelaPerfil>
  );
}