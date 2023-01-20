import Usuario from '../models/Usuario.js';
import generarId from '../helpers/generarId.js';
import generarJWT from '../helpers/generarJWT.js';
import { emailRegistro, emailRecuperarPassword } from '../helpers/email.js'

const registrar = async (req, res) => {
    const { email } = req.body;

    const existeUsuario = await Usuario.findOne({ email });

    if(existeUsuario){
        const error = new Error('El usuario ya esta registrado');
        return res.status(400).json({ msg: error.message });
    }
    
    try {
        const usuario = new Usuario(req.body);
        usuario.token = generarId();
        await usuario.save();
        emailRegistro(usuario);
        res.json({ msg: 'Usuario registrado, revisa tu email y verifica tu cuenta' });
    } catch (error) {
        console.log(error);
    }
}

const autenticar = async (req, res) => {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    
    if(!usuario){
        const error = new Error('El usuario no existe');
        return res.status(403).json({ msg: error.message });
    }

    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message });
    }

    if(await usuario.comprobarPassword(password)){
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        });
    }else {
        const error = new Error('El password es incorrecto');
        return res.status(400).json({ msg: error.message });
    }
}

const confirmar = async (req, res) => {
    const { token } = req.params;
    const usuarioConfirmado = await Usuario.findOne({ token });

    if(!usuarioConfirmado){
        const error = new Error('Token no válido');
        return res.status(403).json({ msg: error.message });
    }

    try {
        usuarioConfirmado.confirmado = true;
        usuarioConfirmado.token = '';
        await usuarioConfirmado.save();
        res.json({ msg: 'Tu cuenta ha sido confirmada' });
    } catch (error) {
        console.log(error);
    }
}

const olvidePassword = async (req, res) => {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });
    
    if(!usuario){
        const error = new Error('El usuario no existe');
        return res.status(403).json({ msg: error.message });
    }

    try {
        usuario.token = generarId(),
        await usuario.save();
        emailRecuperarPassword(usuario);

        res.json({ msg: 'Hemos enviado un email con las instrucciones' });
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const usuario = await Usuario.findOne({ token });

    if(!usuario){
        const error = new Error('Token no válido');
        return res.status(404).json({ msg: error.message });
    }

    res.json({ msg: 'Token válido y el usuario existe' });
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({ token });

    if(!usuario){
        const error = new Error('Token no válido');
        return res.status(404).json({ msg: error.message });
    }
    
    try {
        usuario.token = '';
        usuario.password = password;
        await usuario.save();
        res.json({ msg: 'Password modificado correctamente' })
    } catch (error) {
        console.log(error);
    }
}

const perfil = async (req, res) => {
    const { usuario } = req;
    res.json(usuario);
}

export{
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}