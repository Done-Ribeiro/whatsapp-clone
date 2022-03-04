import { Firebase } from "../util/Firebase";
import { Model } from "./Model";

export class User extends Model {
  constructor(id) {//! aqui na verdade recebemos o email -> que chamamos de 'id'
    super();//! aqui executa o super -> que passa no construtor de model primeiro, e agora tem acesso ao atb this._data
    if (id) this.getById(id);//? passou alguma coisa no id? "sim", passou o email.. entao chama o getById passando o email
  }

  get name() { return this._data.name; }
  set name(value) { this._data.name = value; }

  get email() { return this._data.email; }
  set email(value) { this._data.email = value; }

  get photo() { return this._data.photo; }
  set photo(value) { this._data.photo = value; }

  get chatId() { return this._data.chatId; }
  set chatId(value) { this._data.chatId = value; }

  getById(id) {
    //! problema de retornar uma promise (then) -> ele busca uma vez so, ele n fica ouvindo... vamos trocar para um LISTENER
    return new Promise((s, f) => {
      User.findByEmail(id).onSnapshot(doc => {//! onSnapshot
        this.fromJSON(doc.data());
        s(doc);
      });
    });
  }

  save() {
    return User.findByEmail(this.email).set(this.toJSON());
  }

  static getRef() {
    return Firebase.db().collection('users');
  }

  static getContactsRef(id) {
    return User.getRef()
      .doc(id)
      .collection('contacts');
  }

  static findByEmail(email) {
    return User.getRef().doc(email);
  }

  addContact(contact) {
    //! btoa -> funcao para converter | string nativa [por causa de ,.@ etc] para base64
    return User.getContactsRef(this.email)
      .doc(btoa(contact.email))// procura na nova colection pelo email passado
      .set(contact.toJSON());// por fim manda salvar o contato
  }

  getContacts(filter = '') {//* agora podemos ou nao receber um filtro, que por padrao é vazio
    return new Promise((s, f) => {
      //! obs.: operador ('>=') nao esta funcionando como esperado
      User.getContactsRef(this.email).where('name', '>=', filter).onSnapshot(docs => {//? para filtrar, adicionamos o .where, passando 3 parametros (campo_filtrar | operador | valor_passado)
        let contacts = [];
        docs.forEach(doc => {
          let data = doc.data();
          data.id = doc.id;
          contacts.push(data);
        });
        this.trigger('contactschange', docs);
        s(contacts);
      });
    });
  }

}
