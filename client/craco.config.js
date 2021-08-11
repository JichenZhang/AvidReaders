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
                '@select-background':'rgba(0,0,0,0)',
                '@select-border-color': 'rgba(0,0,0,0)',
                '@table-header-bg':'#76bddc',
                '@table-header-color':'#FFFFFF',
                '@font-size-base':'30px',
                '@select-dropdown-height':'50px',
                '@select-single-item-height':'50px',
                '@select-multiple-item-height-lg': '50px',
                '@heading-color':'#FFFFFF',
                '@item-hover-bg':'#76bddc'
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};