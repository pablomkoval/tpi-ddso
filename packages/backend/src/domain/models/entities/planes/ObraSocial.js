export class ObraSocial{
    planes
    constructor(nombre, planes = []){
        this.nombre = nombre;
        this.planes = planes;
    }

    agregarPlan(plan){
        this.planes.push(plan)
    }
}