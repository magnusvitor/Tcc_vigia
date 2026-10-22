import React from 'react';
import SubtelaPerfil, {
  CardInfo,
  TextoTitulo,
  Texto,
} from './SubtelaPerfil';

export default function ComoCadastrarCamera({ navigation }) {
  return (
    <SubtelaPerfil
      navigation={navigation}
      titulo="Como cadastrar uma câmera?"
    >
      <CardInfo>
        <TextoTitulo>1. Acesse Câmeras</TextoTitulo>

        <Texto>
          Entre na área de câmeras do SMC e escolha a opção para cadastrar uma
          nova câmera.
        </Texto>
      </CardInfo>

      <CardInfo>
        <TextoTitulo>2. Informe os dados</TextoTitulo>

        <Texto>
          Informe o nome, localização e endereço da câmera.
        </Texto>
      </CardInfo>

      <CardInfo>
        <TextoTitulo>3. Defina o acesso</TextoTitulo>

        <Texto>
          Escolha se a câmera será privada, compartilhada com a comunidade ou
          pública.
        </Texto>
      </CardInfo>

      <CardInfo>
        <TextoTitulo>4. Salve</TextoTitulo>

        <Texto>
          Confira as informações e finalize o cadastro.
        </Texto>
      </CardInfo>
    </SubtelaPerfil>
  );
}