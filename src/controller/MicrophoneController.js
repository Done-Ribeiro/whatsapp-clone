import { ClassEvent } from "../util/ClassEvent";

export class MicrophoneController extends ClassEvent {//! extends ClassEvent
  constructor() {
    /** 
     * ! chama o construtor da classe pai
     * ! criando assim agora o _events dentro do this
     * ! e add os metodos { on, trigger} dentro de MicrophoneController
     * ! por causa do construtor extendido (ClassEvent)
     */
    super();

    navigator.mediaDevices.getUserMedia({
      audio: true
    }).then(stream => {
      this._stream = stream;
      let audio = new Audio();
      audio.srcObject = new MediaStream(stream);
      audio.play();
      this.trigger('play', audio);
    }).catch(err => {
      console.error(err);
    });
  }

  stop() {
    this._stream.getTracks().forEach(track => {
      track.stop();
    });
  }

}
