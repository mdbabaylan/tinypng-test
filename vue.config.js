const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '/shrink': {
        target: 'https://api.tinify.com',
        changeOrigin: true,
        pathRewrite: { '^/shrink': '/shrink' },
        secure: false,
        headers: {
          Authorization: `Basic ${Buffer.from('api:DrfWrkcr0pPnR20dQ5pDq8q7Tys1Gf1H').toString('base64')}`,
        }
      },
      '/output': {
        target: 'https://api.tinify.com',
        changeOrigin: true,
        // pathRewrite: { '^/output': '/output' },
        secure: false,
        headers: {
          Authorization: `Basic ${Buffer.from('api:DrfWrkcr0pPnR20dQ5pDq8q7Tys1Gf1H').toString('base64')}`,
        }
      },  
    }
  }
})