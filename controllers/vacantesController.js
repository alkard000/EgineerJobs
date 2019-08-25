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
//Mostrar una Vacante
exports.mostrarVacante = async (req, res, next) => {
    const vacante = await Vacante.findOne({ url : req.params.url });
    //SI no existen resultados
    if(!vacante ) return next();
    //Enviar a los Views
    res.render('vacante', {
        vacante,
        nombrePagina : vacante.titulo,
        barra : true
    })
}
//Formulario de la edicion de una Vacante
exports.formEditarVacante = async (req, res, next) => {
    const vacante = await Vacante.findOne({url : req.params.url});
    //SI no existe la Vacante
    if(!vacante) return next();
    //Enviar a los Views
    res.render('editarvacante', {
        vacante,
        nombrePagina : `Editar - ${vacante.titulo}`
    })
}
//Enviar la Edicion a la BD
exports.editarVacante = async (req, res) => {

    const vacanteActualizada = req.body;

    vacanteActualizada.skills = req.body.skills.split(',');

    const vacante = await Vacante.findOneAndUpdate({
        url : req.params.url
    }, 
    vacanteActualizada, {
        new : true,
        runValidators : true
    });

    res.redirect(`/vacantes/${vacante.url}`);
}