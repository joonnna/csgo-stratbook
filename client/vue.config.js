const path = require('path');

module.exports = {
  publicPath: '/',
  outputDir: path.resolve(__dirname, '../server/dist_app'),
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/styles/index.scss";`,
      },
    },
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: 'CSGO-Stratbook',
        appId: 'CSGO.Stratbook',
        win: {
          target: 'portable',
          publisherName: 'Hiller',
          icon: './icon.png',
        },
        portable: {
          artifactName: 'CSGO-Stratbook.exe',
        },
        directories: {
          output: 'dist_electron/release',
        },
        protocols: {
          name: 'csgostratbook-protocol',
          schemes: ['csgostratbook'],
        },
      },
    },
  },
};
