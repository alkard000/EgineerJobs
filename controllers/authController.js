const passport = require('passport');
const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

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
        vacantes
    })
}