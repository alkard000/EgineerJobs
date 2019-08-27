const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.formularioNuevaVacante = (req, res) => {
    res.render('nuevavacante', {
        nombrePagina : 'Nueva Vacante',
        tagline : 'LLena el formulario y publica tu vacante',
        cerrarSesion : true,
        nombre : req.user.nombre
    })
}
//Agregar vacante s ala BD
exports.agregarVacante = async (req, res) => {
    const vacante = new Vacante(req.body);
    //Autor de la Vacante
    vacante.autor = req.user._id;
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
        nombrePagina : `Editar - ${vacante.titulo}`,
        cerrarSesion : true,
        nombre : req.user.nombre
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
//VALIDAR y SANITIZAR
exports.validarVacantes = (req, res, next) => {
    //SANITIZAR campos
    req.sanitizeBody('titulo').escape();
    req.sanitizeBody('empresa').escape();
    req.sanitizeBody('ubicacion').escape();
    req.sanitizeBody('salario').escape();
    req.sanitizeBody('contrato').escape();
    req.sanitizeBody('skills').escape();
    //VALIDACION campos
    req.checkBody('titulo', 'Agrega un Titulo a la Vacante').notEmpty();
    req.checkBody('empresa', 'Agrega una Empresa o Nombre').notEmpty();
    req.checkBody('ubicacion', 'Agrega una Ubicacion').notEmpty();
    req.checkBody('contrato', 'Agrega un Tipo de Contrato').notEmpty();
    req.checkBody('skills', 'Agrega al menos una skill').notEmpty();

    const errores = req.validationErrors();
    if(errores) {
        //Recargar vista con los errores
        req.flash('error', errores.map(error => error.msg));
        res.render('nuevavacante', {
            nombrePagina : 'Nueva Vacante',
            tagline : 'LLena el formulario y publica tu vacante',
            cerrarSesion : true,
            nombre : req.user.nombre,
            mensajes : req.flash()
        })
    }
    next();
}