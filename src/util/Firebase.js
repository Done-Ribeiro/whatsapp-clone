import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
const firebase = require('firebase/app');
require('firebase/firestore');

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
      firebase.initializeApp(this._config);// inicializa a aplicacao
      // firebase.firestore().settings({
      //   timestampsInSnapshots: true
      // });
      this._initialized = true;// avisa que tem uma aplicacao em execucao agora
    }
  }

  static db() {
    return firebase.firestore();
  }

  static hd() {
    return firebase.storage();
  }

  initAuth() {
    return new Promise((s, f) => {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
          s({
            user,
            token
          });
        })
        .catch(err => {
          f(err);
        });
    });
  }

}
