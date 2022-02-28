const pdfjsLib = require('pdfjs-dist');
const path = require('path');// para nao ter problema com diretorios vamos incluir a biblioteca nativa path

//! cria um worker (ja vem na lib), que fica rodando de forma assincrona em background
pdfjsLib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../../dist/pdf.worker.bundle.js')//! lembrando que esta pasta '/dist' so existe em tempo de execucao!

export class DocumentPreviewController {
  constructor(file) {
    this._file = file;
  }

  getPreviewData() {
    return new Promise((s, f) => {// s -> solved | f -> failure
      let reader = new FileReader();
      switch (this._file.type) {
        case 'image/png':
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/gif':
          reader.onload = e => {
            s({
              src: reader.result,
              info: this._file.name
            });// aqui escolhemos o que mostrar na resposta
          }
          reader.onerror = e => {
            f(e);
          }
          reader.readAsDataURL(this._file);
          break;
        case 'application/pdf':
          reader.onload = e => {
            pdfjsLib.getDocument(new Uint8Array(reader.result)).then(pdf => {
              /** 
               * * agora precisamos converter os dados de arrayBuffer -> array de 8 bits
               * ! desta forma -> new Uint8Array()
               * ! passando o
               * ! (reader.result) -> conteudo do nosso arquivo que foi convertido em arrayBuffer
               * * que é o maximo que ele consegue ler em tempo real
               * * pq se passar do jeito que está ele não consegue ler..
               * ? a nao ser por URL de um arquivo fisico (já salvo em um servidor)
              */
              pdf.getPage(1).then(page => {//! agora pega a pagina 1
                console.log('page', page);
              }).catch(err => {
                f(err);
              });
            }).catch(err => {
              f(err);
            });
          }
          reader.readAsArrayBuffer(this._file);
          break;
        default:
          f();
      }
    });
  }

}
