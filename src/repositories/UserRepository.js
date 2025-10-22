
export class UserRepository {
    constructor() {
        this.users = [];
    }

    obtenerUsuarios(){
        return this.users;
    }

    guardarUsuario(user) {
        if(this.users.length > 0) {
            const idsUsers = this.users.map((user) => user.id);
            user.id = Math.max(...idsUsers) + 1;
        } else {
            user.id = 1;
        }

        this.users.push(user);
    }

    actualizarUsuario(user, userData) {
        if (userData.nombre !== undefined) {
           user.nombre = userData.nombre;
        }
        if (userData.apellido !== undefined) {
            user.apellido = userData.apellido;
        }
        if (userData.email !== undefined) {
            user.email = userData.email;
        }
        if (userData.fechaNac !== undefined) {
            user.fechaNac = userData.fechaNac;
        }
        if (userData.biografia !== undefined) {
           user.biografia = userData.biografia;
        }
        if (userData.provincia !== undefined) {
            user.provincia = userData.provincia;
        }
        if (userData.localidad !== undefined) {
            user.localidad = userData.localidad;
        }
        if (userData.gustosMusicales !== undefined) {
            user.gustosMusicales = userData.gustosMusicales;
        }
    }
}