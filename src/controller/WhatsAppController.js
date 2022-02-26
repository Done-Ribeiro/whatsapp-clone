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

    this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(contato => {
      contato.on('click', e => {
        this.el.home.hide();
        // para o painel de cada "conversa" aparecer.. precisamos arrumar o css
        this.el.main.css({
          display: 'flex'
        });
      });
    });

    this.el.btnAttach.on('click', e => {
      //! paramos aqui prograpação.. evitando assim que um evento pai execute o msm evento que o filho sem querer
      e.stopPropagation();

      this.el.menuAttach.addClass('open');
      // quando aberto -> add esse evento pra fechar
      document.addEventListener('click', this.closeMenuAttach.bind(this));//! precisa fazer o bind aqui, para passar a referencia correta para o this do closeMenuAttach()
    });

    this.el.btnAttachPhoto.on('click', e => {
      this.el.inputPhoto.click();
    });

    this.el.inputPhoto.on('change', e => {
      console.log(this.el.inputPhoto.files);
      // files é uma colecao e nao um array.. por isso do spread -> [...]
      [...this.el.inputPhoto.files].forEach(file => {
        console.log(file);
      });
    });

    this.el.btnAttachCamera.on('click', e => {
      this.closeAllMainPanel();// precisamos esconder primeiro os outros paineis
      this.el.panelCamera.addClass('open');
      this.el.panelCamera.css({
        'height': 'calc(100% - 120px)'
      });
    });

    this.el.btnClosePanelCamera.on('click', e => {
      this.closeAllMainPanel();
      this.el.panelMessagesContainer.show();
    });

    this.el.btnTakePicture.on('click', e => {
      console.log('take picture');
    });

    this.el.btnAttachDocument.on('click', e => {
      this.closeAllMainPanel();
      this.el.panelDocumentPreview.addClass('open');
      this.el.panelDocumentPreview.css({
        'height': 'calc(100% - 120px)'
      });
    });

    this.el.btnClosePanelDocumentPreview.on('click', e => {
      this.closeAllMainPanel();
      this.el.panelMessagesContainer.show();
    });

    this.el.btnSendDocument.on('click', e => {
      console.log('send document');
    });

    this.el.btnAttachContact.on('click', e => {
      this.el.modalContacts.show();
    });

    this.el.btnCloseModalContacts.on('click', e => {
      this.el.modalContacts.hide();
    });
  }

  closeAllMainPanel() {
    this.el.panelMessagesContainer.hide();
    this.el.panelDocumentPreview.removeClass('open');
    this.el.panelCamera.removeClass('open');
  }

  // metodo criado para poder desinscrever o evento e nao crashar o app 
  closeMenuAttach(event) {
    // aqui removemos o evento pelo nome da funcao
    document.removeEventListener('click', this.closeMenuAttach);
    this.el.menuAttach.removeClass('open');
  }

  closeAllLeftPanel() {
    this.el.panelEditProfile.hide();
    this.el.panelAddContact.hide();
  }

}
