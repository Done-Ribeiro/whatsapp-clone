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

}
