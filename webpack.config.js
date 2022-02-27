const path = require('path');//* modulo nativo do node para ajudar a encontrar pastas

module.exports = {
  entry: './src/app.js',// arquivo de entrada
  output: {
    filename: 'bundle.js',// este arquivo só ira existir em tempo de execução (memoria)
    path: path.resolve(__dirname, '/dist'),// __dirname -> a partir da pasta fisica que ele esta, tras pra mim agora o /dist
    publicPath: 'dist'
  }
}
