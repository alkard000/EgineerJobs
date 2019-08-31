const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');
const multer = require('multer');
const shortid = require('shortid');

exports.formularioNuevaVacante = (req, res) => {
    res.render('nuevavacante', {
        nombrePagina : 'Nueva Vacante',
        tagline : 'LLena el formulario y publica tu vacante',
        cerrarSesion : true,
        nombre : req.user.nombre,
        imagen : req.user.imagen
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
    const vacante = await Vacante.findOne({ url : req.params.url }).populate('autor');
    //SI no existen resultados
    if(!vacante ) return next();
    //Enviar a los Views
    res.render('vacante', {
        vacante,
        nombrePagina : vacante.titulo,
        imagen : req.user.imagen,
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
        nombre : req.user.nombre,
        imagen : req.user.imagen
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
            imagen : req.user.imagen,
            mensajes : req.flash()
        })
    }
    next();
}
exports.eliminarVacante = async (req, res) => {
    const { id } =req.params;

    const vacante = await Vacante.findById(id);

    if(verificarAutor(vacante, req.user)){
        //Si es el Uusario Eliminar
        vacante.remove();
        res.status(200).send('Vacante Eliminada correctamente');
    } else {
        // No se permite eliminar
        res.status(403).sned('Error, acceso denegado');
    }
}
const verificarAutor = (vacante = {}, usuario = {} ) => {
    if(!vacante.autor.equals(usuario._id)) {
        return false;
    }
    return true;
}
//Subir archivos PDF
exports.subirCV = (req, res, next) => {
    upload(req, res, function(error){
        if(error) {
            console.log(error);
            if(error instanceof multer.MulterError){
                if(error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es demasiado grande (MAX. 100 Kb)');
                } else {
                    req.flash('error', error.message);
                }
            } else {
                req.flash('error', error.message);
            }
            res.redirect('back');
            return;
        } else {
            return next();
        }
    });
}
//Configuracion de MULTER
const configuracionMulter = {
    limits : { fileSize : 1000000 },
    storage : fileStorage = multer.diskStorage({
        destination : (req, file, cb) => {
            cb(null, __dirname+'../../public/uploads/cv');
        },
        filename : (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb)  {
        if(file.mimetype === 'application/pdf') {
            //CB como true(ACEPTADA) o false(DENEGADA)
            cb(null, true);
        } else {
            cb(new Error('Formato no Valido'), false);
        }
    }
}
const upload = multer(configuracionMulter).single('CV');
//CONTACTAR------>>Almacenar candidatos en base de datos
exports.contactar = async (req, res, next ) => {
    const vacante = await Vacante.findOne( { url : req.params.url } );
    //NO existe la vacante
    if(!vacante) return next();

    //TODO bien
    const nuevoCandidato = {
        nombre : req.body.nombre,
        email : req.body.email,
        cv : req.file.filename
    }
    //Almacenar VACANTE
    vacante.candidatos.push(nuevoCandidato);
    await vacante.save();
    //Mensaje FLASH y REDIRECCION
    req.flash('correcto', 'Se envio tu Curriculum');
    res.redirect('/');
}
//Mostrar a los CANDIDATOS
exports.mostrarCandidatos = async (req, res, next) => {
    const vacante = await Vacante.findById(req.params.id);

    if(vacante.autor != req.user._id.toString()){
        return next();
    }
    if(!vacante) return next();

    res.render('candidatos', {
        nombrePagina : `Candidatos Vacante - ${vacante.titulo}`,
        cerrarSesion : true,
        nombre : req.user.nombre,
        imagen : req.user.imagen,
        candidatos : vacante.candidatos
    })
}
//BUSCADOR DE VACANTES
exports.buscarVacantes = async (req, res) => {
    const vacantes = await Vacante.find( {
       $text : {
           $search : req.body.q
       } 
    });
    //MOSTRAR
    res.render('home', {
        nombrePagina : `Resultados de ${req.body.q}`,
        barra : true,
        vacantes
    })
}
