const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.formularioNuevaVacante = (req, res) => {
    res.render('nuevavacante', {
        nombrePagina : 'Nueva Vacante',
        tagline : 'LLena el formulario y publica tu vacante'
    })
}
//Agregar vacante s ala BD
exports.agregarVacante = async (req, res) => {
    const vacante = new Vacante(req.body);
    //Generar Arreglo de Habilidades
    vacante.skills = req.body.skills.split(',');
    //Alamcenar en BD
    const nuevaVacante = await vacante.save();
    //Redireccionar
    res.redirect(`/vacantes/${nuevaVacante.url}`);
}