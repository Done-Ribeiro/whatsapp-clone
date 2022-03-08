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

        let audioContext = new AudioContext();//* essa api de audio, pega informacoes do audio
        let reader = new FileReader();
        reader.onload = e => {
          audioContext.decodeAudioData(reader.result).then(decode => {//? decode -> contem metadata's do audio
            let file = new File([blob], filename, {
              type: this._mimeType,
              lastModified: Date.now()
            });
            this.trigger('recorded', file, decode);//? por isso passamos ele na trigger, no lugar do blob
          });
        }
        reader.readAsArrayBuffer(blob);
      });

      this._mediaRecorder.start();
      this.startTimer();
    }
  }

  stopRecorder() {
    if (this.isAvailable()) {
      this._mediaRecorder.stop();// para de gravar
      this.stop();// para de ouvir o microfone
      this.stopTimer();// para a contagem do timer
    }
  }

  startTimer() {
    let start = Date.now();
    this._recordMicrophoneInterval = setInterval(() => {
      //! aqui pegamos o evento do 'recordtimer'.. e passamos o dado
      this.trigger('recordtimer', (Date.now() - start));
    }, 100);
  }

  stopTimer() {
    clearInterval(this._recordMicrophoneInterval);
  }

}
