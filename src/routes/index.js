const { Router } = require("express")


//Importar métodos
const usersRouter = require("./users.routes")

const extractRouter = require("./extract.routes")

const bankRouter = require("./bank.routes")

const sessionsRouter = require('./sessions.routes')


const routes = Router()

//routes use - ou seja quando query params vier com users - execute userRouter
routes.use("/users", usersRouter)
routes.use("/extract", extractRouter)
routes.use("/bank", bankRouter)
routes.use("/sessions", sessionsRouter)

//Exportar
module.exports = routes
