
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from 'expo-audio';

export default function GravadorAudio({ onEnviar, desabilitado = false }) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const estado = useAudioRecorderState(recorder);
  const [processando, setProcessando] = useState(false);

  const iniciar = async () => {
    try {
      const permissao = await requestRecordingPermissionsAsync();

      if (!permissao.granted) {
        Alert.alert(
          'Permissão necessária',
          'Permita o acesso ao microfone para gravar áudios.'
        );
        return;
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível iniciar a gravação.');
    }
  };

  const finalizar = async () => {
    if (!estado.isRecording || processando) return;

    try {
      setProcessando(true);
      await recorder.stop();

      const uri = recorder.uri;

      if (!uri) {
        Alert.alert('Erro', 'A gravação não foi encontrada.');
        return;
      }

      await onEnviar({
        uri,
        name: `audio_${Date.now()}.m4a`,
        mimeType: 'audio/mp4',
      });
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível finalizar o áudio.');
    } finally {
      setProcessando(false);
      await setAudioModeAsync({ allowsRecording: false });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={desabilitado || processando}
        style={[
          styles.botao,
          estado.isRecording && styles.gravando,
          (desabilitado || processando) && styles.desabilitado,
        ]}
        onPressIn={iniciar}
        onPressOut={() => {
          if (estado.isRecording) finalizar();
        }}
        activeOpacity={0.8}
        accessibilityLabel={
          estado.isRecording
            ? 'Solte para enviar o áudio'
            : 'Segure para gravar áudio'
        }
      >
        <MaterialIcons
          name={estado.isRecording ? 'graphic-eq' : 'mic'}
          size={24}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      {estado.isRecording && (
        <Text style={styles.texto}>
          Gravando… solte para enviar
        </Text>
      )}

      {processando && <Text style={styles.texto}>Enviando áudio…</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  botao: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#7259B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gravando: {
    backgroundColor: '#D93045',
  },
  desabilitado: {
    opacity: 0.5,
  },
  texto: {
    position: 'absolute',
    bottom: 48,
    right: -80,
    width: 170,
    fontSize: 11,
    color: '#7259B8',
    backgroundColor: '#FFFFFF',
    padding: 5,
    borderRadius: 8,
    textAlign: 'center',
  },
});
