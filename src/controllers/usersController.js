const { hash, compare } = require('bcryptjs')

const AppError = require('../utils/AppError')

//Está sendo utilizado no update
const sqliteConnection = require('../database/sqlite')

//Conexão com o bd
const UserRepository = require('../repositories/userRepository')

//Abstração da lógica da minha aplicação sem dependência
const UserCreateService = require('../services/userCreateService')

class UsersController {
  async create(request, response) {
    //Ou seja esta ficando literalmente só a requisição e resposta
    const { name, cpf, email, password } = request.body

    //Instanciando o minha conexão com o BD
    const userRepository = new UserRepository()

    //Instanciando a abstração da lógica da minha aplicação sem dependência - passando para meu construtor qual será a conexão com o BD seja ela qual for
    const userCreateService = new UserCreateService(userRepository)

    //Agora vou executar minha lógica de fato - que já estará utilizando a conexão com o bd de forma abstrata
    await userCreateService.execute({name, cpf, email, password})

    return response.status(201).json({
      message: 'Correntista cadastrado com sucesso!!! Bem vindo ao BankIn!'
    })
  }

  async update(request, response) {
    const { name, cpf, email, password, passwordCheck, old_password } =
      request.body

    console.log("Só chegou aqui" + name, cpf, email, password, old_password)

    //const { account } = request.params
    //Agora capturo a conta do usuário de dentro do middleware
    // const user_account = request.user.account

    //Instanciando a nova lógica de verificaçã de email, cpf e criação/update
    const database = await sqliteConnection() 

    const user_account = request.user.cpf
    console.log(`Passou aqui ${user_account}`)

    const accountExist = await database.get(
      `SELECT * FROM accountHolder WHERE cpf = (?)`,
      [user_account.toString()]
    )
    console.log(`Passou aqui 2`)

    if (!accountExist) {
      throw new AppError(`Conta informada ${accountExist} não existe !!!`)
    }

    if (!name || !cpf) {
      throw new AppError(
        `Necessário informar nome e cpf para validar alterações!!!`
      )
    }

    const checkingNameAndCPF = await database.get(
      `SELECT * FROM accountHolder WHERE name = (?) AND cpf = (?)`,
      [name, cpf]
    )

    if (!checkingNameAndCPF) {
      throw new AppError(`Nome ou CPF estão incorretos. Tente Novamente!`)
    }

    const userWithUpdateEmail = await database.get(
      `SELECT * FROM accountHolder WHERE email = (?)`,
      [email]
    )

    if (
      userWithUpdateEmail &&
      userWithUpdateEmail.account !== accountExist.account
    ) {
      throw new AppError(`Este e-mail já está em uso por outro usuário!!!`)
    }

    accountExist.email = email ?? accountExist.email

    if (!old_password) {
      throw new AppError(
        `Você precisa informar a senha atual para alterar email!!!`
      )
    }

    if (password && passwordCheck) {
      const comparePasswords = password === passwordCheck
      if (!comparePasswords) {
        throw new AppError(
          'Erro - senhas inseridas para alteração não estão iguais!!!'
        )
      }
    }

    if (password && passwordCheck && old_password) {
      const checkOldPassword = await compare(
        old_password,
        accountExist.password
      )

      if (!checkOldPassword) {
        throw new AppError(`A senha atual está incorreta`)
      }

      accountExist.password = await hash(password, 8)
    }

    await database.run(
      `UPDATE accountHolder SET email = (?), password = (?), updated_at = DATETIME('now') WHERE cpf = (?)`,
      [accountExist.email, accountExist.password, user_account.toString()]
    )

    const user = await database.get(
      `SELECT * FROM accountHolder WHERE cpf = (?)`,
      [user_account.toString()]
    )

    console.log(user)

    return response.json(user)
  }
}

module.exports = UsersController
