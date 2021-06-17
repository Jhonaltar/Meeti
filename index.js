const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const path = require('path');
const router = require('./routes');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const passport = require('./config/passport');
const createError = require('http-errors');

//BD configuracion
const db = require('./config/db');
require('./models/Usuarios');
require('./models/Categorias');
require('./models/Grupos');
require('./models/Meeti');
require('./models/Comentarios');
db.sync().then(() => console.log('DB Conectada')).catch((error)=> console.log(error));

//Variables de desarrollo
require('dotenv').config({path: 'variables.env'});

//Aplicacion principal
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(expressValidator());

app.use(expressEjsLayouts);
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, './views'));

app.use(express.static('public'));

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Flash
app.use(flash());

app.use((req, res,next)=>{
    res.locals.usuario = {...req.user} || null;
    res.locals.mensajes = req.flash();
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
})

app.use('/', router());

app.use((req,res,next)=>{
    next(createError(400,'no Encontrado'));
});

app.use((error, req, res, /*!!!!*/next/*!!!*/)=>{
    const status = error.status || 500;
    res.locals.status = status;
    res.status(status);
    res.render('error',{
        nombrePagina:'Pagina no econtrada',
    });
});


//servidor y puerto
const host= '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, ()=>{
    console.log('El servidor esta funcionando');
})

/* app.listen(process.env.PORT, () =>{
    console.log('El servidor funcionando');
}) */
