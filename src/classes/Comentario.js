
export class Comentario {
    constructor(usuario, texto) {
        if(texto.length > 1000) {
            throw new Error("El comentario no puede ser de mas de 1000 caracteres");
        }
        this.usuario = usuario;
        this.texto = texto;
        this.fecha = Date.now();
    }
}