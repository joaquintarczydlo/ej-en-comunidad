
export class Usuario {

    constructor(nombre, apellido, email, fechaNac, biografia, provincia = null, localidad = null) {

        if(!nombre || !apellido || !email || !fechaNac || !biografia){
            throw new Error("Faltan datos obligatorios");
        }
        if(biografia.length > 500){
            throw new Error("La biografia es demasiado larga");
        }
        
        this.id = null;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.fechaNac = fechaNac;
        this.biografia = biografia;
        this.provincia = provincia;
        this.localidad = localidad;
        this.gustosMusicales = [];
    }

    agregarGustosMusicales(gustosMusicales) {
        this.gustosMusicales.push(...gustosMusicales);
    }

    calcularEdad() {
        const fechaNac = new Date(this.fechaNac); 
        const hoy = new Date();

        let edad = hoy.getFullYear() - fechaNac.getFullYear();

        const mes = hoy.getMonth();
        const dia = hoy.getDate();

        if (mes < fechaNac.getMonth() || (mes === fechaNac.getMonth() && dia < fechaNac.getDate())) {
            edad--;
        }

        return edad;
    }

}

/*{
    "nombre" : "rehj5rt",
    "apellido" : "apellido",
    "email" : "e5hy5u4ry54",
    "fechaNac" : "fechaNac",
    "biografia" : "biografia",
    "provincia" : "provincia",
    "localidad" : "localidad"
}*/
