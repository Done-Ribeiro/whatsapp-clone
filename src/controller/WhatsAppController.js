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
        this.initContacts();
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

  initContacts() {
    this._user.on('contactschange', docs => {
      this.el.contactsMessagesList.innerHTML = '';// limpa lista
      docs.forEach(doc => {
        let contact = doc.data();
        let div = document.createElement('div');
        div.className = 'contact-item';
        div.innerHTML = `
          <div class="dIyEr">
              <div class="_1WliW" style="height: 49px; width: 49px;">
                  <img src="#" class="Qgzj8 gqwaM photo" style="display:none;">
                  <div class="_3ZW2E">
                      <span data-icon="default-user" class="">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212" width="212" height="212">
                              <path fill="#DFE5E7" d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"></path>
                              <g fill="#FFF">
                                  <path d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"></path>
                              </g>
                          </svg>
                      </span>
                  </div>
              </div>
          </div>
          <div class="_3j7s9">
              <div class="_2FBdJ">
                  <div class="_25Ooe">
                      <span dir="auto" title="${contact.name}" class="_1wjpf">${contact.name}</span>
                  </div>
                  <div class="_3Bxar">
                      <span class="_3T2VG">${contact.lastMessageTime}</span>
                  </div>
              </div>
              <div class="_1AwDx">
                  <div class="_itDl">
                      <span title="digitando…" class="vdXUe _1wjpf typing" style="display:none">digitando…</span>
    
                      <span class="_2_LEW last-message">
                          <div class="_1VfKB">
                              <span data-icon="status-dblcheck" class="">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18">
                                      <path fill="#263238" fill-opacity=".4" d="M17.394 5.035l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-.427-.388a.381.381 0 0 0-.578.038l-.451.576a.497.497 0 0 0 .043.645l1.575 1.51a.38.38 0 0 0 .577-.039l7.483-9.602a.436.436 0 0 0-.076-.609zm-4.892 0l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-2.614-2.556a.435.435 0 0 0-.614.007l-.505.516a.435.435 0 0 0 .007.614l3.887 3.8a.38.38 0 0 0 .577-.039l7.483-9.602a.435.435 0 0 0-.075-.609z"></path>
                                  </svg>
                              </span>
                          </div>
                          <span dir="ltr" class="_1wjpf _3NFp9">${contact.lastMessage}</span>
                          <div class="_3Bxar">
                              <span>
                                  <div class="_15G96">
                                      <span class="OUeyt messages-count-new" style="display:none;">1</span>
                                  </div>
                          </span></div>
                          </span>
                  </div>
              </div>
          </div>
        `;// pra cada contato, cria um elemento
        if (contact.photo) {
          let img = div.querySelector('.photo');
          img.src = contact.photo;
          img.show();
        }
        this.el.contactsMessagesList.appendChild(div);// coloca o elemento na tela
      });
    });
    this._user.getContacts();
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
