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

  success: '#22A06B',
};

export default function Privacidade({ navigation }) {
  const [localizacao, setLocalizacao] = useState(true);
  const [camera, setCamera] = useState(true);
  const [notificacoes, setNotificacoes] = useState(true);
  const [denunciasAnonimas, setDenunciasAnonimas] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}
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
            <Text style={styles.title}>Privacidade</Text>

            <Text style={styles.subtitle}>
              Controle seus dados e permissões
            </Text>
          </View>
        </View>

        {/* PERMISSÕES */}
        <Text style={styles.sectionTitle}>
          Permissões
        </Text>

        <View style={styles.card}>

          {/* LOCALIZAÇÃO */}
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
                Utilize sua localização para registrar ocorrências com precisão
              </Text>
            </View>

            <Switch
              value={localizacao}
              onValueChange={setLocalizacao}
              trackColor={{
                false: '#D5DAE3',
                true: '#9EB4E2',
              }}
              thumbColor={
                localizacao ? COLORS.secondary : '#FFFFFF'
              }
            />
          </View>

          <View style={styles.divider} />

          {/* CÂMERA */}
          <View style={styles.option}>
            <View style={styles.iconBoxPurple}>
              <MaterialIcons
                name="photo-camera"
                size={22}
                color={COLORS.purple}
              />
            </View>

            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>
                Câmera
              </Text>

              <Text style={styles.optionDescription}>
                Permitir acesso à câmera para registrar imagens
              </Text>
            </View>

            <Switch
              value={camera}
              onValueChange={setCamera}
              trackColor={{
                false: '#D5DAE3',
                true: '#B7A9DD',
              }}
              thumbColor={
                camera ? COLORS.purple : '#FFFFFF'
              }
            />
          </View>

          <View style={styles.divider} />

          {/* NOTIFICAÇÕES */}
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
                Receber notificações relacionadas ao aplicativo
              </Text>
            </View>

            <Switch
              value={notificacoes}
              onValueChange={setNotificacoes}
              trackColor={{
                false: '#D5DAE3',
                true: '#9EB4E2',
              }}
              thumbColor={
                notificacoes ? COLORS.secondary : '#FFFFFF'
              }
            />
          </View>

          <View style={styles.divider} />

          {/* ABRIR PERMISSÕES */}
          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Permissoes')}
          >
            <View style={styles.iconBoxPurple}>
              <MaterialIcons
                name="admin-panel-settings"
                size={22}
                color={COLORS.purple}
              />
            </View>

            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>
                Gerenciar permissões
              </Text>

              <Text style={styles.optionDescription}>
                Veja e gerencie as permissões do aplicativo
              </Text>
            </View>

            <MaterialIcons
              name="chevron-right"
              size={24}
              color={COLORS.muted}
            />
          </TouchableOpacity>

        </View>

        {/* DENÚNCIAS */}
        <Text style={styles.sectionTitle}>
          Denúncias
        </Text>

        <View style={styles.card}>
          <View style={styles.option}>

            <View style={styles.iconBoxPurple}>
              <MaterialIcons
                name="visibility-off"
                size={22}
                color={COLORS.purple}
              />
            </View>

            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>
                Denúncias anônimas
              </Text>

              <Text style={styles.optionDescription}>
                Seus dados pessoais não serão exibidos publicamente
              </Text>
            </View>

            <Switch
              value={denunciasAnonimas}
              onValueChange={setDenunciasAnonimas}
              trackColor={{
                false: '#D5DAE3',
                true: '#B7A9DD',
              }}
              thumbColor={
                denunciasAnonimas ? COLORS.purple : '#FFFFFF'
              }
            />

          </View>
        </View>

        {/* SEUS DADOS */}
        <Text style={styles.sectionTitle}>
          Seus dados
        </Text>

        <View style={styles.card}>

          {/* POLÍTICA */}
          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('PoliticaPrivacidade')}
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
                Política de privacidade
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

          {/* GERENCIAR DADOS */}
          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('GerenciarDados')}
          >
            <View style={styles.iconBoxPurple}>
              <MaterialIcons
                name="manage-accounts"
                size={22}
                color={COLORS.purple}
              />
            </View>

            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>
                Gerenciar meus dados
              </Text>

              <Text style={styles.optionDescription}>
                Consulte e gerencie as informações da sua conta
              </Text>
            </View>

            <MaterialIcons
              name="chevron-right"
              size={24}
              color={COLORS.muted}
            />
          </TouchableOpacity>

        </View>

        {/* INFORMAÇÃO */}
        <View style={styles.infoBox}>
          <MaterialIcons
            name="info-outline"
            size={20}
            color={COLORS.secondary}
          />

          <Text style={styles.infoText}>
            O SMC utiliza suas informações somente para oferecer
            recursos relacionados à segurança e ao funcionamento
            do aplicativo.
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

  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.blueLight,
    borderRadius: 13,
    padding: 13,
    marginTop: 2,
  },

  infoText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 11.5,
    lineHeight: 17,
    color: COLORS.subtitle,
  },
});