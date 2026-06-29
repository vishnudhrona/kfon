export const ONBOARDING_ROUTES = {
  ON_BOARD_LNPS: { label: 'menu.partners', icon: 'OnboardingPartnerMenuIcon' },
  PARTNERS_LIST: {
    label: 'menu.partnerRequests',
    path: '/app/partners/list',
    icon: 'PartnerListChildIcon'
  },
  CREATE_NEW_PARTNER: {
    label: 'menu.createNewPartner',
    path: '',
    icon: ''
  },
  LNP_PARTNER_PREVIEW: {
    label: 'menu.lnpPartnerDetails',
    path: '/app/partners/list/lnp/$id',
    icon: ''
  },
  AGNP_PARTNER_PREVIEW: {
    label: 'menu.agnpPartnerDetails',
    path: '/app/partners/list/agnp/$id',
    icon: ''
  },
  VLAN_ASSOCIATION: {
    label: 'menu.lnpVlanAssociation',
    path: '/app/partners/vlan-association',
    icon: 'VlanAssociationChildIcon'
  },
  VLAN_REQUEST: {
    label: 'menu.vlanRequest',
    path: '/app/partners/vlan-request',
    icon: ''
  }
};
