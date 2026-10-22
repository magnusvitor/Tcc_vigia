import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CORES = {
  primary: '#152D63',
  secondary: '#2E5AAC',
  lilac: '#8971D3',
  background: '#F8FAFC',
  white: '#FFFFFF',
  text: '#152D63',
  gray: '#64748B',
  lightGray: '#E2E8F0',
};

export default function SubtelaPerfil({
  navigation,
  titulo,
  children,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons
            name="arrow-back"
            size={25}
            color={CORES.primary}
          />
        </TouchableOpacity>

        <Text style={styles.titulo}>{titulo}</Text>

        <View style={styles.espaco} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        {children}
      </ScrollView>
    </View>
  );
}

export function CardInfo({ children }) {
  return (
    <View style={styles.card}>
      {children}
    </View>
  );
}

export function TextoTitulo({ children }) {
  return <Text style={styles.tituloSecao}>{children}</Text>;
}

export function Texto({ children }) {
  return <Text style={styles.texto}>{children}</Text>;
}

export function Linha({
  icone,
  titulo,
  descricao,
  onPress,
  direita,
}) {
  return (
    <TouchableOpacity
      style={styles.linha}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.icone}>
        <MaterialIcons
          name={icone}
          size={22}
          color={CORES.secondary}
        />
      </View>

      <View style={styles.linhaTexto}>
        <Text style={styles.linhaTitulo}>{titulo}</Text>

        {descricao ? (
          <Text style={styles.linhaDescricao}>{descricao}</Text>
        ) : null}
      </View>

      {direita || (
        <MaterialIcons
          name="chevron-right"
          size={24}
          color="#94A3B8"
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.background,
  },

  header: {
    height: 64,
    backgroundColor: CORES.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
  },

  botaoVoltar: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  titulo: {
    flex: 1,
    textAlign: 'center',
    fontSize: 19,
    fontWeight: '700',
    color: CORES.primary,
  },

  espaco: {
    width: 40,
  },

  conteudo: {
    padding: 18,
    paddingBottom: 35,
  },

  card: {
    backgroundColor: CORES.white,
    borderRadius: 15,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E9EEF5',
  },

  tituloSecao: {
    fontSize: 15,
    fontWeight: '700',
    color: CORES.primary,
    marginBottom: 10,
  },

  texto: {
    fontSize: 14,
    lineHeight: 22,
    color: CORES.gray,
  },

  linha: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.white,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
  },

  icone: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  linhaTexto: {
    flex: 1,
  },

  linhaTitulo: {
    fontSize: 15,
    fontWeight: '600',
    color: CORES.primary,
  },

  linhaDescricao: {
    marginTop: 3,
    fontSize: 12,
    color: CORES.gray,
  },
});