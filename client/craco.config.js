const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@table-bg': 'rgba(0,0,0,0)',
                '@table-border-color': 'rgba(0,0,0,0)',
                '@table-header-bg':'#76bddc',
                '@table-header-color':'#FFFFFF',
                '@font-size-base':'30px'
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};