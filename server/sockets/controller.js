//Interno
import { Usuarios } from "../classes/usuarios.js";
import { crearMensaje } from "../utilidades/utilidades.js"

//Instanciamos la clase Usuarios
const usuarios = new Usuarios();

//Creamos el controlador del socket para el backend
const socketController = (socket, io) => {
	//Cuando el socket está conectado
	io.on('connection', (client) => {
		//Escuchamos entrarChat, le pasamos de parametros data y un callback
		client.on("entrarChat", (data, callback) => {
			//Si no viene el nombre o la sala en el callback retornamos un error
			if (!data.nombre || !data.sala) {
				return callback({
					error: true,
					mensaje: "El nombre y la sala son necesarios"
				});
			}

			//Si en el array getpersona no hay ninguna persona guardada con ese id, entonces ejecuta lo de adentro, si no, no hace nada
			if (!usuarios.getPersona(client.id)) {
				//Unimos al cliente a la sala que se obtiene de la URL
				client.join(data.sala);
				//Agregamos al array personas la nueva persona que se acaba de unir a la sala de chat
				const personas = usuarios.agregarPersona(client.id, data.nombre, data.sala);
				//Emitimos a todos los usuarios de la sala la lista actualizada de usuarios
				client.broadcast.to(data.sala).emit("listaPersonas", usuarios.getPersonasPorSala(data.sala));
				//Emitimos un mensaje a todos los usuarios conectados a una sala en particular, avisando que el usuario se conectó
				client.broadcast.to(data.sala).emit("crearMensaje", crearMensaje("Administrador", data.nombre + " se unió al chat"));
				//En el callback pasamos las personas conectadas a la sala
				callback(usuarios.getPersonasPorSala(data.sala));
			}
		});

		//Escuchamos disconnect
		client.on("disconnect", () => {
			//Borramos del array de personas cuando una persona se desconecta, pero para no perder la referencia guardamos la persona borrada en personaBorrada
			const personaBorrada = usuarios.borrarPersona(client.id);

			//Si personaBorrada tine un valor guardado ejecuta lo de adentro, si no no hace nada
			if (personaBorrada) {
				//Emitimos un mensaje a todos los usuarios conectados a una sala en particular, que el usuario se desconectó
				client.broadcast.to(personaBorrada.sala).emit("crearMensaje", crearMensaje("Administrador", personaBorrada.nombre + " abandonó el chat"));
				//Volvemos a emitir la lista de personas conectadas en la sala a todos los usuarios conectados
				client.broadcast.to(personaBorrada.sala).emit("listaPersonas", usuarios.getPersonasPorSala(personaBorrada.sala));
			}
		});

		//Escuchamos crearMensaje
		client.on("crearMensaje", (data, callback) => {
			//Obtenemos la persona mediante el id
			const persona = usuarios.getPersona(client.id);
			//Creamos un mensaje nuevo, pasamos el nombre de la persona que lo envia y el mensaje
			const mensaje = crearMensaje(persona.nombre, data.mensaje);
			//Emitimos a todos los usuarios conectados a la sala de chat el mensaje enviado
			client.broadcast.to(persona.sala).emit("crearMensaje", mensaje);
			//Le paso el mensaje al callback
			callback(mensaje);
		});

		//Escuchamos mensajePrivado
		client.on("mensajePrivado", data => {
			//Obtenemos la persona mediante el id
			const persona = usuarios.getPersona(client.id);
			//Emitimos a la persona elegida el mensaje privado
			client.broadcast.to(data.para).emit("mensajePrivado", crearMensaje(persona.nombre, data.mensaje));
		});
	});
}

export {
	socketController
}