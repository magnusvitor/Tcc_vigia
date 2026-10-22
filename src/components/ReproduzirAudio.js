
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

export default function ReproduzirAudio({ uri }) {
  const player = useAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    return () => {
      player.pause();
    };
  }, [player]);

  const alternar = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const formatar = (segundos = 0) => {
    const total = Math.floor(Number(segundos) || 0);
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={alternar} style={styles.botao}>
        <MaterialIcons
          name={status.playing ? 'pause' : 'play-arrow'}
          size={25}
          color="#7259B8"
        />
      </TouchableOpacity>

      <View style={styles.conteudo}>
        <View style={styles.trilha}>
          <View
            style={[
              styles.progresso,
              {
                width: `${
                  status.duration > 0
                    ? Math.min(100, (status.currentTime / status.duration) * 100)
                    : 0
                }%`,
              },
            ]}
          />
        </View>
        <Text style={styles.tempo}>
          {formatar(status.currentTime)} / {formatar(status.duration)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 180,
    gap: 8,
  },
  botao: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conteudo: {
    flex: 1,
  },
  trilha: {
    height: 5,
    borderRadius: 5,
    backgroundColor: '#D6CDEA',
    overflow: 'hidden',
  },
  progresso: {
    height: 5,
    backgroundColor: '#7259B8',
  },
  tempo: {
    fontSize: 10,
    color: '#777789',
    marginTop: 4,
  },
});
