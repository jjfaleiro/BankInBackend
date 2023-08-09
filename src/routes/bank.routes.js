//Desestruturar router
const { Router } = require("express")

const ensureAuthenticated = require('../middlewares/ensureAuthenticated')


//Instanciar/executar router
const bankRoutes = Router()

// bankRoutes.use(ensureAuthenticated)

//Importando classe
const bankController = require("../controllers/bankController")//*

//Instanciando classe para utilizar suas funções
const BankController = new bankController()

bankRoutes.put("/", BankController.update)

// bankRoutes.put("/:account", BankController.update)

//Exportando
module.exports = bankRoutes