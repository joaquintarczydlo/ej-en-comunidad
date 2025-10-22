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
    }

    obtenerSolicitudes() {
        return this.solicitudes;
    }

    obtenerSolicitudesAceptadas(id) {
        return this.solicitudes.filter((solicitud) => (id == solicitud.idEmisor || id == solicitud.idReceptor) && solicitud.estado == true);
    }

    obtenerSolicitudesEnviadas(id) {
        return this.solicitudes.filter((solicitud) => (id == solicitud.idEmisor) && solicitud.estado == null);
    }

    obtenerSolicitudesRecibidas(id) {
        return this.solicitudes.filter((solicitud) => (id == solicitud.idReceptor) && solicitud.estado == null);
    }

    obtenerSolicitudesRechazadas(id) {
        return this.solicitudes.filter((solicitud) => (id == solicitud.idEmisor) && solicitud.estado == false);
    }
}