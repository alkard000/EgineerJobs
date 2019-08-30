const passport = require('passport');
const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');
const Usuarios = mongoose.model('Usuarios');
const crypto = require('crypto');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect : '/administracion',
    failureRedirect : '/iniciar-sesion',
    failureFlash : true,
    badRequestMessage : 'Ambos Campos son Obligatorios'
});
exports.verificarUsuario = (req, res, next) => {
    //Revisar si el Uusario esta autenticado
    if(req.isAuthenticated()){
        return next();//----------->>Usuario autenticado
    }
    //Redireccionar Usuario
    res.redirect('/iniciar-sesion');
}
exports.mostrarPanel = async (req, res) => {
    //Consultar el Usuario Autenticado
    const vacantes = await Vacante.find({ autor : req.user._id });
    res.render('administracion', {
        nombrePagina : 'Panel de Administracion',
        tagline : 'Crea y administra tus vacantes desde aqui',
        cerrarSesion : true,
        nombre : req.user.nombre,
        imagen : req.user.imagen,
        vacantes
    })
}
exports.cerrarSesion = (req, res) => {
    req.logout();
    req.flash('correcto', 'Cerraste tu Sesion');
    return res.redirect('/iniciar-sesion');
}
//Formulario para RESETEAR password
exports.formRestablecerPassword = (req, res) => {
    res.render('restablecer', {
        nombrePagina : 'Restablece tu Password',
        tagline : 'Si ya tienes una cuenta en EngineerJobs, pero olvidaste tu password, RECUPERALA'
    })
}
//Enviar el TOKEN
exports.enviarToken = async (req, res) => {
    const usuario = await Usuarios.findOne( { email : req.body.email } );
    //USUARIO no Existe
    if(!usuario) { 
        req.flash('error', 'No existe esa cuenta');
        return res.redirect('/iniciar-sesion');
    }
    //USUARIO existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expira = Date.now() + 3600000;
    //GUardar el USUARIO
    await usuario.save();
    const resetURL = `http://${req.headers.host}/re;stablecer/${usuario.token}`;

    console.log(resetURL);

    await enviarEmail.enviar({
        usuario,
        subject : 'Password Reset',
        resetURL,
        archivo : 'reset'
    });

    req.flash('correcto', 'Revisa tu Email para la indicaciones');
    res.redirect('/iniciar-sesion');
}