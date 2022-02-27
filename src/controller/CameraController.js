export class CameraController {
  constructor(videoEl) {
    this._videoEl = videoEl;

    //* permissao do navegador pra acessar a camera
    navigator.mediaDevices.getUserMedia({
      video: true
    }).then(stream => {
      this._stream = stream;//* coloquei dentro do this pra ter acesso de fora
      this._videoEl.srcObject = new MediaStream(stream);//! bugfix - nova forma de obter imagem da camera
      this._videoEl.play();// força a mostrar a imagem (neste caso)
    }).catch(err => {
      console.error(err);
    });
  }

  stop() {
    this._stream.getTracks().forEach(track => {
      track.stop();// para cada faixa da camera (audio, video ...)
    });
  }

  takePicture(mimeType = 'image/png') {// espera uma imagem do tipo png como padrao
    let canvas = document.createElement('canvas');// cria um canvas
    canvas.setAttribute('height', this._videoEl.videoHeight);// seta altura
    canvas.setAttribute('width', this._videoEl.videoWidth);// seta largura
    let context = canvas.getContext('2d')// definindo qual o contexto vamos utilizar o canvas
    context.drawImage(this._videoEl, 0, 0, canvas.width, canvas.height);//* atributos ==> imagem - eixo x - eixo y - largura_final - altura_final

    return canvas.toDataURL(mimeType);// converter canvas em um base64
  }

}
