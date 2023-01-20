import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {

    const { email, nombre, token } = datos;

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const info = await transporter.sendMail({
        from: 'UpTask - Administrador de Proyectos <cuentas@uptask.com>',
        to: email,
        subject: 'UpTask - Confirma tu Cuenta',
        text: 'Confirma tu cuenta en UpTask',
        html: `<p>Hola: ${nombre}, confirma tu cuenta en UpTask</p>
               <p>Tu cuenta esta casi lista, solo debes comprobarla en el siguiente enlace:</p>
               <a href='http://127.0.0.1:5173/confirmar/${token}'>Confirmar Cuenta</a>
               <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje.</p>
        `
    });
}

const emailRecuperarPassword = async (datos) => {
    const { email, nombre, token } = datos;

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const info = await transporter.sendMail({
        from: 'UpTask - Administrador de Proyectos <cuentas@uptask.com>',
        to: email,
        subject: 'UpTask - Reestablece tu Password',
        text: 'Reestablece tu password en UpTask',
        html: `<p>Hola: ${nombre}, has solicitado reestablecer tu password</p>
               <p>Sigue el siguiente enlace para generar un nuevo password:</p>
               <a href='http://127.0.0.1:5173/olvide-password/${token}'>Reestablecer Password</a>
               <p>Si tu no solicitaste este email, puedes ignorar este mensaje.</p>
        `
    });
}

export{
    emailRegistro,
    emailRecuperarPassword
}