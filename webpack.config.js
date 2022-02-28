const path = require('path');//* modulo nativo do node para ajudar a encontrar pastas

module.exports = {
  entry: {
    app: './src/app.js',
    'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry.js' // aqui agora é o caminho real do worker
  },// agora temos concorrencia -> (1º - a aplicacao | 2º - um worker para pre-vizualizar pdf) executando ao mesmo tempo
  output: {
    /**
     * ! [name] -> é um coringa, que usamos agora para dar saida aos 2 processos em execução.
     * ! Ira gerar 2 arquivos na memoria.. neste caso { app.bundle, pdf.worker.bundle }
     */
    filename: '[name].bundle.js',
    /** 
     * ! join() -> como sao 2 bundles agora precisamos uni-los..
     * ! e trocamos '/dist' -> 'dist'
     */
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist'
  }
}
