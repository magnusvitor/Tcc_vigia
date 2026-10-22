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

export default function CentralAjuda({ navigation }) {

  const perguntas = [
    {
      titulo: 'Como fazer uma denúncia?',
      descricao: 'Saiba como registrar uma denúncia pelo aplicativo.',
      icone: 'campaign',
      cor: 'blue',
    },
    {
      titulo: 'Como registrar uma ocorrência?',
      descricao: 'Veja como informar uma ocorrência de segurança.',
      icone: 'report',
      cor: 'purple',
    },
    {
      titulo: 'Como funciona o mapa?',
      descricao: 'Entenda as informações exibidas no mapa do SMC.',
      icone: 'map',
      cor: 'blue',
    },
    {
      titulo: 'Como cadastrar uma câmera?',
      descricao: 'Veja como compartilhar uma câmera comunitária.',
      icone: 'videocam',
      cor: 'purple',
    },
    {
      titulo: 'Como funcionam os alertas?',
      descricao: 'Entenda o funcionamento dos alertas de emergência.',
      icone: 'notifications-active',
      cor: 'blue',
    },
  ];

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
              Central de ajuda
            </Text>

            <Text style={styles.subtitle}>
              Encontre respostas para suas dúvidas
            </Text>

          </View>

        </View>


        <View style={styles.searchInfo}>

          <MaterialIcons
            name="help-outline"
            size={24}
            color={COLORS.secondary}
          />

          <View style={styles.searchText}>

            <Text style={styles.searchTitle}>
              Como podemos ajudar?
            </Text>

            <Text style={styles.searchDescription}>
              Confira as principais dúvidas sobre o SMC.
            </Text>

          </View>

        </View>


        <Text style={styles.sectionTitle}>
          Dúvidas frequentes
        </Text>


        <View style={styles.card}>

          {perguntas.map((item, index) => (

            <React.Fragment key={item.titulo}>

              <TouchableOpacity
                style={styles.option}
                activeOpacity={0.7}
              >

                <View
                  style={
                    item.cor === 'purple'
                      ? styles.iconBoxPurple
                      : styles.iconBoxBlue
                  }
                >

                  <MaterialIcons
                    name={item.icone}
                    size={22}
                    color={
                      item.cor === 'purple'
                        ? COLORS.purple
                        : COLORS.secondary
                    }
                  />

                </View>

                <View style={styles.optionText}>

                  <Text style={styles.optionTitle}>
                    {item.titulo}
                  </Text>

                  <Text style={styles.optionDescription}>
                    {item.descricao}
                  </Text>

                </View>

                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={COLORS.muted}
                />

              </TouchableOpacity>

              {index < perguntas.length - 1 && (
                <View style={styles.divider} />
              )}

            </React.Fragment>

          ))}

        </View>


        <Text style={styles.sectionTitle}>
          Ainda precisa de ajuda?
        </Text>


        <View style={styles.card}>

          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('RelatarProblema')}
          >

            <View style={styles.iconBoxDanger}>

              <MaterialIcons
                name="bug-report"
                size={22}
                color="#C65A65"
              />

            </View>

            <View style={styles.optionText}>

              <Text style={styles.optionTitle}>
                Relatar um problema
              </Text>

              <Text style={styles.optionDescription}>
                Informe um erro ou problema encontrado no aplicativo
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
                name="chat"
                size={22}
                color={COLORS.purple}
              />

            </View>

            <View style={styles.optionText}>

              <Text style={styles.optionTitle}>
                Fale conosco
              </Text>

              <Text style={styles.optionDescription}>
                Entre em contato com a equipe responsável pelo SMC
              </Text>

            </View>

            <MaterialIcons
              name="chevron-right"
              size={24}
              color={COLORS.muted}
            />

          </TouchableOpacity>

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

  searchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.blueLight,
    borderRadius: 15,
    padding: 14,
    marginBottom: 22,
  },

  searchText: {
    flex: 1,
    marginLeft: 10,
  },

  searchTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },

  searchDescription: {
    fontSize: 11.5,
    color: COLORS.subtitle,
    marginTop: 3,
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

  iconBoxDanger: {
    width: 41,
    height: 41,
    borderRadius: 11,
    backgroundColor: '#FFF1F2',
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

});