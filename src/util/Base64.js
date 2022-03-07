export class Base64 {
  static getMimeType(urlBase64) {
    let regex = /^data:(.+);base64,(.*)$/;
    let result = urlBase64.match(regex);
    return result[1];
  }

  static toFile(urlBase64) {
    let mimeType = Base64.getMimeType(urlBase64);
    let ext = mimeType.split('/')[1];// extensao -> ex.: png
    let filename = `file${Date.now()}.${ext}`;

    /**
     * !  agora precisamos retornar uma promessa (pq nao precisamos de um preview)
     * * e quem vai tratar essa ultima promessa, sera quem recebe esse return
     */
    return fetch(urlBase64)
      .then(res => { return res.arrayBuffer(); })
      .then(buffer => { return new File([buffer], filename, { type: mimeType }); });
  }

}
