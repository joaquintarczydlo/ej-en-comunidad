import { UserRepository } from '../repositories/UserRepository.js';
import { SolicitudesRepository } from '../repositories/SolicitudesRepository.js';
import { PostRepository } from '../repositories/PostRepository.js';
import { Usuario } from '../classes/Usuario.js';
import { SolicitudAmistad } from '../classes/SolicitudAmistad.js';
import { Post } from '../classes/Post.js';
import { Like } from '../classes/Like.js';
import { Comentario } from '../classes/Comentario.js';

const userRepository = new UserRepository();
const solicitudRepository = new SolicitudesRepository();
const postRepository = new PostRepository();

const users = userRepository.obtenerUsuarios();
const posts = postRepository.obtenerPosts();

export class UserService {
    
    mailDisponible(email) {
        const usersConMail = users.filter((user) => user.email == email);
        return usersConMail.length == 0;
    }

    guardarUsuario(userJson){
        const user = new Usuario(userJson.nombre, userJson.apellido, userJson.email, userJson.fechaNac, userJson.biografia, userJson.provincia, userJson.localidad);

        if(this.mailDisponible(user.email)){
            userRepository.guardarUsuario(user);
        }else{
            throw new Error("El mail ya esta ocupado");
        }
    }

    obtenerUsuarioPorId(id){
         const userSegunId = users.filter((user) => user.id == id);

        if(userSegunId.length == 0) {
            throw new Error("El usuario con este ID no existe");
        }

        return userSegunId[0];
    }

    actualizarUsuario(id, userData) {  //PROBAR SI VA
        if ('email' in userData) {
            if (!this.mailDisponible(userData.email)) {
                throw new Error("El mail ya está ocupado por otro usuario");
            }
        }
        if ('biografia' in userData) {
            if (userData.biografia.length > 500) {
                throw new Error("La biografía no puede tener más de 500 caracteres");
            }
        }

        const userExistente = this.obtenerUsuarioPorId(id);
        userRepository.actualizarUsuario(userExistente, userData);

        return userExistente;
    }

    agregarLosGustosMusicales(id, gustosMusicales) {
        const user = this.obtenerUsuarioPorId(id);
        user.agregarGustosMusicales(gustosMusicales);
    }

    obtenerUsuariosPorMusica(genero){
        return users.reduce((cantUsers, user) => user.gustosMusicales.includes(genero) ? cantUsers + 1 : cantUsers , 0);
    }

    obtenerUsuariosPorProvincia(provincia){
        return users.reduce((cantUsers, user) => user.provincia == provincia ? cantUsers + 1 : cantUsers , 0);
    }

    obtenerUsuariosPorLocalidad(localidad){
        return users.reduce((cantUsers, user) => user.localidad == localidad ? cantUsers + 1 : cantUsers , 0);
    }

    obtenerUsuariosPorEdad(edad){
        return users.reduce((cantUsers, user) => user.calcularEdad() > edad ? cantUsers + 1 : cantUsers , 0);
    }

    registrarSolicitud(solicitud) {
        if(solicitud.idReceptor === solicitud.idEmisor){
            throw new Error("Un usuario no puede hacerse amigo de si mismo");
        }

        const nuevaSolicitud = new SolicitudAmistad(solicitud.idEmisor, solicitud.idReceptor);
        solicitudRepository.guardarSolicitud(nuevaSolicitud);
    }

    actualizarSolicitud(id, respuestaSolicitud) {
        const solicitud = solicitudRepository.obtenerSolicitudes().find((solicitud) => solicitud.id == id);

        if (solicitud === -1) {
            throw new Error("La solicitud con este ID no existe");
        }

        solicitud.estado = respuestaSolicitud;

        if(!solicitud.estado){
            throw new Error("Solicitud rechazada");
        }
    }

    obtenerAmigos(id) {
        const solicitudesUsuario = solicitudRepository.obtenerSolicitudesAceptadas(id);
        const amigos = [];

        solicitudesUsuario.forEach(solicitud => {
            if(solicitud.idReceptor != id) {
                amigos.push(solicitud.idReceptor);
            } else {
                amigos.push(solicitud.idEmisor)
            }
        });

        if(amigos.length > 0) {
            return amigos;
        } else {
            throw new Error("Este usuario no tiene amigos");
        }
    }

    obtenerAmigosPendientes(id) {
        const solicitudesUsuario = solicitudRepository.obtenerSolicitudesEnviadas(id);
        const pendientes = [];

        solicitudesUsuario.forEach(solicitud => {
            pendientes.push(solicitud.idReceptor);
        });

        if(pendientes.length > 0) {
            return pendientes;
        } else {
            throw new Error("Este usuario no tiene solicitudes pendientes");
        }
    }

    obtenerSolicitudesAmistad(id) {
        const solicitudesUsuario = solicitudRepository.obtenerSolicitudesRecibidas(id);
        const solicitudesEnviadas = [];

        solicitudesUsuario.forEach(solicitud => {
            solicitudesEnviadas.push(solicitud.idEmisor);
        });

        if(solicitudesEnviadas.length > 0) {
            return solicitudesEnviadas;
        } else {
            throw new Error("Este usuario no tiene solicitudes enviadas");
        }
    }

    obtenerFalsosAmigos(id) {
        const solicitudesUsuario = solicitudRepository.obtenerSolicitudesRechazadas(id);
        const solicitudesRechazadas = [];

        solicitudesUsuario.forEach(solicitud => {
            solicitudesRechazadas.push(solicitud.idReceptor);
        });

        if(solicitudesRechazadas.length > 0) {
            return solicitudesRechazadas;
        } else {
            throw new Error("Este usuario no tiene solicitudes rechazadas");
        }
    }

    obtenerSpammers(cantidad){
        return users.filter((user) => solicitudRepository.obtenerSolicitudesEnviadas(user.id).length > cantidad);
    }

    obtenerCallados(cantidad){
        return users.filter((user) => solicitudRepository.obtenerSolicitudesAceptadas(user.id).length < cantidad);
    }

    obtenerRechazados(){
        return users.filter((user) => solicitudRepository.obtenerSolicitudesRechazadas(user.id).length >= 1);
    }

    obtenerSoloFecha(fecha) {
        return fecha.toISOString().split('T')[0];
    }

    guardarPost(postJson) {
        const usuario = this.obtenerUsuarioPorId(postJson.idUsuario);
        const fechaPost = new Date();

        const postsUsuarioHoy = posts.filter((post) => post.idUsuario == usuario.id && this.obtenerSoloFecha(fechaPost) == this.obtenerSoloFecha(post.fecha));

        if(postsUsuarioHoy.length == 5) {
            throw new Error("No es posible postear mas de 5 veces al dia");
        } else {
            const post = new Post(postJson.titulo, postJson.cuerpo, usuario.id, fechaPost);
            postRepository.guardarPost(post);
        }
    }

    obtenerPostsUsuario(idUsuario) {
        const postsUsuario = posts.filter((post) => post.idUsuario == idUsuario);
        
        if(postsUsuario.length == 0) {
            throw new Error("Este usuario no tiene posts")
        }

        return postsUsuario;
    }

    obtenerPost(idPost) {
        const post = posts.find((post) => post.id == idPost);
        
        if(post == undefined) {
            throw new Error("El post con este id no existe")
        }

        return post;
    }

    obtenerUsersActivos() {
        const usersActivos = [];
        
        users.forEach(user => {
            const postsUserHoy = posts.filter((post) => post.idUsuario == user.id && this.obtenerSoloFecha(new Date()) == this.obtenerSoloFecha(post.fecha));

            if(postsUserHoy.length > 5 * 0.6) {
                usersActivos.push(user);
            }
        });

        return usersActivos;
    }

    obtenerUsersInactivos() {
        const usersInactivos = [];

        const fechaHoy = new Date();
        const hace4Semanas = new Date();
        hace4Semanas.setDate(fechaHoy.getDate() - 28);

        users.forEach(user => {
            const postsUser = this.obtenerPostsUsuario(user.id);
            const postsHace4Semanas = postsUser.filter((post) => new Date(post.fecha) >= hace4Semanas && new Date(post.fecha) < fechaHoy);

            if(postsHace4Semanas.length / 4 <= 1) {
                usersInactivos.push(user);
            }
        });

        return usersInactivos
    }

    obtenerUsersEscritores() {
        const usersEscritores = [];
        
        users.forEach(user => {
            const postsUser = this.obtenerPostsUsuario(user.id);
            const postsUserLargos = postsUser.filter((post) => post.cuerpo.length >= 300 * 0.9);

            if(postsUserLargos.length >= postsUser.length * 0.7) {
                usersEscritores.push(user);
            }
        });

        return usersEscritores;
    }

    darLike(idPost, likeJson) {
        const usuario = this.obtenerUsuarioPorId(likeJson.idUsuario);
        const post = this.obtenerPost(idPost);
        
        console.log(usuario);
        const likeExistente = post.obtenerLikes().find((like) => like.usuario.id == usuario.id);
        console.log(likeExistente);

        if(likeExistente == undefined) {
            post.guardarLike(new Like(usuario));
        } else {  
            throw new Error("Este usuario ya dio like al post");
        }
    }

    obtenerLikesPost(idPost) {
        const post = this.obtenerPost(idPost);
        return post.obtenerLikes();
    }

    agregarComentario(idPost, comentarioJson) {
        const usuario = this.obtenerUsuarioPorId(comentarioJson.idUsuario);
        const post = this.obtenerPost(idPost);

        post.guardarComentario(new Comentario(usuario, comentarioJson.texto));
    }

    obtenerComentariosPost(idPost) {
        const post = this.obtenerPost(idPost);
        return post.obtenerComentarios();
    }

    obtenerPostMasLikeado(fechaPost) {
        const fechaPostMasLikeado = new Date(fechaPost);
        const postsSegunFecha = posts.filter((post) => this.obtenerSoloFecha(post.fecha) == this.obtenerSoloFecha(fechaPostMasLikeado));

        if(postsSegunFecha.length == 0) {
            throw new Error("No hay posts registrados en esta fecha");
        }

        let postMasLikeado = postsSegunFecha[0];
        postsSegunFecha.forEach(post => {
            if(post.obtenerLikes().length > postMasLikeado.obtenerLikes().length) {
                postMasLikeado = post;
            }
        });
        
        return postMasLikeado;
    }

    obtenerPostMasComentado(fechaPost) {
        const fechaPostMasComentado = new Date(interaccionesJson.fechaPost);
        const postsSegunFecha = posts.filter((post) => this.obtenerSoloFecha(post.fecha) == this.obtenerSoloFecha(fechaPostMasComentado));
        
        if(postsSegunFecha.length == 0) {
            throw new Error("No hay posts registrados en esta fecha");
        }

        let postMasComentado = postsSegunFecha[0];
        postsSegunFecha.forEach(post => {
            if(post.obtenerComentarios().length > postMasComentado.obtenerComentarios().length) {
                postMasComentado = post;
            }
        });

        return postMasComentado;
    }
    
    obtenerPostsSegunLikes(cantidad) {
        const postsSegunLikes = posts.filter((post) => post.obtenerLikes().length > cantidad);
        return postsSegunLikes;
    }
    

    obtenerPostsSegunComentarios(cantidad) {
        const postsSegunComentarios = posts.filter((post) => post.obtenerComentarios().length > cantidad);
        return postsSegunComentarios;
    }
}