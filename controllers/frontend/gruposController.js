const Grupos = require("../../models/Grupos");
const Meeti = require("../../models/Meeti");
const moment = require("moment");
const Sequelize = require('sequelize');
const Op=Sequelize.Op;

exports.mostrarGrupo= async (req,res,next)=>{
    consultas =  [];
    
    consultas.push( Grupos.findOne({ where: {id: req.params.id}}));
    /* consultas.push( Meeti.findAll({where:{grupoId: req.params.id}, order:[['fecha', 'ASC']]})) */

    consultas.push(Meeti.findAll({ where: { grupoId: req.params.id, 
        fecha: {[Op.gte]: moment(new Date()).format("YYYY-MM-DD")}
    },  order: [['fecha', 'ASC']]
    }));
    consultas.push(Meeti.findAll({ where: { grupoId: req.params.id, 
        fecha: {[Op.lt]: moment(new Date()).format("YYYY-MM-DD")}
    }}));

    const [grupo, meetis, anteriores] = await Promise.all(consultas);

    if (!grupo) {
        res.redirect('/');
        return next();
    }

    res.render('mostrar-grupo',{
        nombrePagina:'Grupos Creados',
        grupo,
        meetis,
        anteriores,
        moment
    })
}