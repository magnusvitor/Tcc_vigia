import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

const COLORS = {
  background: '#F8F9FC',
  white: '#FFFFFF',

  primary: '#8971D3',
  primaryDark: '#7259B8',
  navy: '#152D63',

  lilacLight: '#F4F1FB',
  lilacSoft: '#F8F6FC',
  lilacBorder: '#E7E0F3',

  text: '#17181C',
  textSecondary: '#555A66',
  subtitle: '#7C8290',
  muted: '#A1A6B0',

  border: '#E9EAF0',
  borderSoft: '#F0F1F4',

  red: '#D83A3A',
  redLight: '#FFF5F5',
  redBorder: '#F2D9D9',

  green: '#2ECC71',
};

// =====================================================
// ESTILOS
// =====================================================

export default StyleSheet.create({

  // =====================================================
  // TELA PRINCIPAL
  // =====================================================

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 18,
  },

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // =====================================================
  // AVISO DE EMERGÊNCIA
  // =====================================================

  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.redLight,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.redBorder,
  },

  alertText: {
    flex: 1,
    marginLeft: 9,
    color: '#7E4A4A',
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '500',
  },

  // =====================================================
  // ÁREA CENTRAL
  // =====================================================

  centerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 42,
  },

  // =====================================================
  // BOTÃO DE EMERGÊNCIA
  // =====================================================

  outerCircle: {
    width: Math.min(width * 0.65, 235),
    height: Math.min(width * 0.65, 235),
    borderRadius: 999,
    backgroundColor: COLORS.lilacSoft,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lilacBorder,
  },

  middleCircle: {
    width: '84%',
    height: '84%',
    borderRadius: 999,
    backgroundColor: '#DDD6F1',
    justifyContent: 'center',
    alignItems: 'center',
  },

  innerCircle: {
    width: '80%',
    height: '80%',
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',

    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity: 0.22,
        shadowRadius: 13,
      },

      android: {
        elevation: 6,
      },

      web: {
        boxShadow: '0px 7px 16px rgba(137, 113, 211, 0.22)',
      },
    }),
  },

  emergencyText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 7,
    letterSpacing: 0,
  },

  // =====================================================
  // TEXTOS INFERIORES
  // =====================================================

  bottomText: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 25,
  },

  subText: {
    color: COLORS.subtitle,
    fontSize: 12.5,
    lineHeight: 19,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 310,
  },

  // =====================================================
  // HEADER
  // =====================================================

  header: {
    minHeight: 64,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  backButton: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: COLORS.lilacLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginHorizontal: 10,
  },

  headerSpacer: {
    width: 39,
  },

  // =====================================================
  // TÍTULOS
  // =====================================================

  labelSection: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 9,
  },

  // =====================================================
  // GRID DE CATEGORIAS
  // =====================================================

  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  optionCard: {
    width: '48.5%',
    minHeight: 82,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 11,

    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.025,
        shadowRadius: 5,
      },

      android: {
        elevation: 1,
      },

      web: {
        boxShadow: '0px 2px 8px rgba(0,0,0,0.025)',
      },
    }),
  },

  optionText: {
    marginTop: 7,
    color: COLORS.textSecondary,
    fontSize: 12.5,
    fontWeight: '600',
    textAlign: 'center',
  },

  // =====================================================
  // ÁREA DE TEXTO
  // =====================================================

  textareaContainer: {
    width: '100%',
    minHeight: 135,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
  },

  input: {
    flex: 1,
    width: '100%',
    color: COLORS.text,
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: '400',
    textAlignVertical: 'top',
    padding: 0,
  },

  charCounter: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'right',
    marginTop: 5,
  },

  // =====================================================
  // FOTO / VÍDEO
  // =====================================================

  mediaButton: {
    width: '100%',
    minHeight: 53,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#DCD5EF',
    borderStyle: 'dashed',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  mediaButtonText: {
    color: COLORS.primaryDark,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 7,
    textAlign: 'center',
    flexShrink: 1,
  },

  // =====================================================
  // LOCALIZAÇÃO
  // =====================================================

  localBox: {
    width: '100%',
    minHeight: 55,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  loadingRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  localBoxText: {
    flex: 1,
    color: COLORS.subtitle,
    fontSize: 12.5,
    fontWeight: '400',
  },

  localBoxTextBold: {
    flex: 1,
    color: COLORS.text,
    fontSize: 12.5,
    fontWeight: '600',
  },

  // =====================================================
  // INFORMAÇÃO
  // =====================================================

  infoBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.lilacSoft,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.lilacBorder,
    padding: 13,
  },

  infoBoxText: {
    flex: 1,
    color: '#625E70',
    fontSize: 11.5,
    lineHeight: 17,
    fontWeight: '400',
  },

  // =====================================================
  // BOTÃO ENVIAR
  // =====================================================

  sendButton: {
    width: '100%',
    minHeight: 54,
    backgroundColor: COLORS.red,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 24,
    marginBottom: 25,

    ...Platform.select({
      ios: {
        shadowColor: COLORS.red,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },

      android: {
        elevation: 3,
      },

      web: {
        boxShadow: '0px 4px 14px rgba(216,58,58,0.15)',
      },
    }),
  },

  sendButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },

  // =====================================================
  // CONFIRMAÇÃO
  // =====================================================

  topHeaderConfirm: {
    minHeight: 64,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  backButtonConfirm: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: COLORS.lilacLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  containerConfirm: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 38,
    backgroundColor: COLORS.background,
  },

  // =====================================================
  // ÍCONE DE SUCESSO
  // =====================================================

  successCircle: {
    width: Math.min(width * 0.22, 86),
    height: Math.min(width * 0.22, 86),
    borderRadius: 999,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',

    ...Platform.select({
      ios: {
        shadowColor: COLORS.green,
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.18,
        shadowRadius: 9,
      },

      android: {
        elevation: 5,
      },

      web: {
        boxShadow: '0px 5px 15px rgba(46,204,113,0.18)',
      },
    }),
  },

  title: {
    color: COLORS.text,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 21,
    letterSpacing: -0.4,
  },

  subtitle: {
    color: COLORS.subtitle,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 25,
    maxWidth: 340,
  },

  // =====================================================
  // LISTA DE STATUS
  // =====================================================

  statusList: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 17,
    paddingVertical: 3,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: COLORS.border,

    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.025,
        shadowRadius: 7,
      },

      android: {
        elevation: 1,
      },

      web: {
        boxShadow: '0px 2px 9px rgba(0,0,0,0.025)',
      },
    }),
  },

  statusItem: {
    minHeight: 73,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSoft,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.lilacLight,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },

  textGroup: {
    flex: 1,
    marginLeft: 11,
    marginRight: 8,
  },

  itemTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },

  itemSubtitle: {
    color: COLORS.subtitle,
    fontSize: 11.5,
    fontWeight: '400',
    marginTop: 4,
  },

  // =====================================================
  // PROTOCOLO
  // =====================================================

  protocolText: {
    color: COLORS.subtitle,
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 21,
  },

  protocolBold: {
    color: COLORS.text,
    fontWeight: '700',
  },

  // =====================================================
  // BOTÃO CONFIRMAÇÃO
  // =====================================================

  button: {
    width: '100%',
    minHeight: 53,
    backgroundColor: COLORS.navy,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 24,

    ...Platform.select({
      ios: {
        shadowColor: COLORS.navy,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.13,
        shadowRadius: 8,
      },

      android: {
        elevation: 3,
      },

      web: {
        boxShadow: '0px 4px 14px rgba(21,45,99,0.13)',
      },
    }),
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },

  // MODAL DE ALERTA
  
  alertaOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.48)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  alertaCard: {
    width: '100%',
    maxWidth: 370,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 19,
    borderWidth: 1,
    borderColor: COLORS.border,

    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.14,
        shadowRadius: 18,
      },

      android: {
        elevation: 8,
      },

      web: {
        boxShadow: '0px 8px 28px rgba(0,0,0,0.14)',
      },
    }),
  },

  // TOPO DO MODAL

  alertaTopo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  alertaIcone: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: COLORS.redLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  alertaTopoTexto: {
    flex: 1,
  },

  alertaTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },

  alertaSubtitulo: {
    marginTop: 3,
    fontSize: 10,
    color: COLORS.muted,
  },

  alertaLinha: {
    height: 1,
    backgroundColor: COLORS.borderSoft,
    marginVertical: 15,
  },

  // MENSAGEM

  alertaMensagemTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 5,
  },

  alertaMensagem: {
    fontSize: 12.5,
    lineHeight: 19,
    color: COLORS.textSecondary,
  },

  // INFORMAÇÕES DO ALERTA

  alertaInfo: {
    marginTop: 15,
    backgroundColor: '#F8F8FA',
    borderRadius: 13,
    padding: 12,
  },

  alertaInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  alertaInfoItemLast: {
    marginBottom: 0,
  },

  alertaInfoTexto: {
    marginLeft: 9,
    flex: 1,
  },

  alertaInfoLabel: {
    fontSize: 8.5,
    fontWeight: '700',
    color: COLORS.muted,
    letterSpacing: 0.5,
  },

  alertaInfoValor: {
    marginTop: 2,
    fontSize: 11.5,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },

  // AVISO 


  alertaAviso: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
    paddingHorizontal: 2,
  },

  alertaAvisoTexto: {
    flex: 1,
    marginLeft: 7,
    fontSize: 10.5,
    lineHeight: 15,
    color: COLORS.subtitle,
  },

 
  alertaBotao: {
    width: '100%',
    height: 45,
    marginTop: 17,
    borderRadius: 12,
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },

  alertaBotaoTexto: {
    color: COLORS.white,
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});