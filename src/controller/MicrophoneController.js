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

    this._mimeType = 'audio/webm';// extensao padrao de audio (criado pelo google)
    this._available = false;// variavel para armazenar a resposta do usuario (permitir microfone)

    navigator.mediaDevices.getUserMedia({
      audio: true
    }).then(stream => {
      this._available = true;//* aqui o usuario permitiu o microfone
      this._stream = stream;
      this.trigger('ready', this._stream);// aqui avisa que esta pronto, e manda ate o strem que gerou
    }).catch(err => {
      console.error(err);
    });
  }

  isAvailable() {
    return this._available;
  }

  stop() {
    this._stream.getTracks().forEach(track => {
      track.stop();
    });
  }

  startRecorder() {
    if (this.isAvailable()) {
      /**
       * codigo para testar formatos suportador pelo navegador
       * ex.: MediaRecorder.isTypeSupported('audio/mp3') -> return false
      */
      this._mediaRecorder = new MediaRecorder(this._stream, {
        mimeType: this._mimeType
      });/** @primeiro_param nomeArquivo | @segundo_param extensaoArquivo */
      //! ele nao grava tudo direto, ele grava trechos de audio.. entao vamos gravar num array e dps juntar
      this._recordedChunks = [];
      //! agora vamos criar um evento, pra ir liberando estes dados
      this._mediaRecorder.addEventListener('dataavailable', e => {
        //* se tiver alguma coisa gravada, colocamos no array
        if (e.data.size > 0) this._recordedChunks.push(e.data);
      });
      //? nao tem um metodo que de todos os audios gravados.. mas tem um evento que avisa quando a gravação parar
      this._mediaRecorder.addEventListener('stop', e => {
        //* agora precisamos transforma os pedaços de audio em um unico arquivo
        let blob = new Blob(this._recordedChunks, {
          type: this._mimeType
        });
        let filename = `rec${Date.now()}.webm`;
        let file = new File([blob], filename, {
          type: this._mimeType,
          lastModified: Date.now()
        });
        console.log('file', file);

        // TESTANDO - OUVIR AUDIO
        let reader = new FileReader();
        reader.onload = e => {
          console.log('reader file', file);
          let audio = new Audio(reader.result);
          audio.play();
        }
        reader.readAsDataURL(file);
      });
      this._mediaRecorder.start();//! startar a gravacao -> Recorder
    }
  }

  stopRecorder() {
    if (this.isAvailable()) {
      this._mediaRecorder.stop();// para de gravar
      this.stop();// para de ouvir o microfone
    }
  }

}
