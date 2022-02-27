class CameraController {
  constructor(videoEl) {
    this._videoEl = videoEl;

    //* permissao do navegador pra acessar a camera
    navigator.mediaDevices.getUserMedia({
      video: true
    }).then(stream => {
      this._videoEl.srcObject = new MediaStream(stream);//! bugfix - nova forma de obter imagem da camera
      this._videoEl.play();// força a mostrar a imagem (neste caso)
    }).catch(err => {
      console.error(err);
    });
  }

}
