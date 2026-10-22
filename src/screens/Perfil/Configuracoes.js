import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
  StyleSheet,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';


// ======================================================
// CORES
// ======================================================

const COLORS = {
  primary: '#152D63',
  secondary: '#2E5AAC',

  purple: '#7259B8',
  purpleLight: '#F1EEFA',

  blueLight: '#EEF3FB',
  blueSoft: '#F6F8FC',

  background: '#F7F8FC',
  white: '#FFFFFF',
  border: '#E3E7EF',

  text: '#111827',
  subtitle: '#64748B',
  muted: '#94A3B8',

  success: '#22A06B',
  danger: '#DC4C5A',
};


// ======================================================
// TELA DE CONFIGURAÇÕES
// ======================================================

export default function Configuracoes({ navigation }) {

  const [notificacoes, setNotificacoes] = useState(true);
  const [alertasEmergencia, setAlertasEmergencia] = useState(true);
  const [localizacao, setLocalizacao] = useState(true);
  const [confirmacaoAlerta, setConfirmacaoAlerta] = useState(true);


  // ====================================================
  // NOTIFICAÇÕES
  // ====================================================

  function alterarNotificacoes(valor) {
    setNotificacoes(valor);
  }


  // ====================================================
  // ALERTAS
  // ====================================================

  function alterarAlertasEmergencia(valor) {
    setAlertasEmergencia(valor);
  }


  // ====================================================
  // LOCALIZAÇÃO
  // ====================================================

  function alterarLocalizacao(valor) {
    setLocalizacao(valor);
  }


  // ====================================================
  // CONFIRMAÇÃO DE ALERTA
  // ====================================================

  function alterarConfirmacaoAlerta(valor) {
    setConfirmacaoAlerta(valor);
  }


  // ====================================================
  // LIMPAR DADOS
  // ====================================================

  function limparCache() {

    Alert.alert(
      'Limpar dados temporários',

      'Deseja limpar os dados temporários do aplicativo?',

      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },

        {
          text: 'Limpar',

          onPress: () => {
            Alert.alert(
              'Tudo certo!',
              'Os dados temporários foram limpos.'
            );
          },
        },
      ]
    );
  }


  // ====================================================
  // SOBRE
  // ====================================================

  function abrirPrivacidade() {
  navigation.navigate('Privacidade');
}

function abrirSeguranca() {
  navigation.navigate('Seguranca');
}

function abrirAjuda() {
  navigation.navigate('CentralAjuda');
}

function abrirSobre() {
  navigation.navigate('SobreSMC');
}

  // ====================================================
  // TELA
  // ====================================================

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ==================================================
            CABEÇALHO
        ================================================== */}

        <View style={styles.header}>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >

            <MaterialIcons
              name="arrow-back"
              size={22}
              color={COLORS.primary}
            />

          </TouchableOpacity>


          <View style={styles.headerText}>

            <Text style={styles.title}>
              Configurações
            </Text>

            <Text style={styles.subtitle}>
              Gerencie sua segurança e preferências
            </Text>

          </View>

        </View>


        {/* ==================================================
            NOTIFICAÇÕES
        ================================================== */}

        <Text style={styles.sectionTitle}>
          Notificações
        </Text>


        <View style={styles.card}>

          <View style={styles.option}>

            <View style={styles.iconBoxBlue}>

              <MaterialIcons
                name="notifications-none"
                size={22}
                color={COLORS.secondary}
              />

            </View>


            <View style={styles.optionText}>

              <Text style={styles.optionTitle}>
                Notificações
              </Text>

              <Text style={styles.optionDescription}>
                Receba atualizações e informações do aplicativo
              </Text>

            </View>


            <Switch
              value={notificacoes}
              onValueChange={alterarNotificacoes}

              trackColor={{
                false: '#D5DAE3',
                true: '#9EB4E2',
              }}

              thumbColor={
                notificacoes
                  ? COLORS.secondary
                  : '#FFFFFF'
              }
            />

          </View>


          <View style={styles.divider} />


          <View style={styles.option}>

            <View style={styles.iconBoxDanger}>

              <MaterialIcons
                name="warning-amber"
                size={22}
                color="#C65A65"
              />

            </View>


            <View style={styles.optionText}>

              <Text style={styles.optionTitle}>
                Alertas de emergência
              </Text>

              <Text style={styles.optionDescription}>
                Receba informações sobre ocorrências e situações de risco
              </Text>

            </View>


            <Switch
              value={alertasEmergencia}
              onValueChange={alterarAlertasEmergencia}

              trackColor={{
                false: '#D5DAE3',
                true: '#9EB4E2',
              }}

              thumbColor={
                alertasEmergencia
                  ? COLORS.secondary
                  : '#FFFFFF'
              }
            />

          </View>

        </View>


        {/* ==================================================
            SEGURANÇA
        ================================================== */}

        <Text style={styles.sectionTitle}>
          Segurança
        </Text>


        <View style={styles.card}>

          <View style={styles.option}>

            <View style={styles.iconBoxBlue}>

              <MaterialIcons
                name="location-on"
                size={22}
                color={COLORS.secondary}
              />

            </View>


            <View style={styles.optionText}>

              <Text style={styles.optionTitle}>
                Localização
              </Text>

              <Text style={styles.optionDescription}>
                Permitir localização para registrar ocorrências
              </Text>

            </View>


            <Switch
              value={localizacao}
              onValueChange={alterarLocalizacao}

              trackColor={{
                false: '#D5DAE3',
                true: '#9EB4E2',
              }}

              thumbColor={
                localizacao
                  ? COLORS.secondary
                  : '#FFFFFF'
              }
            />

          </View>


          <View style={styles.divider} />


          <View style={styles.option}>

            <View style={styles.iconBoxPurple}>

              <MaterialIcons
                name="verified-user"
                size={22}
                color={COLORS.purple}
              />

            </View>


            <View style={styles.optionText}>

              <Text style={styles.optionTitle}>
                Confirmação de alertas
              </Text>

              <Text style={styles.optionDescription}>
                Confirme o envio antes de registrar um alerta
              </Text>

            </View>


            <Switch
              value={confirmacaoAlerta}
              onValueChange={alterarConfirmacaoAlerta}

              trackColor={{
                false: '#D5DAE3',
                true: '#B7A9DD',
              }}

              thumbColor={
                confirmacaoAlerta
                  ? COLORS.purple
                  : '#FFFFFF'
              }
            />

          </View>


          <View style={styles.divider} />


          <TouchableOpacity
            style={styles.option}
            onPress={abrirSeguranca}
            activeOpacity={0.7}
          >

            <View style={styles.iconBoxPurple}>

              <MaterialIcons
                name="security"
                size={22}
                color={COLORS.purple}
              />

            </View>


            <View style={styles.optionText}>

              <Text style={styles.optionTitle}>
                Segurança da conta
              </Text>

              <Text style={styles.optionDescription}>
                Informações para manter sua conta protegida
              </Text>

            </View>


            <MaterialIcons
              name="chevron-right"
              size={24}
              color={COLORS.muted}
            />

          </TouchableOpacity>

        </View>


        {/* ==================================================
            CONTA
        ================================================== */}

        <Text style={styles.sectionTitle}>
          Conta
        </Text>


        <View style={styles.card}>

          <TouchableOpacity
            style={styles.option}
            onPress={() =>
              navigation.navigate('Perfil')
            }
            activeOpacity={0.7}
          >

            <View style={styles.iconBoxBlue}>

              <MaterialIcons
                name="person-outline"
                size={22}
                color={COLORS.secondary}
              />

            </View>


            <View style={styles.optionText}>

              <Text style={styles.optionTitle}>
                Meu perfil
              </Text>

              <Text style={styles.optionDescription}>
                Visualize e altere seus dados pessoais
              </Text>

            </View>


            <MaterialIcons
              name="chevron-right"
              size={24}
              color={COLORS.muted}
            />

          </TouchableOpacity>


          <View style={styles.divider} />


          <TouchableOpacity
            style={styles.option}
            onPress={() =>
              navigation.navigate('ContatosEmergencia')
            }
            activeOpacity={0.7}
          >

            <View style={styles.iconBoxPurple}>

              <MaterialIcons
                name="contact-phone"
                size={22}
                color={COLORS.purple}
              />

            </View>


            <View style={styles.optionText}>

              <Text style={styles.optionTitle}>
                Contatos de emergência
              </Text>

              <Text style={styles.optionDescription}>
                Gerencie quem será avisado em uma emergência
              </Text>

            </View>


            <MaterialIcons
              name="chevron-right"
              size={24}
              color={COLORS.muted}
            />

          </TouchableOpacity>

        </View>


        {/* ==================================================
            PRIVACIDADE
        ================================================== */}

        <Text style={styles.sectionTitle}>
          Privacidade
        </Text>


        <View style={styles.card}>

          <TouchableOpacity
            style={styles.option}
            onPress={abrirPrivacidade}
            activeOpacity={0.7}
          >

            <View style={styles.iconBoxBlue}>

              <MaterialIcons
                name="privacy-tip"
                size={22}
                color={COLORS.secondary}
              />

            </View>


            <View style={styles.optionText}>

              <Text style={styles.optionTitle}>
                Privacidade
              </Text>

              <Text style={styles.optionDescription}>
                Saiba como seus dados são utilizados
              </Text>

            </View>


            <MaterialIcons
              name="chevron-right"
              size={24}
              color={COLORS.muted}
            />

          </TouchableOpacity>


          <View style={styles.divider} />


          <TouchableOpacity
            style={styles.option}
            onPress={limparCache}
            activeOpacity={0.7}
          >

            <View style={styles.iconBoxGray}>

              <MaterialIcons
                name="cleaning-services"
                size={22}
                color="#64748B"
              />

            </View>


            <View style={styles.optionText}>

              <Text style={styles.optionTitle}>
                Limpar dados temporários
              </Text>

              <Text style={styles.optionDescription}>
                Remova arquivos temporários do aplicativo
              </Text>

            </View>


            <MaterialIcons
              name="chevron-right"
              size={24}
              color={COLORS.muted}
            />

          </TouchableOpacity>

        </View>


        {/* ==================================================
            SUPORTE
        ================================================== */}

        <Text style={styles.sectionTitle}>
          Suporte
        </Text>


        <View style={styles.card}>

          <TouchableOpacity
            style={styles.option}
            onPress={abrirAjuda}
            activeOpacity={0.7}
          >

            <View style={styles.iconBoxBlue}>

              <MaterialIcons
                name="help-outline"
                size={22}
                color={COLORS.secondary}
              />

            </View>


            <View style={styles.optionText}>

              <Text style={styles.optionTitle}>
                Ajuda
              </Text>

              <Text style={styles.optionDescription}>
                Encontre informações e orientações
              </Text>

            </View>


            <MaterialIcons
              name="chevron-right"
              size={24}
              color={COLORS.muted}
            />

          </TouchableOpacity>


          <View style={styles.divider} />


          <TouchableOpacity
            style={styles.option}
            onPress={abrirSobre}
            activeOpacity={0.7}
          >

            <View style={styles.iconBoxPurple}>

              <MaterialIcons
                name="info-outline"
                size={22}
                color={COLORS.purple}
              />

            </View>


            <View style={styles.optionText}>

              <Text style={styles.optionTitle}>
                Sobre o SMC
              </Text>

              <Text style={styles.optionDescription}>
                Informações sobre o aplicativo e versão
              </Text>

            </View>


            <MaterialIcons
              name="chevron-right"
              size={24}
              color={COLORS.muted}
            />

          </TouchableOpacity>

        </View>


        {/* ==================================================
            RODAPÉ
        ================================================== */}

        <View style={styles.footer}>

          <View style={styles.footerIcon}>

            <MaterialIcons
              name="security"
              size={18}
              color={COLORS.white}
            />

          </View>

          <Text style={styles.footerTitle}>
            SMC
          </Text>

          <Text style={styles.footerText}>
            Sistema de Monitoramento Colaborativo
          </Text>

          <Text style={styles.footerVersion}>
            Versão 1.0.0
          </Text>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}


// ======================================================
// ESTILOS
// ======================================================

const styles = StyleSheet.create({

  // ==================================================
  // CONTAINER
  // ==================================================

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 35,
  },


  // ==================================================
  // HEADER
  // ==================================================

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 23,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 23,
    fontWeight: '800',
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 3,
    fontSize: 12,
    color: COLORS.subtitle,
  },


  // ==================================================
  // SEÇÕES
  // ==================================================

  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
    marginTop: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },


  // ==================================================
  // CARD
  // ==================================================

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginBottom: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },


  // ==================================================
  // OPÇÃO
  // ==================================================

  option: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
  },


  // ==================================================
  // ÍCONES
  // ==================================================

  iconBoxBlue: {
    width: 41,
    height: 41,
    borderRadius: 11,
    backgroundColor: COLORS.blueLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  iconBoxPurple: {
    width: 41,
    height: 41,
    borderRadius: 11,
    backgroundColor: COLORS.purpleLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  iconBoxDanger: {
    width: 41,
    height: 41,
    borderRadius: 11,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  iconBoxGray: {
    width: 41,
    height: 41,
    borderRadius: 11,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },


  // ==================================================
  // TEXTO
  // ==================================================

  optionText: {
    flex: 1,
    paddingRight: 8,
  },

  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },

  optionDescription: {
    fontSize: 11.5,
    color: COLORS.subtitle,
    marginTop: 3,
    lineHeight: 16,
  },


  // ==================================================
  // DIVISOR
  // ==================================================

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 66,
  },


  // ==================================================
  // RODAPÉ
  // ==================================================

  footer: {
    alignItems: 'center',
    marginTop: 2,
    paddingTop: 8,
    paddingBottom: 20,
  },

  footerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },

  footerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },

  footerText: {
    fontSize: 11.5,
    color: COLORS.subtitle,
    marginTop: 3,
    textAlign: 'center',
  },

  footerVersion: {
    fontSize: 10.5,
    color: COLORS.muted,
    marginTop: 4,
  },

});