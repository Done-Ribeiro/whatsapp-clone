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
      switch (this._file.type) {
        case 'image/png':
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/gif':
          let reader = new FileReader();
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
          break;
        default:
          f();
      }
    });
  }

}
