const path = require('path')
module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  outputDir: path.resolve(__dirname, '../dist'),
  devServer: {
    host: '0.0.0.0',
    port: 8082,
  }
}
