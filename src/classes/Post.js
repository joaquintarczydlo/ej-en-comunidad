
export class Post {
    constructor(titulo, cuerpo, idUsuario, fecha) {
        if(cuerpo.length > 3000){
            throw new Error("El cuerpo del post es demasiado largo");
        }

        this.id = null;
        this.idUsuario = idUsuario;
        this.titulo = titulo;
        this.cuerpo = cuerpo;
        this.fecha = fecha;
        this.likes = [];
        this.comentarios = [];
    }

    guardarLike(like) {
        this.likes.push(like);
    }

    obtenerLikes() {
        return this.likes;
    }
    
    guardarComentario(comentario) {
        this.comentarios.push(comentario);
    }

    obtenerComentarios() {
        return this.comentarios;
    }
}