import { Format } from '../util/Format';
import { CameraController } from './CameraController';
import { MicrophoneController } from './MicrophoneController';
import { DocumentPreviewController } from './DocumentPreviewController';
import { Firebase } from '../util/Firebase';
import { User } from '../model/User';

export class WhatsAppController {
  constructor() {
    this._firebase = new Firebase();
    this.initAuth();
    this.elementsPrototype();
    this.loadElements();
    this.initEvents();
  }

  initAuth() {
    this._firebase.initAuth().then((response) => {
      this._user = new User(response.email);// agora passamos a chave no construtor
      this._user.on('datachange', data => {//! esse data aqui -> é o retorno do toJSON()
        document.querySelector('title').innerHTML = data.name + ' - WhatsApp Clone';
        this.el.inputNamePanelEditProfile.innerHTML = data.name;

        if (data.photo) {
          let photo = this.el.imgPanelEditProfile;
          photo.src = data.photo;
          photo.show();
          this.el.imgDefaultPanelEditProfile.hide();

          let photo2 = this.el.myPhoto.querySelector('img');
          photo2.src = data.photo;
          photo2.show();
        }
      });

      this._user.name = response.displayName;
      this._user.email = response.email;
      this._user.photo = response.photoURL;
      this._user.save().then(() => {
        this.el.appContent.css({
          display: 'flex'
        });
      })

    }).catch(err => {
      console.error(err);
    });
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
      this.el.btnSavePanelEditProfile.disabled = true;
      this._user.name = this.el.inputNamePanelEditProfile.innerHTML;
      this._user.save().then(() => {
        this.el.btnSavePanelEditProfile.disabled = false;
      });
    });

    this.el.formPanelAddContact.on('submit', e => {
      e.preventDefault();// pra nao dar refresh na tela
      // FormData -> trata os campos e recupera automaticamente com base no name
      let formData = new FormData(this.el.formPanelAddContact);
      //! Add contato
      let contact = new User(formData.get('email'));// cria um novo User com o email que passamos no formulario do contato
      contact.on('datachange', data => {
        if (data.name) {// se tiver um nome, por ex. é pq achou um usuario
          this._user.addContact(contact).then(() => {
            this.el.btnClosePanelAddContact.click();// forca um clica no botao fechar, quando salvar
            console.log('Contato foi adicionado!');
          });
        } else {
          console.error('Usuário não foi encontrado.');
        }
      });// uma vez que os dados forem carregados
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

      /**
      * * solicitamos agora o CameraController
      * * passando o elemento que sera renderizado (videoCamera)
      */
      this._camera = new CameraController(this.el.videoCamera);
    });

    this.el.btnClosePanelCamera.on('click', e => {
      this.closeAllMainPanel();
      this.el.panelMessagesContainer.show();
      this._camera.stop();//! para a camera
    });

    this.el.btnTakePicture.on('click', e => {
      let dataUrl = this._camera.takePicture();//* aqui vamos receber o base64 vindo do CameraController
      this.el.pictureCamera.src = dataUrl;// atribui ao elemento que estava escondido
      this.el.pictureCamera.show();// mostra o pictureCamera
      this.el.videoCamera.hide();// oculta o videoCamera
      this.el.btnReshootPanelCamera.show();// mostra botao para tirar outra foto
      this.el.containerTakePicture.hide();// depois que tirou a foto oculta o btn
      this.el.containerSendPicture.show();// agora habilita btn para enviar a foto
    });

    this.el.btnReshootPanelCamera.on('click', e => {
      this.el.pictureCamera.hide();
      this.el.videoCamera.show();
      this.el.btnReshootPanelCamera.hide();
      this.el.containerTakePicture.show();
      this.el.containerSendPicture.hide();
    });

    this.el.btnSendPicture.on('click', e => {
      console.log(this.el.pictureCamera.src);
    });

    this.el.btnAttachDocument.on('click', e => {
      this.closeAllMainPanel();
      this.el.panelDocumentPreview.addClass('open');
      this.el.panelDocumentPreview.css({
        'height': 'calc(100% - 120px)'
      });
      this.el.inputDocument.click();
    });

    this.el.inputDocument.on('change', e => {
      if (this.el.inputDocument.files.length) {
        this.el.panelDocumentPreview.css({//!!! hack pra resolver problema da altura do preview do pdf
          'height': '1%'
        });
        let file = this.el.inputDocument.files[0];// pega so o primeiro arquivo
        this._documentPreviewController = new DocumentPreviewController(file);
        this._documentPreviewController.getPreviewData().then(result => {
          this.el.imgPanelDocumentPreview.src = result.src;// aqui carrega a pre-visualizacao
          this.el.infoPanelDocumentPreview.innerHTML = result.info// troca o info de paginas (pdf) para o nome de arquivo
          this.el.imagePanelDocumentPreview.show();// aqui mostra no painel
          this.el.filePanelDocumentPreview.hide();
          this.el.panelDocumentPreview.css({//!!! hack pra resolver problema da altura do preview do pdf
            'height': 'calc(100% - 120px)'
          });
        }).catch(err => {
          this.el.panelDocumentPreview.css({//!!! hack pra resolver problema da altura do preview do pdf
            'height': 'calc(100% - 120px)'
          });
          switch (file.type) {
            // word
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            case 'application/msword':
              this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-doc';
              break;

            // excel
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            case 'application/vnd.ms-excel':
              this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-xls';
              break;

            // powerpoint
            case 'application/vnd.ms-powerpoint':
            case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
              this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-ppt';
              break;

            default:
              this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-generic';
          }

          this.el.filenamePanelDocumentPreview.innerHTML = file.name;// coloca nome do arquivo
          this.el.imagePanelDocumentPreview.hide();
          this.el.filePanelDocumentPreview.show();

        });
      }
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

    this.el.btnSendMicrophone.on('click', e => {
      this.el.recordMicrophone.show();
      this.el.btnSendMicrophone.hide();

      this._microphoneController = new MicrophoneController();
      this._microphoneController.on('ready', audio => {//! quando estiver disponivel pra ser gravado, começa a gravar
        console.log('ready event');
        this._microphoneController.startRecorder();
      });
      this._microphoneController.on('recordtimer', timer => {//? evento para ouvir o timer, enquanto o record ta acontecendo
        this.el.recordMicrophoneTimer.innerHTML = Format.toTime(timer);//* aqui formata e coloca na vizualizacao
      });
    });

    this.el.btnCancelMicrophone.on('click', e => {
      this._microphoneController.stopRecorder();
      this.closeRecordMicrophone();
    });

    this.el.btnFinishMicrophone.on('click', e => {
      this._microphoneController.stopRecorder();
      this.closeRecordMicrophone();
    });

    this.el.inputText.on('keypress', e => {
      if (e.key === 'Enter' && !e.ctrlKey) {
        e.preventDefault();
        this.el.btnSend.click();
      }
    });

    this.el.inputText.on('keyup', e => {
      if (this.el.inputText.innerHTML.length > 0) {
        this.el.inputPlaceholder.hide();

        //* trocar botao do microfone pelo de enviar
        this.el.btnSendMicrophone.hide();
        this.el.btnSend.show();

      } else {
        this.el.inputPlaceholder.show();
        this.el.btnSendMicrophone.show();
        this.el.btnSend.hide();
      }
    });

    this.el.btnSend.on('click', e => {
      console.log(this.el.inputText.innerHTML);
    });

    this.el.btnEmojis.on('click', e => {
      this.el.panelEmojis.toggleClass('open');
    });

    //* selecionando todos os emojis e add evento click
    this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji => {
      emoji.on('click', e => {
        //* cloneNode -> clona o emoji, caso contrario ele moveria.. e precisamos de uma copia
        let img = this.el.imgEmojiDefault.cloneNode();
        // clone propriedades
        img.style.cssText = emoji.style.cssText;
        img.dataset.unicode = emoji.dataset.unicode;
        img.alt = emoji.dataset.unicode;
        // clone css
        emoji.classList.forEach(name => {
          img.classList.add(name);
        });

        let cursor = window.getSelection();
        // força o focus
        if (!cursor.focusNode || !cursor.focusNode.id == 'input-text') {
          this.el.inputText.focus();
          // aqui temos certeza que estamos dentro do input-text "Digite uma mensagem"
          cursor = window.getSelection();
        }

        //* trocando caracteres por emojis
        let range = document.createRange();// cria um range de caracteres
        range = cursor.getRangeAt(0);// pega o range na primeira posicao (0)
        range.deleteContents();// quando clicar no emoji -> remove os caracteres do range
        let frag = document.createDocumentFragment();// cria um fragmento -> documento em paralelo
        frag.appendChild(img);// add o clone dentro do "novo documento"
        range.insertNode(frag);// add o fragmento no range escolhido
        range.setStartAfter(img);// empurra o cursor pro final do emoji (para nao substitui-lo)

        //! dispatchEvent -> força um evento, nesse caso para sumir com o placeholder ao clicar no emoji
        this.el.inputText.dispatchEvent(new Event('keyup'));
      });
    });
  }

  closeRecordMicrophone() {
    this.el.recordMicrophone.hide();
    this.el.btnSendMicrophone.show();
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
