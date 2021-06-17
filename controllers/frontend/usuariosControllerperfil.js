const Grupos = require("../../models/Grupos");
const Usuarios = require("../../models/Usuarios");
const Meeti = require("../../models/Meeti");
const moment = require("moment");

exports.mostrarUsuario = async(req, res,next) =>{
    const consultas = [];

    consultas.push(Usuarios.findOne({where: {id: req.params.id}}));
    consultas.push(Grupos.findAll({where:{usuarioId: req.params.id}}));
    consultas.push(Meeti.findAll({where:{usuarioId: req.params.id}}))

    const [usuario, grupos, meeti] = await Promise.all(consultas);

    if (!usuario) {
        res.redirect('/');
        return next();
    }

    res.render('mostrar-perfil',{
        nombrePagina: 'Perfil del Usuario',
        usuario,
        grupos,
        meeti,
        moment
    })
}