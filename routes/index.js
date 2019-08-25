const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
const usuariosController = require('../controllers/usuariosController');



module.exports = () => {

    router.get('/', 
        homeController.mostarTrabajos);

    //Crear VACANTES
    router.get('/vacantes/nueva', 
        vacantesController.formularioNuevaVacante);
    router.post('/vacantes/nueva', 
        vacantesController.agregarVacante);

    //Mostrar VACANTE
    router.get('/vacantes/:url', 
        vacantesController.mostrarVacante);

    //Editar VACANTE
    router.get('/vacantes/editar/:url', 
        vacantesController.formEditarVacante);
    router.post('/vacantes/editar/:url', 
        vacantesController.editarVacante);
    
    //Crear CUENTAS
    router.get('/crear-cuenta', 
        usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', 
        usuariosController.validarRegistro,
        usuariosController.crearUsuario);

    return router;
}