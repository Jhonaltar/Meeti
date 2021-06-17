const Grupos = require('../models/Grupos');
const Meeti = require('../models/Meeti');
const Usuarios = require('../models/Usuarios');

const multer = require("multer");
const shortid = require("shortid");
const fs = require("fs");

const configuracionMulter = {
    limits: { fileSize: 250000 },
    storage: (fileStorage = multer.diskStorage({
        destination: (req, file, next) => {
            next(null, __dirname + "/../public/uploads/perfiles/");
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

exports.panelAdministracion = async(req, res) =>{
    const consultas = [];

    consultas.push(Grupos.findAll({ where: {usuarioId: req.user.id}}));
    consultas.push(Meeti.findAll({ where: {usuarioId: req.user.id}}));
    consultas.push(Usuarios.findByPk(req.user.id))

    const [listagrupo, listameeti, usuario] = await Promise.all(consultas);

    //const listagrupo = await Grupos.findAll({ where: {usuarioId: req.user.id}});
    res.render('adminstracion',{
        nombrePagina: 'Panel de administracion',
        tagline: 'Perfil',
        listagrupo,
        listameeti,
        usuario
    })
}

exports.fromEditarPerfil = async (req, res)=>{
    const usuario = await Usuarios.findByPk(req.user.id);

    req.sanitizeBody('nombre');
    req.sanitizeBody('email');

    const { nombre, descripcion, email } = req. body;

    usuario.nombre = nombre;
    usuario.descripcion = descripcion;
    usuario.email = email;

    console.log(req.file);

    if(req.file && usuario.imagen) {
        const imagenAnteriorPath = __dirname + `/../public/uploads/perfiles/${usuario.imagen}`;
        fs.unlink(imagenAnteriorPath, (error) => {
            if(error) {
                console.log(error);
            }
            return;
        })
    }

    if(req.file) {
        usuario.imagen = req.file.filename;
    }
    /* console.log(req.file.filename); */

    await usuario.save();
    req.flash("success", "Se ha actualizado correctamente");
    res.redirect("/administracion");
}

//Revisar si el password anterior es correcto y lo modifica por uno nuevo.

exports.CambiarPassword= async(req, res, next)=>{
    const usuario = await Usuarios.findByPk(req.user.id);

    //verificar que el password anterior sea correcto
    if (! usuario.validarPassword(req.body.anterior)) {
        req.flash('danger', 'El password actual es incorrecto')
        res.redirect('/administracion');
        return next();
    }
    //si el password es correcto, hashear el nuevo
    const hash = usuario.hashPassword(req.body.nuevo);
    //asignar el password al usuario
    usuario.password = hash;
    await usuario.save();
    req.logout();
    req.flash("success", "Password se ha actualizado correctamente, vuelve iniciar sesion");
    res.redirect("/iniciar-sesion");
}