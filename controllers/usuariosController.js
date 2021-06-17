const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/emails');

exports.formCrearCuenta = (req,res)=>{
    res.render('crear-cuenta',{
        nombrePagina: 'Crea tu cuenta'
    });
};

exports.crearNuevaCuenta= async( req, res)=>{
    const usuario = req.body;

    req.checkBody('confirmar', 'El password confirmado no puede ir vacio' ).notEmpty();
    req.checkBody('confirmar', 'El password es diferente').equals(req.body.password);

    const erroresExpress = req.validationErrors();

    try {
        const usuarioexite= await Usuarios.findOne({
            where:{
                email: usuario.email
            }
        });
        if (usuarioexite) {
            req.flash('error', 'Este email ya esta registrado');
            res.redirect('/crear-cuenta');
        }

        await Usuarios.create(usuario);

        const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`;

        await enviarEmail.enviarEmail({
            usuario,
            url, 
            subject : 'Confirma tu cuenta de Meeti',
            archivo : 'confirmar-cuenta'
        });

        req.flash('success', 'Hemos enviado un Correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');  
    } catch (error) {
        const erroresSequelize = error.errors.map(err => err.message);
        const errExp = erroresExpress.map(err => err.msg)

        const listaErrores = [...erroresSequelize, ...errExp]

        req.flash('error', listaErrores);
        res.redirect('/crear-cuenta');
    }

};

exports.confirmarCuenta = async (req, res, next) => {
    const usuario = await Usuarios.findOne({ where : { email: req.params.correo }});
    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/crear-cuenta');
        return next();
    }
    usuario.activo = 1;
    await usuario.save();
    req.flash('success', 'La cuenta se ha confirmado, ya puedes iniciar sesión');
    res.redirect('/iniciar-sesion');
}

exports.formIniciarSesion = (req,res)=>{
    res.render('iniciar-sesion',{
        nombrePagina: 'Iniciar Sesión'
    });
};

// muestra el formulario para ediar el perfil