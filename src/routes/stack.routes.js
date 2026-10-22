import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DrawerRoutes from './drawer.routes';

// TELAS
import Inicio from '../screens/Inicio';
import Login from '../screens/Login';
import RecuperarSenha from '../screens/Cadastro/RecuperarSenha';
import Cadastro from '../screens/Cadastro';
import CadastroSucesso from '../screens/Cadastro/CadastroSucesso';

import DetalheOcorrencia from '../screens/Home/DetalheOcorrencia';
import MinhasDenuncias from '../screens/Home/MinhasDenuncias';

import Index from '../screens/Botao';
import Forms from '../screens/Botao/forms';
import Confirm from '../screens/Botao/confirm';

import Ocorrencias from '../screens/Ocorrencias';
import DetalhesOcorrencia from '../screens/Ocorrencias/DetalhesOcorrencia';

// PERFIL
import Perfil from '../screens/Perfil/Perfil';
import MinhasCameras from '../screens/Perfil/MinhasCameras';
import CadastrarCamera from '../screens/Perfil/CadastrarCamera';
import ContatosEmergencia from '../screens/Perfil/ContatosEmergencia';
import NovoContato from '../screens/Perfil/NovoContato';

import Configuracoes from '../screens/Perfil/Configuracoes';
import NotificacoesPerfil from '../screens/Perfil/NotificacoesPerfil';

// PRIVACIDADE
import Privacidade from '../screens/Perfil/Privacidade';
import PoliticaPrivacidade from '../screens/Perfil/PoliticaPrivacidade';
import GerenciarDados from '../screens/Perfil/GerenciarDados';
import Permissoes from '../screens/Perfil/Permissoes';

// SEGURANÇA
import Seguranca from '../screens/Perfil/Seguranca';
import AlterarSenha from '../screens/Perfil/AlterarSenha';
import Autenticacao2FA from '../screens/Perfil/Autenticacao2FA';
import DispositivosConectados from '../screens/Perfil/DispositivosConectados';
import AtividadeConta from '../screens/Perfil/AtividadeConta';

// AJUDA
import CentralAjuda from '../screens/Perfil/CentralAjuda';
import RelatarProblema from '../screens/Perfil/RelatarProblema';
import FaleConosco from '../screens/Perfil/FaleConosco';

import ComoFazerDenuncia from '../screens/Perfil/ComoFazerDenuncia';
import ComoRegistrarOcorrencia from '../screens/Perfil/ComoRegistrarOcorrencia';
import ComoFuncionaMapa from '../screens/Perfil/ComoFuncionaMapa';
import ComoCadastrarCamera from '../screens/Perfil/ComoCadastrarCamera';
import ComoFuncionamAlertas from '../screens/Perfil/ComoFuncionamAlertas';

// SOBRE
import SobreSMC from '../screens/Perfil/SobreSMC';
import TermosUso from '../screens/Perfil/TermosUso';

// CHAT
import Conversa from '../screens/Chat/Conversa';
import Entrar from '../screens/Chat/Entrar';
import BuscarComunidades from '../screens/Chat/BuscarComunidades';
import MinhasComunidades from '../screens/Chat/MinhasComunidades';
import ComunidadeConversa from '../screens/Chat/ComunidadeConversa';
import CriarComunidade from '../screens/Chat/CriarComunidade';
import ComunidadeConfig from '../screens/Chat/ComunidadeConfig';


const Stack = createNativeStackNavigator();

export default function StackRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Inicio"
    >

      {/* INÍCIO */}

      <Stack.Screen
        name="Inicio"
        component={Inicio}
      />

      <Stack.Screen
        name="Login"
        component={Login}
      />

      <Stack.Screen
        name="RecuperarSenha"
        component={RecuperarSenha}
      />

      <Stack.Screen
        name="Cadastro"
        component={Cadastro}
      />

      <Stack.Screen
        name="CadastroSucesso"
        component={CadastroSucesso}
      />

      <Stack.Screen
        name="DetalheOcorrencia"
        component={DetalheOcorrencia}
      />

      {/* APP / DRAWER */}

      <Stack.Screen
        name="App"
        component={DrawerRoutes}
      />

      {/* BOTÃO DE EMERGÊNCIA */}

      <Stack.Screen
        name="Index"
        component={Index}
      />

      <Stack.Screen
        name="Forms"
        component={Forms}
      />

      <Stack.Screen
        name="Confirm"
        component={Confirm}
      />

      {/* OCORRÊNCIAS */}

      <Stack.Screen
        name="MinhasDenuncias"
        component={MinhasDenuncias}
      />

      <Stack.Screen
        name="DetalhesOcorrencia"
        component={DetalhesOcorrencia}
      />

      {/* PERFIL */}

      <Stack.Screen
        name="Perfil"
        component={Perfil}
      />

      <Stack.Screen
        name="MinhasCameras"
        component={MinhasCameras}
      />

      <Stack.Screen
        name="CadastrarCamera"
        component={CadastrarCamera}
      />

      <Stack.Screen
        name="EditarCamera"
        component={CadastrarCamera}
      />

      {/* CONTATOS DE EMERGÊNCIA */}

      <Stack.Screen
        name="ContatosEmergencia"
        component={ContatosEmergencia}
      />

      <Stack.Screen
        name="NovoContato"
        component={NovoContato}
      />

      <Stack.Screen
        name="EditarContato"
        component={NovoContato}
      />

      {/* CONFIGURAÇÕES */}

      <Stack.Screen
        name="Configuracoes"
        component={Configuracoes}
      />

      <Stack.Screen
        name="NotificacoesPerfil"
        component={NotificacoesPerfil}
      />

      {/* PRIVACIDADE */}

      <Stack.Screen
        name="Privacidade"
        component={Privacidade}
      />

      <Stack.Screen
        name="PoliticaPrivacidade"
        component={PoliticaPrivacidade}
      />

      <Stack.Screen
        name="GerenciarDados"
        component={GerenciarDados}
      />

      <Stack.Screen
        name="Permissoes"
        component={Permissoes}
      />

      {/* SEGURANÇA */}

      <Stack.Screen
        name="Seguranca"
        component={Seguranca}
      />

      <Stack.Screen
        name="AlterarSenha"
        component={AlterarSenha}
      />

      <Stack.Screen
        name="Autenticacao2FA"
        component={Autenticacao2FA}
      />

      <Stack.Screen
        name="DispositivosConectados"
        component={DispositivosConectados}
      />

      <Stack.Screen
        name="AtividadeConta"
        component={AtividadeConta}
      />

      {/* CENTRAL DE AJUDA */}

      <Stack.Screen
        name="CentralAjuda"
        component={CentralAjuda}
      />

      <Stack.Screen
        name="RelatarProblema"
        component={RelatarProblema}
      />

      <Stack.Screen
        name="FaleConosco"
        component={FaleConosco}
      />

      <Stack.Screen
        name="ComoFazerDenuncia"
        component={ComoFazerDenuncia}
      />

      <Stack.Screen
        name="ComoRegistrarOcorrencia"
        component={ComoRegistrarOcorrencia}
      />

      <Stack.Screen
        name="ComoFuncionaMapa"
        component={ComoFuncionaMapa}
      />

      <Stack.Screen
        name="ComoCadastrarCamera"
        component={ComoCadastrarCamera}
      />

      <Stack.Screen
        name="ComoFuncionamAlertas"
        component={ComoFuncionamAlertas}
      />

      {/* SOBRE O SMC */}

      <Stack.Screen
        name="SobreSMC"
        component={SobreSMC}
      />

      <Stack.Screen
        name="TermosUso"
        component={TermosUso}
      />

      {/* CHAT */}

      <Stack.Screen
        name="MinhasComunidades"
        component={MinhasComunidades}
      />

      <Stack.Screen
        name="BuscarComunidades"
        component={BuscarComunidades}
      />

      <Stack.Screen
        name="ComunidadeConversa"
        component={ComunidadeConversa}
      />

      <Stack.Screen
        name="CriarComunidade"
        component={CriarComunidade}
      />

      <Stack.Screen
        name="Entrar"
        component={Entrar}
      />

      <Stack.Screen
        name="Conversa"
        component={Conversa}
      />

      <Stack.Screen
        name="ComunidadeConfig"
        component={ComunidadeConfig}
      />

    </Stack.Navigator>
  );
}