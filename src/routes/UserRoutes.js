import express from 'express';
import { UserService } from '../services/UserServices.js';
import { Usuario } from '../classes/Usuario.js';
import { UserRepository } from '../repositories/UserRepository.js';

const router = express.Router();
const userService = new UserService();

router.post("/user", (req, res) => {
    try{
        const userJson = req.body;

        userJson.provincia = userJson.provincia ?? null;
        userJson.localidad = userJson.localidad ?? null;
             
        const user = new Usuario(userJson.nombre, userJson.apellido, userJson.email, userJson.fechaNac, userJson.biografia, userJson.provincia, userJson.localidad);
            userService.guardarUsuario(user);
            res.json({
                success: true,
                message: "¡Usuario llamado " + user.nombre + " creado con exito!"
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
        const usuario = userService.obtenerUsuarioPorID(id);
        res.json({
            success: true,
            "usuario obtenido": usuario
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }

});

router.put("/user/:id", (req, res) => {
    try {
        const id = req.params.id;
        const userNewData = req.body;
        const usuarioActualizado = userService.actualizarUsuario(id, userNewData);
        res.json({
            success: true,
            message: "Usuario " + usuarioActualizado.nombre + " de ID:" + id + " modificado con éxito",
        });
    } catch(error) {
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
            message: "¡Tienes buen gusto! Los gustos musicales han sido agregados con éxito",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/user/:id/gustos-musicales", (req, res) => {
    const id = req.params.id;

    try {
        const usuario = userService.obtenerUsuarioPorID(id);
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

    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/search/genero", (req, res) => {
    const genero = req.query.genero;
    const cantidad = userService.obtenerUsuariosConGusto(genero);

    res.json({
        success: true,
        'cantidad de usuarios con este gusto': cantidad
    });
});

router.get("/search/provincia", (req, res) => {
    const provincia = req.query.provincia;
    const cantidad = userService.obtenerUsuariosPorProvincia(provincia);

    res.json({
        success: true,
        'cantidad de usuarios en esta provincia': cantidad
    });
});

router.get("/search/localidad", (req, res) => {
    const localidad = req.query.localidad;
    const cantidad = userService.obtenerUsuariosPorLocalidad(localidad);

    res.json({
        success: true,
        'cantidad de usuarios en esta localidad': cantidad
    });
});

router.get("/search/edad", (req, res) => {
    const edad = req.query.edad;
    const cantidad = userService.obtenerUsuariosPorEdad(edad);

    res.json({
        success: true,
        'cantidad de usuarios con edad mayor a la ingresada': cantidad
    });
});

router.post("/solicitudes-amistad", (req, res) => {
    try{
        const solicitud = req.body;
             
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
    try {
        const id = req.params.id;
        const respuestaSolicitud = req.body;
        userService.actualizarSolicitud(id, respuestaSolicitud);

        res.json({
            success: true,
            message: "Amigo añadido!",
        });

    } catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/user/:id/amigos", (req, res) => {
    const id = req.params.id;
    
    const amigos = userService.obtenerAmigos(id);

    res.json({
        success: true,
        message: amigos
    });
});

router.get("/user/:id/amigos-pendientes", (req, res) => {
    const id = req.params.id;
    
    const pendientes = userService.obtenerAmigosPendientes(id);

    res.json({
        success: true,
        message: pendientes
    });
});

router.get("/user/:id/solicitudes-amistad", (req, res) => {
    const id = req.params.id;
    
    const solicitudesAmistad = userService.obtenerSolicitudesEnviadas(id);

    res.json({
        success: true,
        message: solicitudesAmistad
    });
});

router.get("/user/:id/falsos-amigos", (req, res) => {
    const id = req.params.id;
    
    const falsosAmigos = userService.obtenerSolicitudesRechazadas(id);

    res.json({
        success: true,
        message: falsosAmigos
    });
});

router.get("/user/estadisticas/:cantidad", (req, res) => {
    const cantidad = req.params.cantidad;

    //console.log(cantidad);
    
    const spammers = userService.obtenerSpammers(cantidad);

    res.json({
        success: true,
        message: spammers
    });
});


export {router as userRoutes};