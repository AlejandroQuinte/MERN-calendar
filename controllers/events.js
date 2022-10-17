const { response, request } = require('express')
const Evento = require('../models/Eventos');


const getEventos = async (req, res = response) => {

    const eventos = await Evento.find().populate('user', 'name');

    console.log(eventos)

    res.status(201).json({
        ok: true,
        eventos
    })
}

const crearEvento = async (req, res = response) => {

    const evento = new Evento(req.body);

    try {

        //para guardar la informacion del usuario
        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            evento: eventoGuardado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador...."
        })
    }
}

const ActualizarEvento = async (req = request, res = response) => {

    const { id } = req.params;
    const uid = req.uid

    try {

        const evento = await Evento.findById(id);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese Id'
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }
        //retorna el dato anterior antes de la actualizacion si desea que regresa el nuevo dato
        //debe colocar un tercer argumento
        const eventoActualizado = await Evento.findByIdAndUpdate(id, nuevoEvento, { new: true });

        res.json({
            ok: true,
            evento: eventoActualizado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const eliminarEvento = async (req, res = response) => {
    const { id } = req.params;
    const uid = req.uid

    try {

        const evento = await Evento.findById(id);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese Id'
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            })
        }
        //retorna el dato anterior antes de la actualizacion si desea que regresa el nuevo dato
        //debe colocar un tercer argumento
        await Evento.findByIdAndDelete(id);

        res.json({ ok: true })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}


module.exports = {
    getEventos,
    crearEvento,
    ActualizarEvento,
    eliminarEvento
}