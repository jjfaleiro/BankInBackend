//Desestruturar router
const { Router } = require('express')

//Importar o multer (gerente de rotas do arquivos dentro da aplicação)
const multer = require("multer")

//Configurações de upload
const uploadConfig = require("../configs/upload")

//Instanciar/executar router
const usersRoutes = Router()

//Instanciar o multer - através das configurações do upload .MULTER (Onde estão as configurações iniciais do Upload - desta forma conseguimos alterar as coisas de forma mais flexível - ao alterar apenas está parte do MULTER DE DENTRO DAS CONFIGURAÇÕES)
const upload = multer(uploadConfig.MULTER)

//Importando classe
const UsersController = require('../controllers/usersController')
const UserAvatarController = require('../controllers/UserAvatarController')

const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

//Instanciando classe para utilizar suas funções
const usersController = new UsersController()
const userAvatarController = new UserAvatarController()

//Não precisa pois nem conta ele tem então não precisa de verificação
usersRoutes.post('/', usersController.create)
//Precisa verificar para fazer atualizações - não precisa mais do account pois o middleware já verifica isto
//PUT - atualiza mais de uma campo em uma tabela
usersRoutes.put('/', ensureAuthenticated, usersController.update)

//PATCH - atualiza apenas UM campo  especifico numa tabela - esta rota será para atualizar a imagem do usuário/avatar - Aqui não iremos efetivamente guardar/salvar dentro do BD a imagem (pois ela é pesada e não convém guardar no BD) - A imagem será guardada numa pasta - e dentro do banco de dados será guardado a REFERÊNCIA (Endereço de onde a imagem está armazenada - tendo este endereço conseguimos localiza-la e carrega-la)
usersRoutes.patch('/avatar', ensureAuthenticated, upload.single("avatar"), userAvatarController.update)
//single - pq quero carregar apenas um arquivo o nomeando como avatar

//Exportando
module.exports = usersRoutes
