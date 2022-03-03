import { Firebase } from "../util/Firebase";
import { Model } from "./Model";

export class Chat extends Model {
  constructor() {
    super();
  }

  get users() { this._data.users; }
  set users(value) { this._data.users = value; }

  get timeStamp() { this._data.timeStamp; }
  set timeStamp(value) { this._data.timeStamp = value; }

  static getRef() {
    return Firebase.db().collection('chats');
  }

  static create(meEmail, contactEmail) {
    return new Promise((s, f) => {
      let users = {};
      users[btoa(meEmail)] = true;
      users[btoa(contactEmail)] = true;

      Chat.getRef().add({//? o add, adiciona o 'id' automaticamente na colecao
        users,//? objeto, com a chave com email em base64, com value true, dos 2 emails
        timeStamp: new Date()
      }).then(doc => {// nao é o documento inteiro, ele so tem o id
        Chat.getRef().doc(doc.id).get().then(chat => {// por isso precisamos bucar o doc inteiro dentro do banco
          s(chat);
        }).catch(err => { f(err) });
      }).catch(err => { f(err) });
    });
  }

  static find(meEmail, contactEmail) {
    /**
     * * (btoa(meEmail), '==', true) -> porque o email no firebase esta em base64, e o valor eh true
     * * get() -> se encontrar, retorna ele -> get, retorna uma promise 
     */
    return Chat.getRef().where(`users.${btoa(meEmail)}`, '==', true).where(`users.${btoa(contactEmail)}`, '==', true).get();
  }

  static createIfNotExists(meEmail, contactEmail) {
    return new Promise((s, f) => {
      //* metodo pra procurar se existe a conversa, entre esses 2 emails
      Chat.find(meEmail, contactEmail).then(chats => {
        if (chats.empty) {//? empty -> propriedade do firebase, verifica se a lista eh vazia ou nao
          // Create
          Chat.create(meEmail, contactEmail).then(chat => {
            s(chat);
          });
        } else {
          chats.forEach(chat => {
            s(chat);
          });
        }
      }).catch(err => { f(err) });
    });
  }

}
