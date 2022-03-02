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

  static findByEmail(email) {
    return User.getRef().doc(email);
  }

}
