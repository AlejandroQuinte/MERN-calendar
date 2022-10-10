//? Rutas de usuarios / events
//? host + api/events

const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');
const { getEventos, crearEvento, ActualizarEvento, eliminarEvento } = require('../controllers/events');
const { validarJWT } = require('../middlewares/validar-jwt')
const { isDate } = require('../helpers/isDate')

const router = Router();

// Todas tienen que pasar por la validacion del jwt
router.use(validarJWT)

//Obtener eventos
router.get('/', getEventos);

//crear un evento
router.post('/',
    [
        check('title', "El titulo es obligatorio").not().isEmpty(),
        check('start', "Fecha de inicio es obligatoria").custom(isDate),
        check('end', "Fecha de Finalizacion es obligatoria").custom(isDate),
        validarCampos
    ],
    crearEvento);

//actualizar evento
router.put('/:id',
    [
        check('title', "El titulo es obligatorio").not().isEmpty(),
        check('start', "Fecha de inicio es obligatoria").custom(isDate),
        check('end', "Fecha de Finalizacion es obligatoria").custom(isDate),
        validarCampos
    ],
    ActualizarEvento);

//borrar evento
router.delete('/:id', eliminarEvento);


//recordar exportar el router sino no funciona
module.exports = router