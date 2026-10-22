import { StyleSheet, Platform } from 'react-native';

const COLORS = {
  primary: '#8971D3',
  primaryDark: '#7259B8',
  secondary: '#9B8ADE',

  lilac: '#8971D3',
  lilacLight: '#F3F0FA',
  lilacSoft: '#F8F6FC',
  lilacBorder: '#E8E2F2',

  background: '#F8F9FB',
  white: '#FFFFFF',

  border: '#ECECF1',
  borderInput: '#E1E1E7',

  text: '#171717',
  textSecondary: '#55555F',
  subtitle: '#777781',
  muted: '#A0A0AA',

  success: '#45A875',
  danger: '#D95C68',
};

// ====================================================
// ESTILOS
// ====================================================

export default StyleSheet.create({

  // ====================================================
  // ESTRUTURAS GERAIS
  // ====================================================

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scroll: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },

  // ====================================================
  // CABEÇALHO
  // ====================================================

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 18,
    height: Platform.OS === 'web' ? 64 : 68,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: COLORS.lilacLight,
  },

  badgeId: {
    width: 38,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  badgeTextId: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
  },

  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },

  subtitle: {
    fontSize: 12,
    color: COLORS.subtitle,
    lineHeight: 17,
    marginTop: 1,
  },

  // ====================================================
  // HEADER DO PERFIL
  // ====================================================

  profileHeaderCard: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 22,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 8,
  },

  avatarImg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.lilacSoft,
    marginBottom: 11,
  },

  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },

  userEmail: {
    fontSize: 12.5,
    color: COLORS.subtitle,
    marginTop: 4,
  },

  // ====================================================
  // TÍTULOS DAS SEÇÕES
  // ====================================================

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: 18,
    marginTop: 20,
    marginBottom: 10,
    letterSpacing: 0,
  },

  // ====================================================
  // ITENS DO MENU
  // ====================================================

  menuItemRow: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 14,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  menuItemIconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: COLORS.lilacLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  menuItemTextBox: {
    flex: 1,
    paddingRight: 7,
  },

  menuItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },

  menuItemSubtitle: {
    fontSize: 11.5,
    color: COLORS.subtitle,
    marginTop: 3,
    lineHeight: 16,
  },

  // ====================================================
  // LISTAS
  // ====================================================

  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 15,
    marginTop: 9,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  listCardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: COLORS.lilacLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  listCardContent: {
    flex: 1,
  },

  listCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },

  listCardSubtitle: {
    fontSize: 11.5,
    color: COLORS.subtitle,
    marginTop: 3,
  },

  // ====================================================
  // STATUS
  // ====================================================

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: 5,
  },

  statusText: {
    fontSize: 11,
    color: COLORS.success,
    fontWeight: '600',
  },

  // ====================================================
  // BOTÃO INFERIOR
  // ====================================================

  bottomButtonContainer: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  primaryButton: {
    width: '100%',
    height: 49,
    backgroundColor: COLORS.primary,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  primaryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },

  // ====================================================
  // FORMULÁRIOS
  // ====================================================

  form: {
    backgroundColor: COLORS.white,
    borderRadius: 17,
    padding: 17,
    marginHorizontal: 15,
    marginTop: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  label: {
    fontSize: 12.5,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 14,
    marginBottom: 7,
  },

  inputBox: {
    width: '100%',
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.borderInput,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    justifyContent: 'center',
    marginBottom: 3,
  },

  input: {
    width: '100%',
    height: '100%',
    fontSize: 13,
    color: COLORS.text,
  },

  button: {
    width: '100%',
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 23,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: 0,
  },

  // ====================================================
  // RADIO
  // ====================================================

  rowRadioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },

  radioButtonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
    paddingVertical: 5,
  },

  radioCircleOutline: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
  },

  radioCircleChecked: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },

  radioLabelText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
  },

  // ====================================================
  // NOTIFICAÇÕES
  // ====================================================

  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 16,
    marginHorizontal: 15,
    marginTop: 9,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  notificationTextContent: {
    flex: 1,
    marginRight: 14,
  },

  notificationTitleText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },

  notificationDescriptionText: {
    fontSize: 11.5,
    color: COLORS.subtitle,
    marginTop: 3,
    lineHeight: 16,
  },

  // ====================================================
  // CARD DO PERFIL
  // ====================================================

  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingVertical: 21,
    paddingHorizontal: 17,
    alignItems: 'center',
    marginBottom: 19,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  photoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 11,
    position: 'relative',
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.lilacSoft,
  },

  defaultPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.lilacSoft,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.lilac,
  },

  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },

  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
    textAlign: 'center',
  },

  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  verifiedText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 5,
  },

  changePhotoButton: {
    marginTop: 11,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: COLORS.lilacLight,
  },

  changePhotoText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '600',
  },

  // ====================================================
  // SEÇÃO
  // ====================================================

  section: {
    marginBottom: 17,
  },

  // ====================================================
  // INPUTS
  // ====================================================

  inputGroup: {
    marginBottom: 13,
  },

  inputContainer: {
    minHeight: 48,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderInput,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  inputDisabled: {
    backgroundColor: '#F5F5F7',
    borderColor: '#E9E9ED',
  },

  // ====================================================
  // BOTÃO EDITAR
  // ====================================================

  editButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17,
  },

  editButtonText: {
    color: COLORS.white,
    fontSize: 13.5,
    fontWeight: '700',
    marginLeft: 7,
  },

  // ====================================================
  // BOTÕES SALVAR / CANCELAR
  // ====================================================

  editButtons: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 17,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F3F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    color: '#55555F',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },

  saveButton: {
    flex: 1.5,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },

  // ====================================================
  // SEGURANÇA
  // ====================================================

  securityCard: {
    backgroundColor: COLORS.lilacSoft,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.lilacBorder,
  },

  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  securityTextContainer: {
    flex: 1,
  },

  securityTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 3,
  },

  securityText: {
    fontSize: 11.5,
    color: COLORS.subtitle,
    lineHeight: 16,
  },

  // ====================================================
  // EXCLUIR CONTA
  // ====================================================

  deleteButton: {
    height: 47,
    borderRadius: 12,
    backgroundColor: '#FFF8F9',
    borderWidth: 1,
    borderColor: '#F2DDE0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },

  // ====================================================
  // ESPAÇO FINAL
  // ====================================================

  bottomSpace: {
    height: 30,
  },
});