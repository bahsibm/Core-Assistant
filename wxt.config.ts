import { defineConfig } from 'wxt';

export default defineConfig({
  vite: () => ({
    build: {
      // İçerik betiği (izole dünya) ile popup (ana dünya) arasında ortak modül
      // preload'u "cross-world resource mismatch" uyarısına yol açıyor; kapatıyoruz.
      modulePreload: false,
    },
  }),
  manifest: {
    name: 'Core Assistant',
    description:
      'Sekme gruplama, oturum yönetimi, okuma modu, odaklanma kalkanı ve daha fazlası.',
    version: '0.1.0',
    // İzinler özellik ekledikçe büyür. Şimdilik yalnızca "Akıllı Sekme Gruplama" için.
    permissions: [
      'tabs', 'tabGroups', 'storage', 'alarms', 'browsingData', 'webNavigation', 
      'contextMenus', 'downloads', 'management', 'theme', 
      'declarativeNetRequest', 'declarativeNetRequestWithHostAccess'
    ],
    host_permissions: ['<all_urls>'],
    declarative_net_request: {
      rule_resources: [
        {
          id: 'core-adblock',
          enabled: false,
          path: 'rules/adblock.json'
        }
      ]
    },
    icons: {
      '16': 'icon-16.png',
      '32': 'icon-32.png',
      '48': 'icon-48.png',
      '128': 'icon-128.png',
    },
    action: {
      default_title: 'Core Assistant',
      default_icon: {
        '16': 'icon-16.png',
        '32': 'icon-32.png',
        '48': 'icon-48.png',
        '128': 'icon-128.png',
      },
    },
    browser_specific_settings: {
      gecko: {
        id: "core@assistant.com",
        strict_min_version: "109.0"
      }
    },
  },
});
