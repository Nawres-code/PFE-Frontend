import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  /*{
    title: 'RealTime', // 'Temps réel',
    icon: 'home-outline',
    link: '/pages/realtime/energy/dashboard',
    home: true,
    data: 'realTime',
  },*/

  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/realtime/cdc/dashboard',
    home: true,
    data: 'realTime',

  },
  {
    title: 'History',//'Historique',
    icon: 'bar-chart',
    data: 'history',
    children: [
      {
        title: 'Mesure',
        link: '/pages/historical/sensor',
        data: 'sensor',
      },
     /* {
        title: 'Details',
        link: '/pages/historical/details',
        data: 'details',
      }*/
    ]
  },
  {
    title: 'Engineering', // 'PARAMETRAGE',
    icon: 'settings-2-outline',
    data: 'engineering',
    children: [
      {
        title: 'Usine',
        link: '/pages/data-management/zone',
        data: 'usineManagmt',
      },
      {
        title: 'Ligne',
        link: '/pages/data-management/installation',
        data: 'ligneManagmt',
      },
      {
        title: 'Poste',
        link: '/pages/data-management/device',
        data: 'posteManagmt',
      },

      {
        title: 'Mesure',
        link: '/pages/data-management/sensor',
        data: 'mesureManagmt',
      },

      {
        title: 'Aide Visuel',
        link: '/pages/data-management/aideVisuel',
        data: 'aideVisuel',
      },

      {
        title: 'Mode Opératoire',
        link: '/pages/data-management/operatingMode',
        data: 'operatingMode',
      }
    ],
  },

  {
    title: 'Report',//'Rapport',
    icon: 'file-text-outline',
    link: '/pages/report',
    data: 'report',
  },

  {
    title: 'Alerts',//'Alerte',
    icon: 'alert-circle-outline',
    data: 'alerts',
    children: [
      {
        title: 'Alerts management ', //'Gestion des alertes',
        link: '/pages/alerts',
        data: 'alertManagmt',
      },
      {
        title: 'Alerts history', //'Historique des alertes',
        link: '/pages/alerts/history',
        data: 'alertHist',
      },]
  },

  {
    title: 'Disconnection',
    icon: 'log-out-outline',
    link: '/signin',
    queryParams: { 'logout': '' },
    data: 'logout',
  }
];
