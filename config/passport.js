const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');

passport.use(new LocalStrategy ({
    usernameField : 'email',
    passwordField : 'password'
    }, async (email, password, done) => {

        const usuario = await Usuarios.findOne({ email });
        if(!usuario) return done(null, false, {
            message : 'Usuario no Existente'
        });
        //Usuario existe, se debe Verificar
        const verificarPass = usuario.compararPassword(password);
        //Usuario correcto, contraseña incorrecta
        if(!verificarPass) return done(null, false, {
            message : 'Password Incorrecto'
        });
        //USUARIO y PW son correctos
        return done(null, usuario);
}));
passport.serializeUser((usuario, done) => done(null, usuario._id));

passport.deserializeUser(async (id, done) => {
    const usuario = await Usuarios.findById(id).exec();
    return done(null, usuario);
});
//Finalmente se mando el passport a EXPORT
module.exports = passport;