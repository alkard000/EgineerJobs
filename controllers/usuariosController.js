const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');

exports.formCrearCuenta = (req, res) => {
    res.render('crearcuenta', {
        nombrePagina : 'Crea tu cuenta en EngineerJobs',
        tagline : 'Comienza a publicar tus vacantes gratis, solo create una Cuenta'
    })
}
exports.crearUsuario = async (req, res, next) => {
    //Crear el Usuario
    const usuario = new Usuarios(req.body);
    
    //Si no se crear el Usuario
    try {
        await usuario.save();
        //Si se crea
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error);
        res.redirect('/crear-cuenta');
    }
}
exports.validarRegistro = (req, res, next) => {
    
    //SANITIZAR
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    req.sanitizeBody('password').escape();
    req.sanitizeBody('confirmar').escape();

    //VALIDAR
    req.checkBody('nombre', 'El Nombre es Obligatorio').notEmpty();
    req.checkBody('email', 'El email debe ser Valido').isEmail();
    req.checkBody('password', 'El Password es Obligatorio').notEmpty();
    req.checkBody('confirmar', 'El confirmar Password es Obligatorio').notEmpty();
    req.checkBody('confirmar', 'El Password es diferente').equals(req.body.password);

    const errores = req.validationErrors();

    if(errores){
        //Si es que hay errores
        req.flash('error', errores.map(error => error.msg));
        res.render('crearcuenta',{
            nombrePagina : 'Crea tu cuenta en EngineerJobs',
            tagline : 'Comienza a publicar tus vacantes gratis, solo create una Cuenta',
            mensajes : req.flash()
        });
        return;
    }
    //Si NO hay errores
    next();
}