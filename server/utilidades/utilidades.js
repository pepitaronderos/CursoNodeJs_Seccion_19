const crearMensaje = (nombre, mensaje) => {
	return {
		nombre,
		mensaje,
		fecha: new Date().getTime()
	}
}

export {
	crearMensaje
}