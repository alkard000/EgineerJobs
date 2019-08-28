const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.mostarTrabajos = async (req, res, next) => {
    const vacantes = await Vacante.find();

    if(!vacantes) return next();
    res.render('home', {
        nombrePagina : 'EngineerJobs',
        tagline : 'Un sitio donde puedes encontrar y publicar trabajos para Ingenieros',
        barra : true,
        boton : true,
        imagen : req.user.imagen,
        vacantes
    })
}