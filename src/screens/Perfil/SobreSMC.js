import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
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

export default function SobreSMC({ navigation }) {

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
              Sobre o SMC
            </Text>

            <Text style={styles.subtitle}>
              Informações sobre o aplicativo
            </Text>

          </View>

        </View>


        <View style={styles.logoArea}>

          <View style={styles.logo}>

            <MaterialIcons
              name="security"
              size={38}
              color={COLORS.white}
            />

          </View>

          <Text style={styles.logoTitle}>
            SMC
          </Text>

          <Text style={styles.logoSubtitle}>
            Sistema de Monitoramento Colaborativo
          </Text>

          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>
              Versão 1.0.0
            </Text>
          </View>

        </View>


        <Text style={styles.sectionTitle}>
          Sobre o aplicativo
        </Text>

        <View style={styles.card}>

          <Text style={styles.description}>
            O SMC é uma plataforma voltada ao compartilhamento
            de informações relacionadas à segurança pública,
            permitindo o registro de ocorrências, denúncias,
            câmeras comunitárias e informações de interesse
            da comunidade.
          </Text>

        </View>


        <Text style={styles.sectionTitle}>
          Informações
        </Text>

        <View style={styles.card}>

          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.7}
          >

            <View style={styles.iconBoxBlue}>

              <MaterialIcons
                name="description"
                size={22}
                color={COLORS.secondary}
              />

            </View>

            <View style={styles.optionText}>

              <Text style={styles.optionTitle}>
                Termos de uso
              </Text>

              <Text style={styles.optionDescription}>
                Consulte as regras de utilização do SMC
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
          >

            <View style={styles.iconBoxPurple}>

              <MaterialIcons
                name="privacy-tip"
                size={22}
                color={COLORS.purple}
              />

            </View>

            <View style={styles.optionText}>

              <Text style={styles.optionTitle}>
                Política de privacidade
              </Text>

              <Text style={styles.optionDescription}>
                Saiba como os dados são tratados pelo aplicativo
              </Text>

            </View>

            <MaterialIcons
              name="chevron-right"
              size={24}
              color={COLORS.muted}
            />

          </TouchableOpacity>

        </View>


        <View style={styles.footer}>

          <MaterialIcons
            name="security"
            size={18}
            color={COLORS.primary}
          />

          <Text style={styles.footerText}>
            Desenvolvido como projeto de conclusão de curso.
          </Text>

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

  logoArea: {
    alignItems: 'center',
    marginBottom: 26,
  },

  logo: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  logoTitle: {
    fontSize: 25,
    fontWeight: '900',
    color: COLORS.primary,
  },

  logoSubtitle: {
    fontSize: 12,
    color: COLORS.subtitle,
    textAlign: 'center',
    marginTop: 3,
  },

  versionBadge: {
    backgroundColor: COLORS.purpleLight,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 10,
  },

  versionText: {
    fontSize: 10.5,
    color: COLORS.purple,
    fontWeight: '700',
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

  description: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.subtitle,
    padding: 16,
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

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    paddingVertical: 15,
  },

  footerText: {
    fontSize: 10.5,
    color: COLORS.muted,
    marginLeft: 6,
  },

});