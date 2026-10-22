
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F7FB",
  },

  container: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 28,
    maxWidth: 1000,
    width: "100%",
    alignSelf: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 9,
  },

  headerTexto: {
    flex: 1,
  },

  titulo: {
    fontSize: 23,
    fontWeight: "800",
    color: "#292442",
  },

  subtitulo: {
    fontSize: 13,
    color: "#858198",
    marginTop: 4,
  },

  botaoIcone: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECE8F6",
    alignItems: "center",
    justifyContent: "center",
  },

  resumoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 17,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#EEEBF5",
    gap: 13,
  },

  resumoIcone: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#F0EBFF",
    alignItems: "center",
    justifyContent: "center",
  },

  resumoTexto: {
    flex: 1,
  },

  resumoTitulo: {
    color: "#858198",
    fontSize: 12,
    fontWeight: "500",
  },

  resumoNumero: {
    color: "#292442",
    fontSize: 27,
    fontWeight: "800",
    marginTop: 2,
  },

  resumoDescricao: {
    color: "#858198",
    fontSize: 11,
    marginTop: 2,
  },

  resumoSelo: {
    backgroundColor: "#F3F0FC",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    gap: 4,
  },

  resumoSeloTexto: {
    color: "#7259B8",
    fontSize: 10,
    fontWeight: "700",
  },

  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#ECE8F6",
    padding: 15,
    marginBottom: 22,
    gap: 13,
  },

  menuTitulo: {
    color: "#292442",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 2,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  menuInformacao: {
    flex: 1,
  },

  menuTexto: {
    color: "#39334F",
    fontSize: 13,
    fontWeight: "700",
  },

  menuDescricao: {
    color: "#89859A",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },

  secaoCabecalho: {
    marginBottom: 12,
  },

  secaoTitulo: {
    color: "#292442",
    fontSize: 17,
    fontWeight: "800",
  },

  secaoSubtitulo: {
    color: "#89859A",
    fontSize: 12,
    marginTop: 4,
  },

  filtrosLinha: {
    gap: 9,
    paddingBottom: 22,
  },

  filtroBotao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECE8F6",
  },

  filtroBotaoAtivo: {
    backgroundColor: "#7259B8",
    borderColor: "#7259B8",
  },

  filtroTexto: {
    color: "#514B66",
    fontSize: 12,
    fontWeight: "700",
  },

  filtroTextoAtivo: {
    color: "#FFFFFF",
  },

  mapaCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  mapaIndicador: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EEEBF8",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },

  statusBolinha: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#8971D3",
  },

  mapaIndicadorTexto: {
    color: "#7259B8",
    fontSize: 10,
    fontWeight: "700",
  },

  mapFrameBox: {
    width: "100%",
    height: 430,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EAE6F3",
    marginBottom: 16,
  },

  estadoMapa: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
    gap: 10,
    backgroundColor: "#FFFFFF",
  },

  estadoTitulo: {
    color: "#39334F",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 5,
  },

  estadoDescricao: {
    color: "#89859A",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },

  tentarBotao: {
    backgroundColor: "#7259B8",
    paddingHorizontal: 19,
    paddingVertical: 11,
    borderRadius: 12,
    marginTop: 8,
  },

  tentarTexto: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },

  legendaBotao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ECE8F6",
    padding: 14,
    marginBottom: 12,
  },

  legendaBotaoIcone: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F0EBFF",
    alignItems: "center",
    justifyContent: "center",
  },

  legendaBotaoTexto: {
    flex: 1,
  },

  legendaCard: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ECE8F6",
    padding: 15,
    marginBottom: 14,
  },

  legendaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  legendaPonto: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },

  legendaTexto: {
    color: "#625D75",
    fontSize: 12,
  },

  rodapeTexto: {
    color: "#A09BAD",
    fontSize: 10,
    textAlign: "center",
    marginTop: 12,
  },
});
