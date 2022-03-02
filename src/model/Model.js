import { ClassEvent } from "../util/ClassEvent";

export class Model extends ClassEvent {
  constructor() {
    super();//! aqui executa o super -> que passa no construtor de classEvent, e agora tem acesso ao atb this._events
    this._data = {};
  }

  fromJSON(json) {
    this._data = Object.assign(this._data, json);
    this.trigger('datachange', this.toJSON());
  }

  toJSON() {
    return this._data;
  }

}
