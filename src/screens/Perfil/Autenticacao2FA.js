import React, { useState } from 'react';
import { Switch } from 'react-native';
import SubtelaPerfil, {
  CardInfo,
  Linha,
  Texto,
} from './SubtelaPerfil';

export default function Autenticacao2FA({ navigation }) {
  const [ativado, setAtivado] = useState(false);

  return (
    <SubtelaPerfil
      navigation={navigation}
      titulo="Autenticação em duas etapas"
    >
      <CardInfo>
        <Texto>
          A autenticação em duas etapas adiciona uma camada extra de proteção
          para sua conta.
        </Texto>
      </CardInfo>

      <CardInfo>
        <Linha
          icone="verified-user"
          titulo="Autenticação em duas etapas"
          descricao={
            ativado
              ? 'Ativada'
              : 'Desativada'
          }
          direita={
            <Switch
              value={ativado}
              onValueChange={setAtivado}
            />
          }
        />
      </CardInfo>
    </SubtelaPerfil>
  );
}