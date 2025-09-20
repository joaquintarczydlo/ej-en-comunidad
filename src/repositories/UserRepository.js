export class UserRepository {
    constructor() {
        this.usuarios = [];
    }

    obtenerUsuarios(){
        return this.usuarios;
    }

    guardarUsuario(user) {
        if(this.usuarios.length > 0) {
            const idsUsuarios = this.usuarios.map((usuario) => usuario.id);
            user.id = Math.max(...idsUsuarios) + 1;
        } else {
            user.id = 1;
        }

        this.usuarios.push(user);
    }
    
    obtenerUsuariosPorMail(email) {
        return this.usuarios.filter((usuario) => usuario.email == email);
    }

    obtenerUsuarioPorID(id){
        //console.log(id);
        const usuariosSegunId = this.usuarios.filter((usuario) => usuario.id == id);
        //console.log(usuariosSegunId);
        if(usuariosSegunId.length == 0) {
            throw new Error("El usuario con este ID no existe");
        }
        return usuariosSegunId[0];
    }

    actualizarUsuario(id, userData) {
        const usuarioI = this.usuarios.findIndex((usuario) => usuario.id == id);
        if (usuarioI === -1) {
            throw new Error("El usuario con este ID no existe");
        }
        if (userData.nombre !== undefined) {
            this.usuarios[usuarioI].nombre = userData.nombre;
        }
        if (userData.apellido !== undefined) {
            this.usuarios[usuarioI].apellido = userData.apellido;
        }
        if (userData.email !== undefined) {
            this.usuarios[usuarioI].email = userData.email;
        }
        if (userData.fechaNac !== undefined) {
            this.usuarios[usuarioI].fechaNac = userData.fechaNac;
        }
        if (userData.biografia !== undefined) {
            this.usuarios[usuarioI].biografia = userData.biografia;
        }
        if (userData.provincia !== undefined) {
            this.usuarios[usuarioI].provincia = userData.provincia;
        }
        if (userData.localidad !== undefined) {
            this.usuarios[usuarioI].localidad = userData.localidad;
        }
        if (userData.gustosMusicales !== undefined) {
            this.usuarios[usuarioI].gustosMusicales = userData.gustosMusicales;
        }

        return this.usuarios[usuarioI];
    }

    obtenerEstadisticasMusicales(genero){
        return this.usuarios.reduce((cantUsers, user) => user.gustosMusicales.includes(genero) ? cantUsers + 1 : cantUsers , 0);
    }

    obtenerUsuariosPorProvincia(provincia){
        return this.usuarios.reduce((cantUsers, user) => user.provincia == provincia ? cantUsers + 1 : cantUsers , 0);
    }

    obtenerUsuariosPorLocalidad(localidad){
        return this.usuarios.reduce((cantUsers, user) => user.localidad == localidad ? cantUsers + 1 : cantUsers , 0);
    }

    obtenerUsuariosPorEdad(edad){
        return this.usuarios.reduce((cantUsers, user) => user.calcularEdad() > edad ? cantUsers + 1 : cantUsers , 0);
    }


}
    
    // mailDisponible (user) {
    //     const mail = user.mail;
    //     return !(this.usuarios.some(usuario => usuario.mail == mail));
    // }