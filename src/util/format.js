export class Format {
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

  static toTime(duration) {
    let seconds = parseInt((duration / 1000) % 60);
    let minutes = parseInt((duration / (1000 * 60)) % 60);
    let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    if (hours > 0) {
      // padStart(2, '0') --> converte 2 casas caso o valor seja menor
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

  }

}
