import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  StyleSheet,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

const COLORS = {
  primary: '#152D63',
  secondary: '#2E5AAC',

  purple: '#7259B8',
  purpleLight: '#F1EEFA',

  blueLight: '#EEF3FB',
  background: '#F7F8FC',
  white: '#FFFFFF',
  border: '#E3E7EF',

  text: '#111827',
  subtitle: '#64748B',
  muted: '#94A3B8',
};

export default function Seguranca({ navigation }) {

  const [duasEtapas, setDuasEtapas] = useState(false);
  const [alertasLogin, setAlertasLogin] = useState(true);

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

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
              Segurança
            </Text>

            <Text style={styles.subtitle}>
              Proteja sua conta e seus acessos
            </Text>
          </View>

        </View>


        <Text style={styles.sectionTitle}>
          Segurança da conta
        </Text>

        <View style={styles.card}>

          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("AlterarSenha")}
>
            <View style={styles.iconBoxBlue}>
              <MaterialIcons
                name="lock-outline"
                size={22}
                color={COLORS.secondary}
              />
            </View>

            <View style={styles.optionText}>

              <Text style={styles.optionTitle}>
                Alterar senha
              </Text>

              <Text style={styles.optionDescription}>
                Atualize sua senha de acesso à conta
              </Text>

            </View>

            <MaterialIcons
              name="chevron-right"
              size={24}
              color={COLORS.muted}
            />

          </TouchableOpacity>


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
                Verificação em duas etapas
              </Text>

              <Text style={styles.optionDescription}>
                Adicione uma camada extra de proteção à sua conta
              </Text>

            </View>

            <Switch
              value={duasEtapas}
              onValueChange={setDuasEtapas}
              trackColor={{
                false: '#D5DAE3',
                true: '#B7A9DD',
              }}
              thumbColor={
                duasEtapas ? COLORS.purple : '#FFFFFF'
              }
            />

          </View>


          <View style={styles.divider} />


          <View style={styles.option}>

            <View style={styles.iconBoxBlue}>
              <MaterialIcons
                name="notifications-active"
                size={22}
                color={COLORS.secondary}
              />
            </View>

            <View style={styles.optionText}>

              <Text style={styles.optionTitle}>
                Alertas de login
              </Text>

              <Text style={styles.optionDescription}>
                Receba avisos sobre novos acessos à sua conta
              </Text>

            </View>

            <Switch
              value={alertasLogin}
              onValueChange={setAlertasLogin}
              trackColor={{
                false: '#D5DAE3',
                true: '#9EB4E2',
              }}
              thumbColor={
                alertasLogin ? COLORS.secondary : '#FFFFFF'
              }
            />

          </View>

        </View>


        <Text style={styles.sectionTitle}>
          Atividade
        </Text>

        <View style={styles.card}>

          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("DispositivosConectados")}
>

            <View style={styles.iconBoxBlue}>
              <MaterialIcons
                name="devices"
                size={22}
                color={COLORS.secondary}
              />
            </View>

            <View style={styles.optionText}>

              <Text style={styles.optionTitle}>
                Dispositivos conectados
              </Text>

              <Text style={styles.optionDescription}>
                Veja os dispositivos que possuem acesso à sua conta
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
            activeOpacity={0.7}
            onPress={() => navigation.navigate("AtividadeConta")}
>
            <View style={styles.iconBoxPurple}>
              <MaterialIcons
                name="history"
                size={22}
                color={COLORS.purple}
              />
            </View>

            <View style={styles.optionText}>

              <Text style={styles.optionTitle}>
                Atividade da conta
              </Text>

              <Text style={styles.optionDescription}>
                Consulte atividades recentes da sua conta
              </Text>

            </View>

            <MaterialIcons
              name="chevron-right"
              size={24}
              color={COLORS.muted}
            />

          </TouchableOpacity>

        </View>


        <View style={styles.securityBox}>

          <View style={styles.securityIcon}>
            <MaterialIcons
              name="security"
              size={22}
              color={COLORS.white}
            />
          </View>

          <View style={styles.securityText}>

            <Text style={styles.securityTitle}>
              Mantenha sua conta segura
            </Text>

            <Text style={styles.securityDescription}>
              Nunca compartilhe sua senha ou códigos de acesso
              com outras pessoas.
            </Text>

          </View>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 35,
  },

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

  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
    marginTop: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginBottom: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  option: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
  },

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

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 66,
  },

  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    padding: 14,
    marginTop: 2,
  },

  securityIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  securityText: {
    flex: 1,
  },

  securityTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },

  securityDescription: {
    color: '#D9E2F5',
    fontSize: 11.5,
    lineHeight: 17,
    marginTop: 3,
  },

});