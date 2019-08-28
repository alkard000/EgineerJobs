const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');

const usuarioSchema = new mongoose.Schema({
    email : {
        type : String,
        unique : true,
        lowercase : true,
        trim : true
    },
    nombre : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true,
        trim : true
    },
    imagen : String,
    token : String,
    expira : Date
});

//HASHEAR Passwords
usuarioSchema.pre('save', async function(next) { 
    //Password HASHEADO
    if(!this.isModified('password')){
        return next();//Forzar detencion
    }
    //Password NO HASHEADO
    const hash = await bcrypt.hash(this.password, 12);//----------->Hashear password en 12 iteraciones
    this.password = hash;
    next();
});
//Verificar si el ID es repetido
usuarioSchema.post('save', function (error, doc, next) {
    if(error.name === 'MongoError' && error.code === 11000) {
        next('Ese correo ya esta Registrado');
    } else {
        next(error);
    }
});
//Autenticar USUARIOS
usuarioSchema.methods = {
    compararPassword : function(password){
        return bcrypt.compareSync(password, this.password);
    }
}

module.exports = mongoose.model('Usuarios', usuarioSchema);