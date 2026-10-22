
import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  // TELA
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },

  loadingIcon: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: '#ECE7FA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: '#73798B',
    fontSize: 13,
    fontWeight: '500',
  },

  // CABEÇALHO
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 18,
    gap: 12,
    backgroundColor: '#F5F6FA',
  },

  backButton: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E9F0',
  },

  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },

  headerEyebrow: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: '#8974C9',
    marginBottom: 3,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.7,
    color: '#19294D',
  },

  createButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#8974C9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // CONTEÚDO
  content: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },

  // BANNER PRINCIPAL
  hero: {
    minHeight: 238,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: '#243657',
    marginBottom: 24,
  },

  heroImage: {
    borderRadius: 20,
    resizeMode: 'cover',
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 27, 51, 0.66)',
  },

  heroContent: {
    paddingHorizontal: 19,
    paddingVertical: 19,
  },

  heroBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 7,
    backgroundColor: 'rgba(193, 172, 255, 0.22)',
    marginBottom: 12,
  },

  heroBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.65,
    color: '#FFFFFF',
  },

  heroTitle: {
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '800',
    letterSpacing: -0.65,
    color: '#FFFFFF',
    maxWidth: 290,
  },

  heroDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: '#E5E8F1',
    marginTop: 8,
    marginBottom: 15,
    maxWidth: 295,
  },

  heroButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F0ECFA',
  },

  heroButtonText: {
    color: '#19294D',
    fontSize: 11,
    fontWeight: '700',
  },

  // TÍTULOS DE SEÇÃO
  metricsHeader: {
    marginBottom: 11,
  },

  sectionTitle: {
    color: '#19294D',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.4,
  },

  sectionCaption: {
    color: '#858A9B',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },

  // MÉTRICAS COMPACTAS
  metricsRow: {
    flexDirection: 'row',
    gap: 11,
    marginBottom: 25,
  },

  metricCard: {
    flex: 1,
    minHeight: 112,
    padding: 13,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEBF1',
    ...Platform.select({
      ios: {
        shadowColor: '#253354',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.035,
        shadowRadius: 7,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  metricIconPurple: {
    width: 31,
    height: 31,
    borderRadius: 10,
    backgroundColor: '#F0ECFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  metricIconBlue: {
    width: 31,
    height: 31,
    borderRadius: 10,
    backgroundColor: '#EDF1F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  metricNumber: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: '#19294D',
  },

  metricLabel: {
    fontSize: 10,
    lineHeight: 14,
    color: '#777D90',
    marginTop: 3,
  },

  // CABEÇALHO DOS GRUPOS
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 13,
  },

  sectionHeading: {
    flex: 1,
  },

  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#ECE7FA',
  },

  exploreButtonText: {
    color: '#725BB5',
    fontSize: 11,
    fontWeight: '700',
  },

  // PESQUISA
  searchInputContainer: {
    height: 47,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 13,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E8EF',
    marginBottom: 14,
  },

  searchInput: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    fontSize: 12,
    color: '#19294D',
  },

  // CARTÕES DAS COMUNIDADES
  communityList: {
    gap: 10,
  },

  communityCard: {
    minHeight: 83,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEBF1',
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#253354',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.025,
        shadowRadius: 5,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  communityIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: '#F0ECFA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  communityInfo: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },

  communityName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#19294D',
    marginBottom: 5,
  },

  neighborhoodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 4,
  },

  communityNeighborhood: {
    flexShrink: 1,
    fontSize: 10,
    color: '#858A9B',
  },

  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  participants: {
    fontSize: 10,
    color: '#8974C9',
    fontWeight: '600',
  },

  cardArrow: {
    width: 27,
    height: 27,
    borderRadius: 9,
    backgroundColor: '#F5F2FC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ESTADOS VAZIOS E ERROS
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9EAF1',
  },

  emptyIcon: {
    width: 53,
    height: 53,
    borderRadius: 17,
    backgroundColor: '#F0ECFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  emptyTitle: {
    color: '#19294D',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },

  emptyText: {
    color: '#858A9B',
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 15,
  },

  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: '#8974C9',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  // RODAPÉ
  bottomNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
    paddingHorizontal: 6,
  },

  bottomNoteText: {
    flexShrink: 1,
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 15,
    color: '#858A9B',
  },

  metricsHeader: {
  marginBottom: 10,
},

metricsRow: {
  flexDirection: 'row',
  gap: 24,
  marginBottom: 25,
  paddingVertical: 5,
},

metricCard: {
  flex: 1,
  backgroundColor: 'transparent',
  paddingVertical: 4,
  paddingHorizontal: 0,
  borderWidth: 0,
  borderRadius: 0,
  minHeight: 0,
  elevation: 0,
  shadowOpacity: 0,
},


scroll: {
  flex: 1,
},

bottomAction: {
  paddingHorizontal: 20,
  paddingTop: 10,
  paddingBottom: 10,
  backgroundColor: '#F5F6FA',
  borderTopWidth: 1,
  borderTopColor: '#E9EAF1',
},


createCommunityButton: {
  position: 'absolute',
  bottom: 24,
  right: 20,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  backgroundColor: '#8971D3',
  paddingHorizontal: 18,
  height: 52,
  borderRadius: 28,
  elevation: 6,
  shadowColor: '#152D63',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.18,
  shadowRadius: 6,
  zIndex: 10,
},

createCommunityButtonText: {
  color: '#FFFFFF',
  fontSize: 13,
  fontWeight: '700',
},


});

export default styles;
