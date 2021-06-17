const Grupos = require('../models/Grupos');
const Meeti = require('../models/Meeti');
const Usuarios = require('../models/Usuarios');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op=Sequelize.Op;

const uuid = require('uuid/v4');

exports.panelAdministracionMeeti = async(req, res) =>{

    const consultas = [];
    consultas.push(Grupos.findAll({ where: { usuarioId: req.user.id }}));
    consultas.push(Meeti.findAll({ where: { usuarioId: req.user.id, 
        fecha: {[Op.gte]: moment(new Date()).format("YYYY-MM-DD")}
    },  order: [['fecha', 'ASC']]
    }));
    consultas.push(Meeti.findAll({ where: { usuarioId: req.user.id, 
        fecha: {[Op.lt]: moment(new Date()).format("YYYY-MM-DD")}
    }}));
    consultas.push(Meeti.findAll({ where: {usuarioId: req.user.id}}));
    consultas.push(Usuarios.findByPk(req.user.id));
    
    const [grupos, meeti, anteriores,listameeti,usuario] = await Promise.all(consultas);

    res.render('administracion-Meeti', {
        nombrePagina: "Panel de administracion",
        tagline: "Mis Grupos",
        grupos,
        meeti,
        moment,
        anteriores,
        listameeti,
        usuario
    });
}

exports.crearMeeti= async (req, res) => {
   // obtener los datos
   const meeti = req.body;

   // asignar el usuario
   meeti.usuarioId = req.user.id;
   
   // almacena la ubicación con un point
   const point = { type : 'Point', coordinates : [ parseFloat(req.body.lat), parseFloat(req.body.lng) ] };
   meeti.ubicacion = point;

   // cupo opcional
   if(req.body.cupo === '') {
       meeti.cupo = 0;
   }

   meeti.id = uuid();
   try {
    await Meeti.create(meeti);
    req.flash('success', 'Se ha creado el meeti correctamente y se ha publicado');
    res.redirect('/administracion-Meeti');
    } catch (error) {
        // extraer el message de los errores
        const erroresSequelize = error.errors.map((err) => err.message);
        req.flash('danger', erroresSequelize);
        res.redirect('/administracion-Meeti');
    }
}

exports.sanitizarMeeti = (req, res, next) =>{
    req.sanitizeBody('titulo');
    req.sanitizeBody('invitado');
    req.sanitizeBody('cupo');
    req.sanitizeBody('fecha');
    req.sanitizeBody('hora');
    req.sanitizeBody('direccion');
    req.sanitizeBody('ciudad');
    req.sanitizeBody('estado');
    req.sanitizeBody('pais');
    req.sanitizeBody('titulo');
    req.sanitizeBody('lat');
    req.sanitizeBody('lng');
    req.sanitizeBody('grupoId');
    next();
}

exports.formEditarMeeti = async (req, res, next) =>{
    const consultas = [];
    consultas.push( Grupos.findAll({ where : { usuarioId : req.user.id }}) );
    consultas.push( Meeti.findByPk(req.params.meetiId) );
    consultas.push(Meeti.findAll({ where: {usuarioId: req.user.id}}));
    consultas.push(Usuarios.findByPk(req.user.id));

    const [ grupos, meeti,listameeti,usuario ] = await Promise.all(consultas);



    if(!grupos || !meeti ){
        req.flash('danger', 'Operación no valida');
        res.redirect('/administracion-Meeti');
        return next();
    }


    res.render('editar-meeti', {
        nombrePagina : `Editar Meeti : ${meeti.titulo}`,
        grupos, 
        meeti,
        listameeti,
        usuario
    })
}

exports.EditarMeeti = async (req, res,next)=>{
    const meeti = await Meeti.findOne({where: {id: req.params.meetiId, usuarioId : req.user.id}})

    if (!meeti) {
        req.flash('danger', 'Operación no valida');
        res.redirect('/administracion-Meeti');
        return next();
    }

    const {grupoId , titulo, invitado, fecha, hora, cupo, descripcion, direccion, ciudad, estado, pais, lat, lng} = req.body

    meeti.grupoId = grupoId;
    meeti.titulo = titulo;
    meeti.invitado = invitado;
    meeti.fecha = fecha;
    meeti.hora = hora;
    meeti.cupo = cupo;
    meeti.descripcion = descripcion;
    meeti.direccion = direccion;
    meeti.ciudad = ciudad;
    meeti.estado = estado;
    meeti.pais = pais;

    //asignar point
    const point = {type: 'Point', coordinates: [parseFloat(lat), parseFloat(lng)]};

    meeti.ubicacion = point;

    await meeti.save();
    req.flash("success", "Se ha actualizado correctamente");
    res.redirect("/administracion-Meeti");

}

exports.formEliminarMeeti = async (req, res, next) =>{
    /* const meeti = await Meeti.findOne({ where: {id: req.params.meetiId , usuarioId: req.user.id}});

    if (!meeti) {
        req.flash('danger', 'Operación no valida');
        res.redirect('/administracion-Meeti');
        return next();
    } */

    await Meeti.destroy({
        where:{ id: req.params.meetiId}
    });
    req.flash('success', 'Se ha eliminado correctamente');
    res.redirect('/administracion-Meeti')
}