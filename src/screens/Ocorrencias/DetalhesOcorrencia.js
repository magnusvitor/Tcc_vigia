import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

export default function DetalhesOcorrencia({ route, navigation }) {
  const { ocorrencia } = route.params || { ocorrencia: { categoria: 'Roubo', data_formatada: '27/08/2026 - 15:42', bairro: 'Centro', status: 'Em andamento' } };
  const esSolucionado = ocorrencia.status?.toLowerCase() === 'solucionada';

  function obterConfiguracaoCrime(categoria) {
    const catLower = categoria?.toLowerCase() || '';
    if (catLower.includes('roubo')) return { nome: "shield-alert", cor: "#eb4d4b", textoBadge: "Roubo" };
    if (catLower.includes('furto')) return { nome: "hand-left", cor: "#f0932b", textoBadge: "Furto" };
    if (catLower.includes('homicidio')) return { nome: "skull", cor: "#c0392b", textoBadge: "Homicídio" };
    return { nome: "warning", cor: "#7259c1", textoBadge: "Outro" };
  }

  const config = obterConfiguracaoCrime(ocorrencia.categoria);

  return (
      
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="#152d63" />
      </TouchableOpacity>
      
      {/* Atualizado aqui com Detail */}
      <View style={styles.badgeIdDetail}><Text style={styles.badgeTextIdDetail}>05.1</Text></View>
      <Text style={styles.headerTitlePageDetail}>Detalhes da ocorrência</Text>
    </View>

    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.cardHeaderRow}>
        <View style={[styles.iconBoxPlaceholder, { backgroundColor: config.cor + '15' }]}>
          <Ionicons name={config.nome} size={22} color={config.cor} />
        </View>
        
        {/* Atualizado aqui com Detail */}
        <View style={styles.titleBlock}>
          <Text style={styles.crimeTitleDetail}>{config.textoBadge}</Text>
          <Text style={styles.crimeDateDetail}>{ocorrencia.data_formatada}</Text>
        </View>
        
        {/* Atualizado aqui com Detail */}
        <View style={[styles.statusBadgeDetail, { backgroundColor: esSolucionado ? '#e3fce7' : '#fff3cd' }]}>
          <Text style={[styles.statusBadgeTextDetail, { color: esSolucionado ? '#4cd137' : '#e1b12c' }]}>
            {esSolucionado ? 'SOLUCIONADA' : 'EM ANDAMENTO'}
          </Text>
        </View>
      </View>

        <Text style={styles.labelSection}>Local</Text>
        <Text style={styles.valueText}>{ocorrencia.bairro} - Registro/SP</Text>

        <Text style={styles.labelSection}>Descrição</Text>
        <Text style={styles.descriptionText}>
          {ocorrencia.descricao || "Dois indivíduos em uma moto abordaram a vítima e levaram seu celular."}
        </Text>

        <Text style={styles.labelSection}>Registre visual</Text>
        <Image 
          source={{ uri: 'https://unsplash.com' }} 
          style={styles.mockImage} 
        />

        <Text style={styles.labelSection}>Linha do tempo</Text>
        <View style={styles.timelineContainer}>
          
          <View style={styles.timelineItem}>
            <View style={[styles.timelineNode, styles.nodeActive]} />
            <View style={styles.timelineLine} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTime}>{ocorrencia.data_formatada}</Text>
              <Text style={styles.timelineStatus}>Denúncia enviada</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineNode, styles.nodeActive]} />
            <View style={styles.timelineLine} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTime}>{ocorrencia.data_formatada}</Text>
              <Text style={styles.timelineStatus}>Recebida pelo sistema</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineNode, styles.nodeActive]} />
            <View style={styles.timelineLine} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTime}>{ocorrencia.data_formatada}</Text>
              <Text style={styles.timelineStatus}>Em análise</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineNode, esSolucionado ? styles.nodeActive : styles.nodePending]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTime}>{esSolucionado ? ocorrencia.data_formatada : '--/--/---- - --:--'}</Text>
              <Text style={[styles.timelineStatus, !esSolucionado && { color: '#94a3b8' }]}>Solucionada</Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
