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
                let viewport = page.getViewport(1);// pega o espaco de visualizacao desta pagina

                // CANVAS
                let canvas = document.createElement('canvas');
                let canvasContext = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                page.render({//! metodo que vai gerar o preview
                  canvasContext, // ele espera que passemos o contexto do nosso canvas
                  viewport // e quem e o viewPort
                }).then(() => {
                  let _s = (pdf.numPages > 1) ? 's' : '';
                  s({
                    src: canvas.toDataURL('image/png'), // agora vamos "exportar" como imagem final do tipo png
                    info: `${pdf.numPages} página${_s}` // aqui vai ficar escrito aqui a quantidade de paginas
                  });// agora vamos montar a resposta
                }).catch(err => {
                  f(err);
                });
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
