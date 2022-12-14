//Buscamos los parametros de la url
const params = new URLSearchParams(window.location.search);
//Creamos el objeto usuario en donde obtenemos de la url el nombre y la sala
const usuario = {
	nombre: params.get("nombre"),
	sala: params.get("sala")
};

//referencias HTML
const divUsuarios = $("#divUsuarios");
const formEnviar = $("#formEnviar");
const txtMensaje = $("#txtMensaje");
const divChatbox = $("#divChatbox");

function renderizarUsuarios(personas) {
	let html = "";
	html = `<li><a href="javascript:void(0)" class="active"> Chat de <span>${params.get("sala")}</span></a></li>`;

	personas.forEach(element => {
		html += `<li>
					<a data-id="${element.id}" href="javascript:void(0)">
						<img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${element.nombre} <small class="text-success">online</small></span>
					</a>
				</li>`;
	});

	divUsuarios.html(html);
}

function renderizarMensajes(mensaje, yo) {
	let html = "";
	const fecha = new Date(mensaje.fecha);
	const hora = fecha.getHours() + ":" + fecha.getMinutes();
	let adminClass = "info";

	console.log(mensaje);

	if (mensaje.nombre === "Administrador") {
		adminClass = "danger";
	}

	if (yo) {
		html += `<li class="reverse">
                <div class="chat-content">
                    <h5>${mensaje.nombre}</h5>
                    <div class="box bg-light-inverse">
						${mensaje.mensaje}
                    </div>
                </div>
                <div class="chat-img">
					<img src="assets/images/users/5.jpg" alt="user" />
                </div>
                <div class="chat-time">${hora}</div>
            </li>`;
	} else {
		if (mensaje.nombre !== "Administrador") {
			html += `<li class="animated fadeIn">
                <div class="chat-img">
					<img src="assets/images/users/1.jpg" alt="user" />
                </div>
                <div class="chat-content">
                    <h5>${mensaje.nombre}</h5>
                    <div class="box bg-light-${adminClass}">
						${mensaje.mensaje}
					</div>
                </div>
                <div class="chat-time">${hora}</div>
            </li>`;
		} else {
			html += `<li class="animated fadeIn">
                <div class="chat-content">
                    <h5>${mensaje.nombre}</h5>
                    <div class="box bg-light-${adminClass}">
						${mensaje.mensaje}
					</div>
                </div>
                <div class="chat-time">${hora}</div>
            </li>`;
		}

	}

	divChatbox.append(html);
}

function scrollBottom() {
	// selectors
	var newMessage = divChatbox.children('li:last-child');

	// heights
	var clientHeight = divChatbox.prop('clientHeight');
	var scrollTop = divChatbox.prop('scrollTop');
	var scrollHeight = divChatbox.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight() || 0;

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		divChatbox.scrollTop(scrollHeight);
	}
}

//Listener
divUsuarios.on("click", "a", function () {
	const id = $(this).data("id");

	if (id) {
		console.log(id);
	}
});

formEnviar.on("submit", function (e) {
	e.preventDefault();

	if (txtMensaje.val().trim().length === 0) {
		return;
	}

	//Emitimos crearMensaje, le pasamos el mensaje y en el callback renderizamos en el html
	socket.emit('crearMensaje', {
		nombre: usuario.nombre,
		mensaje: txtMensaje.val()
	}, mensaje => {
		txtMensaje.val("").focus();
		//Renderizamos el mensaje en el HTML y onemos en true porque somos nosotros los que estamos enviando el mensaje
		renderizarMensajes(mensaje, true);
		scrollBottom();
	});

})