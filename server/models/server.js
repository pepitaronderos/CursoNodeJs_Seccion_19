//Externo
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

//Interno
//import { dbConnection } from '../database/config.js';
import { socketController } from '../sockets/controller.js'

//Creamos la clase Server en donde vamos a poner todas las configuraciones necesarias para servir el contenido
class ServerConfig {
	constructor() {
		//Seteamos 
		this.app = express();
		this.port = process.env.PORT;
		this.server = createServer(this.app);
		this.io = new Server(this.server);

		//Conectar a la base de datos
		// this.conectarDB();

		//Middlewares
		this.middlewares();

		//Sockets
		this.sockets();
	}

	//Creamos el metodo asincrono para llamar la db connection, le hacemos un await
	/* async conectarDB() {
		await dbConnection();
	} */

	middlewares() {
		//CORS
		this.app.use(cors());

		//Lectura y parseo del body, aca leemos la data que nos estan enviando
		this.app.use(express.json());

		//Leemos la carpeta Publica
		this.app.use(express.static("public"));
	}

	sockets() {
		//Se le envia socket y this.io para poder emitir para todos y no tener que hacer el broadcast
		this.io.on('connection', (socket) => socketController(socket, this.io));
	}

	listen() {
		this.server.listen(this.port, () => {
			console.log(`Example app listening on port ${this.port}`);
		});
	}
}

export {
	ServerConfig
}