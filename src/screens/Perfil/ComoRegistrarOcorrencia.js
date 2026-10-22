import React from 'react';
import SubtelaPerfil, {
  CardInfo,
  TextoTitulo,
  Texto,
} from './SubtelaPerfil';

export default function ComoRegistrarOcorrencia({ navigation }) {
  return (
    <SubtelaPerfil
      navigation={navigation}
      titulo="Como registrar uma ocorrência?"
    >
      <CardInfo>
        <TextoTitulo>1. Inicie o registro</TextoTitulo>
        <Texto>
          Acesse a opção de registrar uma ocorrência no aplicativo.
        </Texto>
      </CardInfo>

      <CardInfo>
        <TextoTitulo>2. Selecione o tipo</TextoTitulo>
        <Texto>
          Escolha entre categorias como roubo, furto, homicídio ou outra
          ocorrência.
        </Texto>
      </CardInfo>

      <CardInfo>
        <TextoTitulo>3. Informe a localização</TextoTitulo>
        <Texto>
          O SMC pode utilizar a localização do dispositivo para facilitar o
          preenchimento.
        </Texto>
      </CardInfo>

      <CardInfo>
        <TextoTitulo>4. Envie o registro</TextoTitulo>
        <Texto>
          Confira os dados e envie a ocorrência para o sistema.
        </Texto>
      </CardInfo>
    </SubtelaPerfil>
  );
}