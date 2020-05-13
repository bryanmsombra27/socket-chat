//funciones para renderizar usuarios

var params = new URLSearchParams(window.location.search);
let nombre = params.get('nombre');
let sala = params.get('sala');

let divUsuarios = $('#divUsuarios');
let divChatBox = $('#divChatbox');
let formEnviar = $('#formEnviar');


function renderizarUsuarios(personas) {
    console.log(personas);
    let html = '';
    html += `<li>
    <a href="javascript:void(0)" class="active"> Chat de <span> ${params.get('sala')} </span></a>
              </li>
    `;


    personas.forEach(persona => {
        html += `<li>
        <a data-id="${persona.id}" href="javascript:void(0)"><img src="assets/images/users/1.jpg"
                alt="user-img" class="img-circle"> <span>${persona.nombre} <small
                    class="text-success">online</small></span></a>
                </li>`;
    });
    divUsuarios.html(html);
}

function renderizarMensajes(mensaje, yo) {
    let html = '';
    let fecha = new Date(mensaje.fecha);
    let hora = `${fecha.getHours()}:${fecha.getMinutes()} `;
    let adminClass = 'info';

    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if (yo) {
        html += ` <li class="reverse">
                <div class="chat-content">
                    <h5>${mensaje.nombre}</h5>
                    <div class="box bg-light-inverse">${mensaje.mensaje}
                    </div>
                </div>
                <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" />
                </div>
                <div class="chat-time">${hora}</div>
              </li>`;
    } else {
        html += '<li class="animated fadeIn">';
        if (mensaje.nombre !== 'Administrador') {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" />';
        }
        html += `
                    </div>
                    <div class="chat-content">
                        <h5>${mensaje.nombre}</h5>
                        <div class="box bg-light-${adminClass}">${mensaje.mensaje}</div>
                    </div>
                    <div class="chat-time">${hora}</div>
                </li>`;
    }
    divChatBox.append(html);
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





//listeners
divUsuarios.on('click', 'a', function () {
    let id = $(this).data('id');
    if (id) {

        console.log(id);
    }
});
formEnviar.on('submit', function (e) {
    e.preventDefault();
    let txtMensaje = e.target.txtMensaje.value.trim();

    if (txtMensaje === '') {
        return;
    }
    socket.emit('crearMensaje', {
        nombre,
        mensaje: txtMensaje
    }, function (mensaje) {
        txtMensaje = '';
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });




    e.target.reset();

})