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
