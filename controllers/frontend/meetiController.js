const Meeti = require("../../models/Meeti");
const Grupos = require("../../models/Grupos");
const Usuarios = require("../../models/Usuarios");
const Categorias = require("../../models/Categorias");
const Comentarios = require("../../models/Comentarios");
const moment = require("moment");
const Sequelize = require('sequelize');
const Op=Sequelize.Op;

exports.mostrarMeeti = async (req, res) => {
  const meeti = await Meeti.findOne({
    where: { slug: req.params.slug },
    include: [{ model: Grupos }, { model: Usuarios, attributes: ['id', 'nombre', 'imagen'] }],
  });

  const meetiintersesados = await Meeti.findOne({ where: { slug: req.params.slug }, attributes: ['interesados'] });

  const { interesados } = meetiintersesados;

  const asistentes = await Usuarios.findAll({ attributes: ['id', 'nombre', 'imagen', 'email'], where: { id: interesados } });

  if (!meeti) {
    res.redirect('/');
  }

 // Consultar por meeti's cercanos
 const ubicacion = Sequelize.literal(`ST_GeomFromText( 'POINT( ${meeti.ubicacion.coordinates[0]} ${meeti.ubicacion.coordinates[1]} )' )`);

 // ST_DISTANCE_Sphere = Retorna una linea en metros
 const distancia = Sequelize.fn('ST_DistanceSphere', Sequelize.col('ubicacion'), ubicacion);

 // encontrar meeti's cercanos
 const cercanos = await Meeti.findAll({
     order: distancia, // los ordena del mas cercano al lejano
     where : Sequelize.where(distancia, { [Op.lte] : 100 } ), // 2 mil metros o 2km
     limit: 3, // maximo 3
     offset: 1, 
     include : [
         { 
             model: Grupos
         }, 
         {
             model : Usuarios,
             attributes : ['id', 'nombre', 'imagen']
         }
     ]
 }) 


  const comentarios = await Comentarios.findAll({where:{meetiId: meeti.id }, include:[{model: Usuarios, attributes: ['id', 'nombre', 'imagen', 'email']}]});

  res.render('mostrar-meeti', {
    nombrePagina: meeti.titulo,
    meeti,
    moment,
    asistentes,
    comentarios,
    cercanos
  })

};


exports.confirmarAsistencia = async (req, res) => {

  const { accion } = req.body

  if (accion === 'confirmar') {
    Meeti.update(
      { 'interesados': Sequelize.fn('array_append', Sequelize.col('interesados'), req.user.id) },
      { 'where': { 'slug': req.params.slug } }
    );
    res.json('Has confirmado tu asustencia');
  } else {
    Meeti.update(
      { 'interesados': Sequelize.fn('array_remove', Sequelize.col('interesados'), req.user.id) },
      { 'where': { 'slug': req.params.slug } }
    );
    res.send('Has cancelado tu asustencia')
  }

}


exports.mostrarCategoria = async (req, res, next) => {
  const categoria = await Categorias.findOne({
    attributes: ['id','nombre'],
    where: { slug: req.params.categoria },
  });

  const meetis = await Meeti.findAll({
      order:[['fecha','ASC'],[['hora','ASC']]],
      include:[
        {
        model: Grupos,
        where: {categoriaId: categoria.id}
        },
        {
          model: Usuarios
        }
    ]
  });

  res.render('categoria',{
    nombrePagina:'Categoria',
    meetis,
    moment,
    categoria
  })

};