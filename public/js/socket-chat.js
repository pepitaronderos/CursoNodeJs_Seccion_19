//Creamos el socket del lado del cliente
const socket = io();

//Si nombre o la sala no vienen en la url, entonces redirecciona al index y tira un error
if (!params.get("nombre") || !params.get("sala")) {
	window.location = "index.html";
	throw new Error("El nombre y la sala son necesarios");
}

//Cuando el socket esta conectado, tiramos un mensaje en la consola y renderizamos en el html los usuarios conectados
socket.on('connect', () => {
	console.log('Conectado al servidor');
	socket.emit("entrarChat", usuario, function (resp) {
		//console.log("Usuarios conectados: ", resp);
		renderizarUsuarios(resp);
	});
});

//Cuando el socket se desconecta mostramos un mensaje en la consola
socket.on('disconnect', () => {
	console.log('Perdimos conexión con el servidor');
});

//Escuchamos crearMensaje y lo creamos en el html
socket.on('crearMensaje', mensaje => {
	//console.log('Servidor:', mensaje);
	//Renderizamos el mensaje en el HTML y onemos en false porque no somos nosotros los que estamos enviando el mensaje, estamos renderizando los mensajes nuevos de los demas
	renderizarMensajes(mensaje, false);
	scrollBottom();
});

//Escuchamos listaPersonas, mostramos en la consola las personas conectadas
socket.on("listaPersonas", personas => {
	renderizarUsuarios(personas);
})

//Escuchamos mensajePrivado, mostramos los mensajes enviado solo al usuario que se lo enviamos
socket.on("mensajePrivado", mensaje => {
	console.log("Mensaje privado: ", mensaje);
});