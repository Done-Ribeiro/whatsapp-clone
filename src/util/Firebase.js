import { initializeApp } from "firebase/app";

export class Firebase {
  constructor() {
    this._config = {
      apiKey: "",
      authDomain: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: ""
    }

    this.init();
  }

  init() {
    //! nao podemos ter 2 aplicacoes do firebase rodando em simultaneo
    //! pois isso da verificacao abaixo

    if (!this._initialized) {// verifica se nao tem uma aplicacao rodando
      console.log(new Secret());
      initializeApp(this._config);// inicializa a aplicacao
      this._initialized = true;// avisa que tem uma aplicacao em execucao agora
    }
  }

  static db() {
    return firebase.firestore();
  }

  static hd() {
    return firebase.storage();
  }

}
