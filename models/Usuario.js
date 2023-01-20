import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    token: {
        type: String,
        
    },
    confirmado: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }
);

usuarioSchema.pre('save', async function(next){

    if(!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

usuarioSchema.methods.comprobarPassword = async function(formularioPassword){
    return await bcrypt.compare(formularioPassword, this.password);
}

const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;