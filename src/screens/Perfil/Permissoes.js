import React, { useState } from 'react';
import { Switch } from 'react-native';

import SubtelaPerfil, {
  CardInfo,
  Linha,
  Texto,
} from './SubtelaPerfil';

export default function Permissoes({ navigation }) {
  const [localizacao, setLocalizacao] = useState(true);
  const [camera, setCamera] = useState(false);
  const [notificacoes, setNotificacoes] = useState(true);

  return (
    <SubtelaPerfil
      navigation={navigation}
      titulo="Permissões"
    >
      <CardInfo>
        <Texto>
          Controle as permissões utilizadas pelo SMC. Algumas funções podem
          precisar dessas permissões para funcionar corretamente.
        </Texto>
      </CardInfo>

      <CardInfo>
        <Linha
          icone="location-on"
          titulo="Localização"
          descricao="Usada para registrar sua localização"
          direita={
            <Switch
              value={localizacao}
              onValueChange={setLocalizacao}
            />
          }
        />

        <Linha
          icone="photo-camera"
          titulo="Câmera"
          descricao="Usada para enviar fotos e utilizar recursos de câmera"
          direita={
            <Switch
              value={camera}
              onValueChange={setCamera}
            />
          }
        />

        <Linha
          icone="notifications"
          titulo="Notificações"
          descricao="Usada para receber alertas importantes"
          direita={
            <Switch
              value={notificacoes}
              onValueChange={setNotificacoes}
            />
          }
        />
      </CardInfo>
    </SubtelaPerfil>
  );
}