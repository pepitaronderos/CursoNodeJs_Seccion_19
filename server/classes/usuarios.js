//Creamos la clase usuarios
class Usuarios {
	constructor() {
		this.personas = [];
	}

	//Sirve para agregar una persona al chat, tomando de parametro el id, el nombre y la sala que me va a devolver el socket
	agregarPersona(id, nombre, sala) {
		const persona = { id, nombre, sala };
		//añadimos persona al array personas
		this.personas.push(persona);
		return this.personas;
	}

	//Sirve para obtener una persona por el id, va a recibir el id como parametro
	getPersona(id) {
		//Buscamos dentro del array  personas y generamos un nuevo arreglo con filter, con el [0] estamos diciendo que me devuelva el primer item del array
		const persona = this.personas.filter(per => per.id === id)[0];
		return persona;
	}

	//Me va a permitir obtener todas las personas del chat
	getPersonas() {
		return this.personas;
	}

	//Sirve para obtener las personas conectadas a una sala especifica
	getPersonasPorSala(sala) {
		//Buscamos en el array todas las personas conectadas a la misma sala y lo retornamos
		const personasEnSala = this.personas.filter(persona => persona.sala === sala);
		return personasEnSala;
	}

	//Sirve para eliminar un persona del arreglo de personas
	borrarPersona(id) {
		//Guardamos la persona que vamos a borrar
		const personaBorrada = this.getPersona(id);
		//Guardamos en this.personas el nuevo arreglo que obtenemos de filtrar las personas, basicamente le estamos diciendo que queresmos todos los id de personas menos el que pasamos como parametro
		this.personas = this.personas.filter(per => per.id !== id);
		return personaBorrada;
	}
}

export {
	Usuarios
}