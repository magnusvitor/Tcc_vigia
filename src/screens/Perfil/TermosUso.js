import React from 'react';
import SubtelaPerfil, {
  CardInfo,
  TextoTitulo,
  Texto,
} from './SubtelaPerfil';

export default function TermosUso({ navigation }) {
  return (
    <SubtelaPerfil
      navigation={navigation}
      titulo="Termos de uso"
    >
      <CardInfo>
        <TextoTitulo>Uso do aplicativo</TextoTitulo>

        <Texto>
          O SMC deve ser utilizado de forma responsável e exclusivamente para
          finalidades relacionadas à segurança e comunicação de ocorrências.
        </Texto>
      </CardInfo>

      <CardInfo>
        <TextoTitulo>Informações enviadas</TextoTitulo>

        <Texto>
          O usuário é responsável pelas informações fornecidas ao sistema e
          deve evitar o envio de conteúdo falso ou inadequado.
        </Texto>
      </CardInfo>

      <CardInfo>
        <TextoTitulo>Uso responsável</TextoTitulo>

        <Texto>
          O aplicativo não substitui os canais oficiais de emergência. Em uma
          situação de risco imediato, procure os serviços de emergência
          apropriados.
        </Texto>
      </CardInfo>

      <CardInfo>
        <TextoTitulo>Atualizações</TextoTitulo>

        <Texto>
          Os termos podem ser atualizados conforme a evolução do sistema.
        </Texto>
      </CardInfo>
    </SubtelaPerfil>
  );
}