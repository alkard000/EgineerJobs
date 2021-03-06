const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

//--------RUTAS---------//
module.exports = () => {

    router.get('/', 
        homeController.mostarTrabajos);
    router.get('/lista-vacantes/:page', 
        vacantesController.paginarVacantes);

    //Crear VACANTES
    router.get('/vacantes/nueva', 
        authController.verificarUsuario,
        vacantesController.formularioNuevaVacante
    );
    router.post('/vacantes/nueva',
        authController.verificarUsuario,
        vacantesController.validarVacantes,
        vacantesController.agregarVacante
    );

    //Mostrar VACANTES
    router.get('/vacantes/:url', 
        vacantesController.mostrarVacante
    );

    //Editar VACANTES
    router.get('/vacantes/editar/:url', 
        authController.verificarUsuario,
        vacantesController.formEditarVacante
    );
    router.post('/vacantes/editar/:url', 
        authController.verificarUsuario,
        vacantesController.validarVacantes,
        vacantesController.editarVacante
    );

    //Eliminar VACANTES
    router.delete('/vacantes/eliminar/:id',
        vacantesController.eliminarVacante
    );
    
    //Crear CUENTAS
    router.get('/crear-cuenta', 
        usuariosController.formCrearCuenta
    );
    router.post('/crear-cuenta', 
        usuariosController.validarRegistro,
        usuariosController.crearUsuario
    );
    
    //Autenticar CUENTAS
    router.get('/iniciar-sesion', 
        usuariosController.formIniciarSesion
    );
    router.post('/iniciar-sesion', 
        authController.autenticarUsuario
    );

    //Recuperacion de Contraseñas
    router.get('/restablecer', 
        authController.formRestablecerPassword,
    );
    router.post('/restablecer', 
        authController.enviarToken
    );
    router.get('/restablecer/:token', 
        authController.restablecerPassword);
    router.post('/restablecer/:token', 
        authController.guardarPassword)
    
    //Cerrar Sesion en la CUENTA
    router.get('/cerrar-sesion', 
        authController.verificarUsuario, 
        authController.cerrarSesion
    );

    //Administracion de la CUENTA
    router.get('/administracion', 
        authController.verificarUsuario,
        authController.mostrarPanel
    );
    
    //Edicion de la CUENTA
    router.get('/editar-perfil',
        authController.verificarUsuario,
        usuariosController.formEditarPerfil
    );
    router.post('/editar-perfil', 
        authController.verificarUsuario,
        //usuariosController.validarPerfil,
        usuariosController.subirImagen,
        usuariosController.editarPerfil
    );

    //Recibir mensajes de candidatos
    router.post('/vacantes/:url', 
        vacantesController.subirCV, 
        vacantesController.contactar 
    );
    
    //Mostrar CANDIDATOS por VACANTE
    router.get('/candidatos/:id', 
        authController.verificarUsuario,
        vacantesController.mostrarCandidatos,
    );
    //BUSCADOR
    router.post('/buscador', vacantesController.buscarVacantes);
    return router;
}