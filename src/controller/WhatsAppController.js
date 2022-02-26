class WhatsAppController {
  constructor() {
    this.elementsPrototype();
    this.loadElements();
    this.initEvents();
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

    // retorna um novo form
    // ex.: app.el.formPanelAddContact.getForm().get('email')
    HTMLFormElement.prototype.getForm = function () {
      return new FormData(this);
    }

    // retorna o msm form so que em JSON
    // ex.: app.el.formPanelAddContact.toJSON()
    HTMLFormElement.prototype.toJSON = function () {
      let json = {};
      this.getForm().forEach((value, key) => {
        json[key] = value;
      });
      return json;
    }
  }

  initEvents() {
    // PROFILE
    this.el.myPhoto.on('click', e => {
      this.closeAllLeftPanel();
      this.el.panelEditProfile.show();
      setTimeout(() => {// hack para funcionar corretamente transition do css
        this.el.panelEditProfile.addClass('open');
      }, 300);
    });

    this.el.btnClosePanelEditProfile.on('click', e => {
      this.el.panelEditProfile.removeClass('open');
    });

    // CONTACT
    this.el.btnNewContact.on('click', e => {
      this.closeAllLeftPanel();
      this.el.panelAddContact.show();
      setTimeout(() => {// hack para funcionar corretamente transition do css
        this.el.panelAddContact.addClass('open');
      }, 300);
    });

    this.el.btnClosePanelAddContact.on('click', e => {
      this.el.panelAddContact.removeClass('open');
    });

    this.el.photoContainerEditProfile.on('click', e => {
      this.el.inputProfilePhoto.click();
    });

    // campo -> seu nome (dentro de Perfil)
    this.el.inputNamePanelEditProfile.on('keypress', e => {
      if (e.key === 'Enter') {
        e.preventDefault();// evita quebra de linhas (nesse caso)
        this.el.btnSavePanelEditProfile.click();
      }
    });

    this.el.btnSavePanelEditProfile.on('click', e => {
      console.log(this.el.inputNamePanelEditProfile.innerHTML);
    });

    this.el.formPanelAddContact.on('submit', e => {
      e.preventDefault();// pra nao dar refresh na tela
      // FormData -> trata os campos e recupera automaticamente com base no name
      let formData = new FormData(this.el.formPanelAddContact);
    });
  }

  closeAllLeftPanel() {
    this.el.panelEditProfile.hide();
    this.el.panelAddContact.hide();
  }

}
