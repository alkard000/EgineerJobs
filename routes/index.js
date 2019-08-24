const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');


module.exports = () => {
    router.get('/', 
        homeController.mostarTrabajos);
    //Crear VACANTES
    router.get('/vacantes/nueva', vacantesController.formularioNuevaVacante);
    return router;
}