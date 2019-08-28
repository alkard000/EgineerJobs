const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');
const multer = require('multer');
const shortid = require('shortid');

//Subir l aimagen de perfil
exports.subirImagen = (req, res, next) => {
    upload(req , res, function(error){
        if(error) {
            console.log(error);
            if(error instanceof multer.MulterError){
                if(error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es demasiado grande (MAX. 1000 Kb)');
                } else {
                    req.flash('error', error.message);
                }
            } else {
                req.flash('error', error.message);
            }
            res.redirect('/administracion');
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
            cb(null, __dirname+'../../public/uploads/perfiles');
        },
        filename : (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb)  {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            //CB como true(ACEPTADA) o false(DENEGADA)
            cb(null, true);
        } else {
            cb(new Error('Formato no Valido'), false);
        }
    }
}
const upload = multer(configuracionMulter).single('imagen');
//Creacion de un CUENTA
exports.formCrearCuenta = (req, res) => {
    res.render('crearcuenta', {
        nombrePagina : 'Crea tu cuenta en EngineerJobs',
        tagline : 'Comienza a publicar tus vacantes gratis, solo create una Cuenta',
        imagen : req.user.imagen
    })
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
            imagen : req.user.imagen,
            mensajes : req.flash()
        });
        return;
    }
    //Si NO hay errores
    next();
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
exports.formIniciarSesion = (req, res) => {
    res.render('iniciarsesion', {
        nombrePagina : 'Inicia tu sesion en EngineerJobs'
    })
}
exports.formEditarPerfil = (req, res) => {
    res.render('editarperfil', {
        nombrePagina : 'Edita tu Perfil',
        usuario : req.user,
        cerrarSesion : true,
        nombre : req.user.nombre,
        imagen : req.user.imagen
    })
}
exports.editarPerfil = async (req, res) => {
    const usuario = await Usuarios.findById(req.user._id);
    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    if(req.body.password){
        usuario.password = req.body.password;
    }

    if(req.file) {
        usuario.imagen = req.file.filename;
    }
    await usuario.save();
    req.flash('correcto', 'Cambios Guardados');
    res.redirect('/administracion');
}
//SANITIZAR y VALIDAR perfiles
exports.validarPerfil = (req, res, next) => {
    //SANITIZAR perfil
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    if(req.body.password) {
        req.sanitizeBody('password').escape();
    }
    //VALIDAR perfil
    req.checkBody('nombre', 'El nombre no puede ir Vacio').notEmpty();
    req.checkBody('email', 'El correo no puede ir Vacio').notEmpty();

    const errores = req.validationErrors();

    if(errores) {
        req.flash('error', errores.map(error => error.msg));

        res.render('editarperfil', {
            nombrePagina : 'Edita tu Perfil',
            usuario : req.user,
            cerrarSesion : true,
            nombre : req.user.nombre,
            imagen : req.user.imagen,
            mensajes : req.flash()
        })
    }
    next();
}
