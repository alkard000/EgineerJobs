const passport = require('passport');

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
exports.mostrarPanel = (req, res) => {
    res.render('administracion', {
        nombrePagina : 'Panel de Administracion',
        tagline : 'Crea y administra tus vacantes desde aqui'
    })
}