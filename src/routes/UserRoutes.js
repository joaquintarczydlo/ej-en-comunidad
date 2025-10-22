import express from 'express';
import { UserService } from '../services/UserServices.js';

const router = express.Router();
const userService = new UserService();

router.post("/user", (req, res) => {
    const userJson = req.body;
    
    try {
        userJson.provincia = userJson.provincia ?? null;
        userJson.localidad = userJson.localidad ?? null;
             
        userService.guardarUsuario(userJson);

        res.json({
            success: true,
            message: "Usuario llamado " + userJson.nombre + " creado con exito!"
        });
    }
    catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/user/:id", (req, res) => {
    const id = req.params.id;

    try {
        const usuario = userService.obtenerUsuarioPorId(id);

        res.json({
            success: true,
            usuarioEncontrado: usuario
        });
    } 
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
});

router.put("/user/:id", (req, res) => {
    const id = req.params.id;
    const nuevaDataUser = req.body;
    
    try {
        const usuarioActualizado = userService.actualizarUsuario(id, nuevaDataUser);

        res.json({
            success: true,
            message: "Usuario " + usuarioActualizado.nombre + " de ID: " + id + " modificado con exito",
        });
    } 
    catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.post("/user/:id/gustos-musicales", (req, res) => {
    const id = req.params.id;
    const gustosMusicales = req.body.gustosMusicales;

    try {
        userService.agregarLosGustosMusicales(id, gustosMusicales);
        
        res.json({
            success: true,
            message: "Los gustos musicales han sido agregados con exito",
        });
    } 
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/user/:id/gustos-musicales", (req, res) => {
    const id = req.params.id;

    try {
        const usuario = userService.obtenerUsuarioPorId(id);

        if (usuario.gustosMusicales.length > 0) {
            res.json({
                success: true,
                id: id,
                usuario: usuario.nombre + " " + usuario.apellido,
                gustosMusicales: usuario.gustosMusicales
            });
        } else {
            throw new Error("El usuario no tiene gustos musicales cargados");
        }
    } 
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/users/estadisticas", (req, res) => {
    const {genero, provincia, localidad, edad} = req.query;
    
    try {
        if(genero) {
            const cantUsers = userService.obtenerUsuariosPorMusica(genero);
    
            res.json({
                success: true,
                'cantidad de usuarios que les gusta el genero': cantUsers
            });

        }
        else if(provincia) {
            const cantUsers = userService.obtenerUsuariosPorProvincia(provincia);

            res.json({
                success: true,
                'cantidad de usuarios en esta provincia': cantUsers
            });
        }
        else if(localidad) {
            const cantUsers = userService.obtenerUsuariosPorLocalidad(localidad);

            res.json({
                success: true,
                'cantidad de usuarios en esta localidad': cantUsers
            });
        }
        else if(edad) {
            const cantUsers = userService.obtenerUsuariosPorEdad(edad);

            res.json({
                success: true,
                'cantidad de usuarios con edad mayor a la ingresada': cantUsers
            });
        }
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
});

router.post("/solicitudes-amistad", (req, res) => {
    const solicitud = req.body;

    try{     
        userService.registrarSolicitud(solicitud);

        res.json({
            success: true,
            message: "Solicitud enviada con exito!"
        });
    }
    catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.put("/solicitudes-amistad/:id", (req, res) => {
    const id = req.params.id;
    const respuestaSolicitud = req.body.estado;
    
    try {
        userService.actualizarSolicitud(id, respuestaSolicitud);

        res.json({
            success: true,
            message: "Amigo añadido!",
        });
    } 
    catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/user/:id/amigos", (req, res) => {
    const id = req.params.id;
    
    try {
        const amigos = userService.obtenerAmigos(id);

        res.json({
            success: true,
            amigos: amigos
        });
    }
    catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/user/:id/amigos-pendientes", (req, res) => {
    const id = req.params.id;
    
    try {
        const pendientes = userService.obtenerAmigosPendientes(id);

        res.json({
            success: true,
            pendientes: pendientes
        });
    }
    catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/user/:id/solicitudes-amistad", (req, res) => {
    const id = req.params.id;

    try {
        const solicitudesAmistad = userService.obtenerSolicitudesAmistad(id);

        res.json({
            success: true,
            solicitudesAmistad: solicitudesAmistad
        });
    }
    catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/user/:id/falsos-amigos", (req, res) => {
    const id = req.params.id;
    
    try {
        const falsosAmigos = userService.obtenerFalsosAmigos(id);
    
        res.json({
            success: true,
            message: falsosAmigos
        });
    }
    catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/users/estadisticas-amistades/:cantidad", (req, res) => {
    const cantidad = req.params.cantidad;
    const {spammers, callados, rechazados} = req.query;
    
    try {
        if(spammers) {
            const usersSpammers = userService.obtenerSpammers(cantidad);

            res.json({
                success: true,
                usersSpammers: usersSpammers
            });
        }
        else if(callados) {
            const usersCallados = userService.obtenerCallados(cantidad);

            res.json({
                success: true,
                usersCallados: usersCallados
            });
        }
        else if(rechazados) {
            const usersRechazados = userService.obtenerRechazados();

            res.json({
                success: true,
                usersRechazados: usersRechazados
            });
        }
    }
    catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.post("/posts", (req, res) => {
    try {
        const postJson = req.body;
             
        userService.guardarPost(postJson);

        res.json({
            success: true,
            message: "Post creado con exito!"
        });
    }
    catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/posts", (req, res) => {
    const idUsuario = req.query.usuarios;
    
    try {    
        const postsUsuario = userService.obtenerPostsUsuario(idUsuario);

        res.json({
            success: true,
            posts: postsUsuario
        });
    }
    catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/post/:id", (req, res) => {
    const idPost = req.params.id;
    
    try {     
        const post = userService.obtenerPost(idPost);

        res.json({
            success: true,
            post: post
        });
    }
    catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/posts/estadisticas-users", (req, res) => {
    try {
        const usersActivos = userService.obtenerUsersActivos();
        const usersInactivos = userService.obtenerUsersInactivos();
        const usersEscritores = userService.obtenerUsersEscritores();

        res.json({
            success: true,
            usersActivos: usersActivos,
            usersInactivos: usersInactivos,
            usersEscritores: usersEscritores
        });
    }
    catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.post("/post/:id/like", (req, res) => {
    const idPost = req.params.id;
    const likeJson = req.body;

    try {
        userService.darLike(idPost, likeJson);

        res.json({
            success: true,
            message: "Has dado Like a este post!"
        });
    }
    catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/post/:id/likes", (req, res) => {
    const idPost = req.params.id;
    
    try {
        const likesPost = userService.obtenerLikesPost(idPost);

        res.json({
            success: true,
            likesPost: likesPost
        });
    }
    catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.post("/post/:id/comentario", (req, res) => {
    const idPost = req.params.id;
    const comentarioJson = req.body;
    
    try {      
        userService.agregarComentario(idPost, comentarioJson);

        res.json({
            success: true,
            message: "Comentario publicado!"
        });
    }
    catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/post/:id/comentarios", (req, res) => {
    const idPost = req.params.id;
    
    try {
        const comentariosPost = userService.obtenerComentariosPost(idPost);

        res.json({
            success: true,
            comentariosPost: comentariosPost
        });
    }
    catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/posts/estadisticas-interacciones", (req, res) => {
    const interaccionesJson = req.body;
    const { postMaxLikes, postMaxComentarios, postsConMasXLikes, postConMasXComentarios } = req.query;
    
    try{
        if(postMaxLikes) {
            const postMasLikeado = userService.obtenerPostMasLikeado(interaccionesJson.fecha);

            res.json({
                success: true,
                postMasLikeado: postMasLikeado
            });
        }
        else if(postMaxComentarios) {
            const postMasComentado = userService.obtenerPostMasComentado(interaccionesJson.fecha);

            res.json({
                success: true,
                postMasComentado: postMasComentado
            });
        }
        else if(postsConMasXLikes) {
            const postsSegunCantLikes = userService.obtenerPostsSegunLikes(interaccionesJson.cantidad);
            
            res.json({
                success: true,
                postsSegunCantLikes: postsSegunCantLikes
            });
        }
        else if(postConMasXComentarios) {
            const postsSegunCantComentarios = userService.obtenerPostsSegunComentarios(interaccionesJson.cantidad);

            res.json({
                success: true,
                postConMasXComentarios: postsSegunCantComentarios
            });
        }
    }
    catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

export {router as userRoutes};