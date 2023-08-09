//Importando antes de tudo o nosso arquivo .env (Que irá armazenar as variáveis sensiveis da nossa aplicação)
require("dotenv/config")

//Biblioteca de erros
require("express-async-errors")

//Importando migration/index.js
const migrationsRun = require('./database/sqlite/migrations')

//Importando a classe AppError
const AppError = require("./utils/AppError")

//Importando o express
const express  = require('express')

//Importando o cors
const cors = require('cors')

//Importar routes
const routes = require("./routes")

//Importar configurações de upload
const uploadConfigs = require("./configs/upload")

//Inicializando o express
const app = express()

//App use a biblioteca cors
app.use(cors())

//Receber dados em json
app.use(express.json())


//Ou seja app use routes
app.use(routes)

//Use a rota files - e utilize a funcionalidade dentro da biblioteca express STATIC que serve ARQUIVOS estáticos para o servidor - sendo eles os ARQUIVOS que estão dentro da pasta UPLOAD
app.use("/files", express.static(uploadConfigs.UPLOADS_FOLDER))

//Iniciando meu banco de dados
migrationsRun()

//Executando a biblioteca error
app.use((error, request, response, next) => {
  
  //NA REALIDADE O INSTANCEOF verifica SE HOUVE INSTANCIAMENTO/CONSTRUTOR DO AppError - Se houve é porque foi erro do usuário - sendo assim ele executa o código abaixo
  //O error VEIO DE UMA INSTANCIA DO AppError?
  if (error instanceof AppError) {
    
    return response.status(error.statusCode).json({
      
      status: 'error',
      
      message: error.message
    })
  }
  
  console.error(`O erro está aqui JJ:  ${error}`)

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
})


//const Porta do app
const PORT = process.env.PORT || 3333 

//Acesse o .env ou porta 3000

//Ouvidor
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))

