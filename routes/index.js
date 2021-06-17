const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController'); 
const adminController = require('../controllers/adminController');
const administracionGrupo = require('../controllers/administracion-Grupo');
const administracionMeeti = require('../controllers/administracion-Meeti');

const meetiController = require('../controllers/frontend/meetiController');
const usuariosControllerperfil = require('../controllers/frontend/usuariosControllerperfil');
const gruposController = require('../controllers/frontend/gruposController');
const comentariosController = require('../controllers/frontend/comentariosController');
const busquedaController = require('../controllers/frontend/busquedaController');

module.exports =  function() {

    /* AREA PUBLICA */

    router.get('/', homeController.home);

    //muestra un meeti
    router.get('/meeti/:slug',
    meetiController.mostrarMeeti);
    /* confirma asistencia a meeti */
    router.post('/confirmar-asistencia/:slug',
    meetiController.confirmarAsistencia);
    /* muestra perfiles  */
    router.get('/usuario/:id',
    usuariosControllerperfil.mostrarUsuario)
    /* mostrar grupos */
    router.get('/grupos/:id',
    gruposController.mostrarGrupo)

    /* Mostrar meetis por categorias */
    router.get('/categoria/:categoria',
    meetiController.mostrarCategoria);
    /* Crear un comentario en el meeti */
    router.post('/meeti/:id',
    comentariosController.agregarComentario);
    /* Eliminar comentario */
    router.post('/eliminar-comentario',
    comentariosController.eliminarComentario);

    /* Añade la busqueda */
    router.get('/busqueda',
    busquedaController.resultadosBusqueda);

    /* Crear y confirmar cuenta */
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearNuevaCuenta);
    router.get('/confirmar-cuenta/:correo',usuariosController.confirmarCuenta)

    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    router.get('/cerrar-sesion',
    authController.cerrarSesion)

    /* Panel de administracion */
    router.get('/administracion', 
    authController.usuarioAutenticado,
    adminController.panelAdministracion);
    /* perfil que es union con admin */
    router.post('/editar-perfil',
    authController.usuarioAutenticado,
    adminController.subirImagen,
    adminController.fromEditarPerfil);
    router.post('/cambiar-password',
    authController.usuarioAutenticado,
    adminController.CambiarPassword);

    /*///////////// Meeti //////////////*/
    router.get('/administracion-Meeti',
    authController.usuarioAutenticado, 
    administracionMeeti.panelAdministracionMeeti);
    router.post('/nuevo-meeti',
    authController.usuarioAutenticado,
    administracionMeeti.sanitizarMeeti, 
    administracionMeeti.crearMeeti);
    router.get('/editar-meeti/:meetiId',
    authController.usuarioAutenticado,
    administracionMeeti.formEditarMeeti);
    router.post('/editar-meeti/:meetiId',
    authController.usuarioAutenticado,
    administracionMeeti.EditarMeeti);
    router.post('/eliminar-meeti/:meetiId',
    authController.usuarioAutenticado,
    administracionMeeti.formEliminarMeeti);

    /*////////// Grupo //////////////*/
    router.get('/administracion-Grupo', 
    authController.usuarioAutenticado,
    administracionGrupo.panelAdministracionGrupo);
    router.post('/nuevo-grupo',
    authController.usuarioAutenticado,
    administracionGrupo.subirImagen,
    administracionGrupo.crearGrupo);
    router.post('/editar-grupo/:grupoId',
    authController.usuarioAutenticado,
    administracionGrupo.subirImagen,
    administracionGrupo.formEditarGrupo);
    /* router.post('/editar-imggrupo/:grupoId',
    authController.usuarioAutenticado,
    administracionGrupo.subirImagen,
    administracionGrupo.formEditarGrupoimg
    ) */
    router.post('/eliminar-grupo/:grupoId',
    authController.usuarioAutenticado,
    administracionGrupo.formEliminarGrupo);

    
    return router;
}