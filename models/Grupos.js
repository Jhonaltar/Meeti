const Sequelize = require('sequelize');
const db = require('../config/db');
/* const uuid = require('uuid/v4'); */
const Categorias = require('./Categorias');
const Usuarios = require('./Usuarios');

const Grupos = db.define('grupos', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
    }, 
    nombre: {
        type: Sequelize.TEXT, 
        allowNull: false, 
        validate: {
            notEmpty: {
                msg: 'El nombre del grupo no puede ir vacio'
            }
        }
    },
    descripcion: {
        type: Sequelize.TEXT,
        allowNull: false, 
        validate : {
            notEmpty: {
                msg: 'La descripcion del grupo no puede ir vacio'
            }
        }
    },
    url: Sequelize.TEXT, 
    imagen: Sequelize.TEXT
})

Grupos.belongsTo(Categorias);
Grupos.belongsTo(Usuarios);

module.exports = Grupos;