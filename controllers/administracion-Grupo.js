const Categorias = require("../models/Categorias");
const Grupos = require("../models/Grupos");
const Meeti = require('../models/Meeti');
const Usuarios = require('../models/Usuarios');

const uuid = require('uuid/v4');

const multer = require("multer");
const shortid = require("shortid");
const fs = require("fs");

const configuracionMulter = {
    limits: { fileSize: 250000 },
    storage: (fileStorage = multer.diskStorage({
        destination: (req, file, next) => {
            next(null, __dirname + "/../public/uploads/grupos/");
        },
        filename: (req, file, next) => {
            const extension = file.mimetype.split("/")[1];
            next(null, `${shortid.generate()}.${extension}`);
        },
    })),
    fileFilter(req, file, next) {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            next(null, true);
        } else {
            next(new Error("Formato no valido, solamente con (jpeg y png)"), false);
        }
    },
};

const upload = multer(configuracionMulter).single("imagen");

exports.subirImagen = (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            console.log(error);
            if (error instanceof multer.MulterError) {
                if (error.code === "LIMIT_FILE_SIZE") {
                    req.flash("danger", "El tamaño de la foto es muy grande");
                } else {
                    req.flash("danger", error.message);
                }
            } else if (error.hasOwnProperty("message")) {
                req.flash("danger", error.message);
            }
            res.redirect("back");
            return;
        } else {
            next();
        }
    });
};

exports.panelAdministracionGrupo = async (req, res) => {
    /* const listagrupo = await Grupos.findAll({ where: {usuarioId: req.user.id}})
      const categorias = await Categorias.findAll(); */

    const consultas = [];
    consultas.push(Grupos.findAll({ where: { usuarioId: req.user.id } , order: [['createdAt', 'ASC']] }));
    consultas.push(Categorias.findAll());
    consultas.push(Meeti.findAll({ where: {usuarioId: req.user.id}}));
    consultas.push(Usuarios.findByPk(req.user.id));

    const [listagrupo, categorias, listameeti,usuario] = await Promise.all(consultas);
 
    res.render("administracion-Grupo", {
        nombrePagina: "Panel de administracion",
        tagline: "Mis Grupos",
        categorias,
        listagrupo,
        listameeti,
        usuario
    });
};

exports.crearGrupo = async (req, res) => {
    req.sanitizeBody("nombre");
    req.sanitizeBody("url");
    const grupo = req.body;
    grupo.usuarioId = req.user.id;
    if (req.file) {
        grupo.imagen = req.file.filename;
    }
    grupo.id = uuid();
    try {
        await Grupos.create(grupo);
        req.flash("success", "Se ha creado el grupo correctamente");
        res.redirect("/administracion-Grupo");
    } catch (error) {
        const erroresSequelize = error.errors.map((err) => err.message);
        req.flash("danger", erroresSequelize);
        res.redirect("/administracion-Grupo");
    }
};

exports.formEditarGrupo = async (req, res, next) => {
    const grupo = await Grupos.findOne({
        where: { id: req.params.grupoId, usuarioId: req.user.id },
    });

    if (!grupo) {
        req.flash("danger", "Ejecucion no valida");
        res.redirect("/administracion-Grupo");
        return next();
    }
    const { nombre, descripcion, categoriaId, url } = req.body;
    grupo.nombre = nombre;
    grupo.descripcion = descripcion;
    grupo.categoriaId = categoriaId;
    grupo.url = url;

    if(req.file && grupo.imagen) {
        const imagenAnteriorPath = __dirname + `/../public/uploads/grupos/${grupo.imagen}`;
        fs.unlink(imagenAnteriorPath, (error) => {
            if(error) {
                console.log(error);
            }
            return;
        })
    }

    if(req.file) {
        grupo.imagen = req.file.filename;
    }

    await grupo.save();
    req.flash("success", "Se ha actualizado correctamente");
    res.redirect("/administracion-Grupo");
};

exports.formEliminarGrupo = async (req, res,next)=>{
    const grupo = await Grupos.findOne({ Where: {id: req.params.grupoId , usuarioId: req.user.id}});
    if (!grupo) {
        req.flash('danger','Ejecucion no valida');
        res.redirect("/administracion-Grupo");
        return next();
    }
    if(grupo.imagen) {
        const imagenAnteriorPath = __dirname + `/../public/uploads/grupos/${grupo.imagen}`;
        fs.unlink(imagenAnteriorPath, (error) => {
            if(error) {
                console.log(error);
            }
            return;
        });
        console.log('imagen',imagenAnteriorPath);
    }
    console.log('nombre',grupo.nombre);
    
    await Grupos.destroy({
        where: {
            id: req.params.grupoId,
            imagen: grupo.imagen
        }
    });
    req.flash('success', 'Se ha eliminado correctamente');
    res.redirect('/administracion-Grupo')
}

/* exports.formEditarGrupoimg = async (req, res, next) => {
    const grupo = await Grupos.findOne({
        where: { id: req.params.grupoId, usuarioId: req.user.id },
    });
    if (!grupo) {
        req.flash("danger", "Ejecucion no valida");
        res.redirect("/administracion-Grupo");
        return next();
    }
    if (req.file && grupo.imagen) {
        const imagenAnteriorPath =
            __dirname + `/../public/uploads/grupos/${grupo.imagen}`;
        fs.unlink(imagenAnteriorPath, (error) => {
            if (error) {
                console.log(error);
            }
            return;
        });
    }

    if (req.file) {
        grupo.imagen = req.file.filename;
    }

    await grupo.save();
    req.flash("success", "Se actualizo la imagen Correctamente");
    res.redirect("/administracion-Grupo");
}; */
