class WhatsAppController {
  constructor() {
    this.elementsPrototype();
    this.loadElements();
  }

  loadElements() {
    this.el = {};
    document.querySelectorAll('[id]').forEach(element => {
      this.el[Format.getCamelCase(element.id)] = element;
    });
  }

  elementsPrototype() {

    /**
    * precisamos retornar o app -> this
    * para poder criarmos uma sequencia de chamadas se for preciso
    * por isso dos -> return this
    */
    Element.prototype.hide = function () {/** criando com function e nao com ()=>
                                           * pra amarra ao escopo do metodo */
      this.style.display = 'none';// this -> elemento que foi invocado o hide()
      return this;
    }

    Element.prototype.show = function () {
      this.style.display = 'block';
      return this;
    }

    Element.prototype.toggle = function () {
      this.style.display = (this.style.display === 'none') ? 'block' : 'none';
      return this;
    }

    /**
     * metodo para add eventos
     * ex.: app.el.btnNewContact.on('click mouseover dblclick', (e)=> console.log('clicou', e.type))
    */
    Element.prototype.on = function (events, fn) {
      events.split(' ').forEach(event => {
        // esse this é o da function -> que faz ref ao escopo do prototype
        this.addEventListener(event, fn);
      });
      return this;
    }

    // ex.: app.el.app.css({width: '50%', height: '50%'})
    Element.prototype.css = function (styles) {
      for (let name in styles) {
        this.style[name] = styles[name];
      }
      return this;
    }

    Element.prototype.addClass = function (name) {
      this.classList.add(name);
      return this;
    }

    Element.prototype.removeClass = function (name) {
      this.classList.remove(name);
      return this;
    }

    Element.prototype.toggleClass = function (name) {
      this.classList.toggle(name);
      return this;
    }

    Element.prototype.hasClass = function (name) {
      return this.classList.contains(name);
    }
  }

}
