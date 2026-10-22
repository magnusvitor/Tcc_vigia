import { StyleSheet } from 'react-native';

export default StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 56,
    borderBottomWidth: 1,
    borderColor: '#f1f2f6',
  },

  badgeId: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#152d63',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  badgeTextId: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
 pageTitleHeader: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.6,
    marginBottom: 4,
  },
  pageSubtitleHeader: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  tabButton: {
    flex: 1,
    height: 38,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  tabButtonActive: {
    backgroundColor: '#152d63',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  tabButtonTextActive: {
    color: '#fff',
  },
  crimeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    boxShadow: '0px 2px 6px rgba(0,0,0,0.01)',
  },
  crimeIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  crimeTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  crimeMeta: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  crimeLocation: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'center',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },


  backButton: {
    padding: 4,
    marginRight: 4,
  },
  badgeIdDetail: {
    width: 38,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#152d63',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  badgeTextIdDetail: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  headerTitlePageDetail: {
    fontSize: 16,
    fontWeight: '900',
    color: '#152d63',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBoxPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleBlock: {
    flex: 1,
  },
  crimeTitleDetail: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  crimeDateDetail: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  statusBadgeDetail: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusBadgeTextDetail: {
    fontSize: 10,
    fontWeight: '800',
  },
  labelSection: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 20,
    marginBottom: 8,
  },
  valueText: {
    fontSize: 14,
    color: '#475569',
  },
  descriptionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  mockImage: {
    width: '100%',
    height: 150,
    borderRadius: 14,
    marginVertical: 4,
  },
  timelineContainer: {
    width: '100%',
    marginTop: 10,
    paddingLeft: 6,
    marginBottom: 50,
  },
  timelineItem: {
    flexDirection: 'row',
    height: 56,
    position: 'relative',
  },
  timelineNode: {
    width: 14,
    height: 14,
    borderRadius: 7,
    zIndex: 2,
    marginTop: 2,
  },
  nodeActive: {
    backgroundColor: '#152d63',
  },
  nodePending: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#cbd5e1',
  },
  timelineLine: {
    position: 'absolute',
    left: 6,
    top: 14,
    width: 2,
    height: 44,
    backgroundColor: '#152d63',
    zIndex: 1,
  },
  timelineContent: {
    marginLeft: 20,
  },
  timelineTime: {
    fontSize: 11,
    color: '#94a3b8',
  },
  timelineStatus: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginTop: 2,
  }
});
