//Por já existir um método update no UsersController - Criamos um novo controller apenas para avatar - para manter consistência (Boa organização)

//Conexão com o BD
const knex = require("../database/knex")

const AppError = require("../utils/AppError")

//Função de armazenamento temporário e deleção
const DiskStorage = require("../providers/DiskStorage")

class UserAvatarController {
  //
  async update(request, response) {
    //TOKEN
    const user_account = request.user.cpf
    console.log(user_account, typeof(user_account))

    //Capturar o nome do arquivo que o usuário fez upload
    const avatarFilename = request.file.filename
    console.log(avatarFilename)

    //Instanciando classe
    const diskStorage = new DiskStorage()

    console.log(user_account.toString())

    //Capturando coluna no BD - onde account for igual ao account do TOKEN - apenas a primeira aparição
    const user = await knex("accountHolder").where({cpf: user_account.toString()}).first()
    console.log(user)
    
    if(!user) {
      throw new AppError("Somente usuários autenticados podem mudar o avatar!!!", 401)
    }

    //Já existe uma foto registrada no BD?
    //Se sim use a função de deletar (unlink) da classe DiskStorage para remover o caminho da foto do BD dos usuário autenticado - Para conseguirmos inserir uma nova
    if(user.avatar) {
      await diskStorage.deleteFile(user.avatar)
    }

    //Agora iremos salvar a foto onde antes estava na pasta TMP - agora vai para a pasta UPLOAD
    const filename = await diskStorage.saveFile(avatarFilename)
    
    
    //Aqui estou atribuindo ao avatar do user capturado a nova fota
    user.avatar = filename

    //Agora vou alterar lá no BD efetivamente alterando o avatar do user para filename (arquivo novo) - Estou basicamente criando a cópia que fiz do BD com a alteração do banco de dados e jogando no BD novamente - com a condição where para alterar apenas este usuário
    await knex("accountHolder").update(user).where({cpf: user_account.toString()})

    return response.json(user)

  }

  
  


}

module.exports = UserAvatarController
