class CameraController {
  constructor(videoEl) {
    this._videoEl = videoEl;

    //* permissao do navegador pra acessar a camera
    navigator.mediaDevices.getUserMedia({
      video: true
    }).then(stream => {
      /**
       * ? stream é usado para videos, porem no nosso caso se trata de uma imagem
       * ? por isso precisamos criar uma URL para converte-lo em um arquivo de formato binario
       */
      this._videoEl.src = URL.createObjectURL(stream);// cria arquivo no formato binario (file ou blob)
      this._videoEl.play();// força a mostrar a imagem (neste caso)

    }).catch(err => {
      console.error(err);
    });
  }

}
