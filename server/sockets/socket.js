const {
    io
} = require("../server");
const {
    Usuarios
} = require("../classes/usuarios");
const {
    crearMensaje
} = require('../helpers/utilidades');

const usuarios = new Usuarios();

io.on("connection", (client) => {
    client.on("entrarChat", (data, callback) => {
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: "El nombre y sala son necesarios",
            });
        }
        //conectando a un usuario a la sala
        client.join(data.sala);
        // let personas = usuarios.agregarPersonas(client.id, data.nombre);
        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorsala(data.sala));
        client.broadcast.to(data.sala).emit("crearMensaje", crearMensaje('Administrador', `${data.nombre} se unió el chat`));

        callback(usuarios.getPersonasPorsala(data.sala));
    });
    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);


        callback(mensaje);
    })



    client.on("disconnect", () => {
        let personaBorrada = usuarios.deletePersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit("crearMensaje", crearMensaje('Administrador', `${personaBorrada.nombre} abandono el chat`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorsala(personaBorrada.sala));



    });

    //mensajes privados
    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });
});