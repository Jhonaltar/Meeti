const slug = require("slug");
const Categorias = require("../models/Categorias");
const Meeti = require("../models/Meeti");
const moment = require("moment");
const Sequelize = require("sequelize");
const Grupos = require("../models/Grupos");
const Usuarios = require("../models/Usuarios");
const Op = Sequelize.Op;

exports.home = async (req, res) => {
  const consultas = [];
  consultas.push(Categorias.findAll({}));
  consultas.push(
    Meeti.findAll({
      where: { fecha: { [Op.gte]: moment(new Date()).format("YYYY-MM-DD") } },
      limit: 3,
      attributes: ["slug", "titulo", "fecha", "hora"],
      order: [["fecha", "ASC"]],
      include: [
          { model: Grupos, attributes: ['imagen'] },
          { model: Usuarios, attributes: ['nombre','imagen'] }
        ],
    })
  );
  consultas.push(
    Meeti.findAll({
      where: { fecha: { [Op.gte]: moment(new Date()).format("YYYY-MM-DD") } },
      attributes: ["slug", "titulo", "fecha", "hora"],
      order: [["fecha", "ASC"]],
      include: [
          { model: Grupos, attributes: ['imagen'] },
          { model: Usuarios, attributes: ['nombre','imagen'] }
        ],
    })
  );

  const [categorias, meetisheroSlider, meetis] = await Promise.all(consultas);

  res.render("home", {
    nombrePagina: "Inicio",
    categorias,
    meetisheroSlider,
    meetis,
    moment
  });
};
