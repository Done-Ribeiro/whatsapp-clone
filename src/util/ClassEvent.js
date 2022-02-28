export class ClassEvent {// classe para controlar eventos
  constructor() {
    this._events = {};
  }

  on(eventName, fn) {
    if (!this._events[eventName]) this._events[eventName] = new Array();// verificar se esse evento ja existe no obj
    this._events[eventName].push(fn);// add a fn no array de eventos.. exemplo evento play -> { play: [fnA, fnB] }
  }

  trigger() {
    // [...] spread -> pra converter os arguments pra array
    let args = [...arguments];// arguments -> sao todos os argumentos passados

    //* 1 param - vai ser sempre o nome do nosso evento
    let eventName = args.shift();// shift -> remove o primeiro elemento da array e retorna ele

    args.push(new Event(eventName));//? desta forma sempre passamos o nome como ultimo parametro na lista de argumentos

    //* verificar se existem eventos definidos
    if (this._events[eventName] instanceof Array) {// primeiro verifica se é um array, pra poder percorrer ele
      this._events[eventName].forEach(fn => {
        fn.apply(null, args);// fazer com que a funcao "se execute" - aconteça... //! apply -> executa o codigo que colocamos la
      });
    }
  }

}
