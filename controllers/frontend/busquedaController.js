const Meeti = require('../../models/Meeti');
const Grupos = require('../../models/Grupos');
const Usuarios = require('../../models/Usuarios');
const Categorias = require('../../models/Categorias');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');


exports.resultadosBusqueda = async(req, res) =>{
    const {categoria, titulo,ciudad, pais}= req.query;
    /* let query;
    if (+categoria==='' ) {
        query= ''
    } else {
        query = `where:{
            categoriaId : {[Op.eq]: ${+categoria}}
        }`
    } */

    const consultas = [];
    consultas.push(Meeti.findAll({
        where: {
            titulo:{[Op.iLike]: '%'+titulo+'%'},
            ciudad:{[Op.iLike]: '%'+ciudad+'%'},
            pais:{[Op.iLike]: '%'+pais+'%'}
        },
        include : [
            { 
                model: Grupos,
                where:{
                    categoriaId : {[Op.eq]: +categoria}
                }
            }, 
            {
                model : Usuarios,
                attributes : ['id', 'nombre', 'imagen']
            }
        ]
    }));

    consultas.push(Categorias.findAll({}));

    const [meetis,categorias] = await Promise.all(consultas);
    console.log(consultas);

    res.render('busqueda',{
        nombrePagina:'Resultado Busqueda',
        meetis,
        categorias,
        moment
    })
}