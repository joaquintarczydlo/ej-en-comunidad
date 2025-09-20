export class SolicitudesRepository {
    constructor() {
        this.solicitudes = [];
    }

    guardarSolicitud(solicitud) {
        if(this.solicitudes.length > 0) {
            const idsSolicitudes = this.solicitudes.map((solicitud) => solicitud.id);
            solicitud.id = Math.max(...idsSolicitudes) + 1;
        } else {
            solicitud.id = 1;
        }

        this.solicitudes.push(solicitud);
        console.log(this.solicitudes);
    }

    actualizarSolicitud(id, respuestaSolicitud) {
        const solicitud = this.solicitudes.find((solicitud) => solicitud.id == id);

        if (solicitud === -1) {
            throw new Error("La solicitud con este ID no existe");
        }

        solicitud.estado = respuestaSolicitud.estado;

        if(!solicitud.estado){
            throw new Error("Solicitud rechazada");
        }
    }

    obtenerSolicitudesUsuario(id) {
        return this.solicitudes.filter((solicitud) => (id == solicitud.idRemitente || id == solicitud.idReceptor) && solicitud.estado == true);
    }

    obtenerSolicitudesRecibidas(id) {
        return this.solicitudes.filter((solicitud) => (id == solicitud.idRemitente) && solicitud.estado == null);
    }

    obtenerSolicitudesEnviadas(id) {
        return this.solicitudes.filter((solicitud) => (id == solicitud.idReceptor) && solicitud.estado == null);
    }

    obtenerSolicitudesRechazadas(id) {
        return this.solicitudes.filter((solicitud) => (id == solicitud.idRemitente) && solicitud.estado == false);
    }
}