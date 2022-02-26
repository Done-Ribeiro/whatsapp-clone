class Format {
  static getCamelCase(text) {
    /**
     * criar uma div so pra gerar o dataset
     * para depois recuperarmos com o js
    */
    let div = document.createElement('div');
    div.innerHTML = `<div data-${text}="id"></div>`;

    /**
     * Object.keys -> transforma o dataset em camelCase
     * agora vamos retornar o primeiro filho da div
     * e colocar no "id"
    */
    return Object.keys(div.firstChild.dataset)[0];
    
  }

}
