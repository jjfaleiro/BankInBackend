//Desestruturar router
const { Router } = require("express")

const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

//Instanciar/executar router
const extractRoutes = Router()

//Ou seja o middleware será usado em todas as rotas
// extractRoutes.use(ensureAuthenticated)

//Importando classe
const extractController = require("../controllers/extractController")//*

//Instanciando classe para utilizar suas funções
const ExtractController = new extractController()


//Autenticação do token
extractRoutes.post("/",ensureAuthenticated, ExtractController.create)

//Autenticação do token
extractRoutes.put("/",ensureAuthenticated, ExtractController.update)

//Mostrar Extratos
extractRoutes.get("/",ensureAuthenticated, ExtractController.index)


//Exportando
module.exports = extractRoutes