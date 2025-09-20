import axios from 'axios';
import { UserRepository } from '../repositories/UserRepository.js';
import { SolicitudAmistad } from '../classes/SolicitudAmistad.js';
import { SolicitudesRepository } from '../repositories/SolicitudesRepository.js';

const userRepository = new UserRepository();
const solicitudRepository = new SolicitudesRepository();

export class UserService {
    
    guardarUsuario(user){
        if(this.mailDisponible(user.email)){
            userRepository.guardarUsuario(user);
        }else{
            throw new Error("El mail ya esta ocupado");
        }
    }

    mailDisponible(email) {
        const userConMail = userRepository.obtenerUsuariosPorMail(email);
        return userConMail.length == 0;
    }

    obtenerUsuarioPorID(id){
         return userRepository.obtenerUsuarioPorID(id)
    }

    actualizarUsuario(id, userData) {
        const userExistente = userRepository.obtenerUsuarioPorID(id);
        if ('email' in userData) {
            if (userExistente.email !== userData.email && !this.mailDisponible(userData.email)) {
                throw new Error("El mail ya está ocupado por otro usuario");
            }
        }
        if ('biografia' in userData) {
            if (userData.biografia.length > 500) {
                throw new Error("La biografía no puede tener más de 500 caracteres");
            }
        }
        return userRepository.actualizarUsuario(id, userData);
    }

    agregarLosGustosMusicales(id, gustosMusicales) {
        const usuario = userRepository.obtenerUsuarioPorID(id);
        if (!usuario) {
            return null;
        }
        
        usuario.agregarGustosMusicales(gustosMusicales);

        return usuario;
    }

    obtenerUsuariosConGusto(genero){
        return userRepository.obtenerEstadisticasMusicales(genero);
    }

    obtenerUsuariosPorProvincia(provincia){
        return userRepository.obtenerUsuariosPorProvincia(provincia);
    }

    obtenerUsuariosPorLocalidad(localidad){
        return userRepository.obtenerUsuariosPorLocalidad(localidad);
    }

    obtenerUsuariosPorEdad(edad){
        return userRepository.obtenerUsuariosPorEdad(edad);
    }

    registrarSolicitud(solicitud) {
        if(solicitud.idReceptor === solicitud.idRemitente){
            throw new Error("Un usuario no puede hacerse amigo de si mismo");
        }

        const nuevaSolicitud = new SolicitudAmistad(solicitud.idRemitente, solicitud.idReceptor);
        solicitudRepository.guardarSolicitud(nuevaSolicitud);
    }

    actualizarSolicitud(id, respuestaSolicitud) {
        solicitudRepository.actualizarSolicitud(id, respuestaSolicitud);
    }

    obtenerAmigos(id) {
        const solicitudesUsuario = solicitudRepository.obtenerSolicitudesUsuario(id);
        const amigos = [];

        console.log(solicitudesUsuario);
        solicitudesUsuario.forEach(solicitud => {
            if(solicitud.idReceptor != id) {
                amigos.push(solicitud.idReceptor);
            } else {
                amigos.push(solicitud.idRemitente)
            }
        });

        if(amigos.length > 0) {
            return amigos;
        } else {
            throw new Error("Este usuario no tiene amigos!");
        }
    }

    obtenerSolicitudesRecibidas(id) {
        const solicitudesUsuario = solicitudRepository.obtenerSolicitudesRecibidas(id);
        const pendientes = [];

        solicitudesUsuario.forEach(solicitud => {
            pendientes.push(solicitud.idReceptor);

        });

        if(pendientes.length > 0) {
            return pendientes;
        } else {
            throw new Error("Este usuario no tiene amigos!");
        }
    }

    obtenerSolicitudesEnviadas(id) {
        const solicitudesUsuario = solicitudRepository.obtenerSolicitudesEnviadas(id);
        const solicitudesEnviadas = [];

        solicitudesUsuario.forEach(solicitud => {
            solicitudesEnviadas.push(solicitud.idRemitente);

        });

        if(solicitudesEnviadas.length > 0) {
            return solicitudesEnviadas;
        } else {
            throw new Error("Este usuario no tiene amigos!");
        }
    }

    obtenerSolicitudesRechazadas(id) {
        const solicitudesUsuario = solicitudRepository.obtenerSolicitudesRechazadas(id);
        const solicitudesRechazadas = [];

        solicitudesUsuario.forEach(solicitud => {
            solicitudesRechazadas.push(solicitud.idReceptor);

        });

        if(solicitudesRechazadas.length > 0) {
            return solicitudesRechazadas;
        } else {
            throw new Error("Este usuario no tiene amigos!");
        }
    }

    obtenerSpammers(cantidad){
        const usuarios = userRepository.obtenerUsuarios();
        return usuarios.filter((user) => solicitudRepository.obtenerSolicitudesRecibidas(user.id).length > cantidad);
    }
}
