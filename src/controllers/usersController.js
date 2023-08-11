const { hash, compare } = require('bcryptjs')

const AppError = require('../utils/AppError')

//Está sendo utilizado no update
const sqliteConnection = require('../database/sqlite')

//Nova lógica de verificação - e criação - conexão com o bd
const UserRepository = require('../repositories/userRepository')


class UsersController {
  async create(request, response) {
    const { name, cpf, email, password } = request.body
    
    //Instanciando a nova lógica de verificação de email, cpf e criação/update - com conexão com o db
    const userRepository = new UserRepository()


    if (!name || !password || !email || !cpf) {
      throw new AppError(
        'Necessário inserir nome, CPF, email e CPF para cadastro. Tente novamente!'
      )
    }

    const checkUserCpf = await userRepository.findByCPF(cpf)

    const checkUserEmail = await userRepository.findByEmail(email)


    if (checkUserCpf) {
      throw new AppError('Este CPF já está em uso!!!')
    }

    if (checkUserEmail) {
      throw new AppError('Este e-mail já está em uso!!!')
    }

    const hashedPassword = await hash(password, 8)

    await userRepository.create({name, cpf, email, password: hashedPassword})


    return response.status(201).json({
      message: 'Correntista cadastrado com sucesso!!! Bem vindo ao BankIn!'
    })
  }

  async update(request, response) {
    const {name, cpf, email, password, passwordCheck, old_password} = request.body

    console.log(name,cpf,email,password,old_password)

    //const { account } = request.params
    //Agora capturo a conta do usuário de dentro do middleware
    // const user_account = request.user.account

    //Instanciando a nova lógica de verificaçã de email, cpf e criação/update
    const database = new sqliteConnection()

    const user_account = request.user.cpf
    console.log(user_account)


    const accountExist = await database.get(`SELECT * FROM accountHolder WHERE cpf = (?)`, [user_account.toString()]) 

    if(!accountExist) {
      throw new AppError(`Conta informada ${accountExist} não existe !!!`)
    }
    
    if(!name || !cpf) {
      throw new AppError(`Necessário informar nome e cpf para validar alterações!!!`)
    }

    const checkingNameAndCPF = await database.get(`SELECT * FROM accountHolder WHERE name = (?) AND cpf = (?)`, [ name, cpf ])

    if(!checkingNameAndCPF) {
      throw new AppError(`Nome ou CPF estão incorretos. Tente Novamente!`)
    }


    const userWithUpdateEmail = await database.get(`SELECT * FROM accountHolder WHERE email = (?)`, [email])

    if(userWithUpdateEmail && userWithUpdateEmail.account !== accountExist.account) {
      throw new AppError(`Este e-mail já está em uso por outro usuário!!!`)
    }

    accountExist.email = email ?? accountExist.email

    if(!old_password) {
      throw new AppError(`Você precisa informar a senha atual para alterar email!!!`)
    }

    if(password && passwordCheck) {
      const comparePasswords = password === passwordCheck 
      if(!comparePasswords) {
        throw new AppError("Erro - senhas inseridas para alteração não estão iguais!!!")
      }
    }

    if(password && passwordCheck && old_password) {
      const checkOldPassword = await compare(old_password, accountExist.password)

      if(!checkOldPassword) {
        throw new AppError(`A senha atual está incorreta`)
      }

      accountExist.password = await hash(password, 8)
    }

    

    await database.run(`UPDATE accountHolder SET email = (?), password = (?), updated_at = DATETIME('now') WHERE cpf = (?)`, [accountExist.email, accountExist.password, user_account.toString()])

    const user = await database.get(`SELECT * FROM accountHolder WHERE cpf = (?)`, [user_account.toString()])

    console.log(user)
 
    return response.json(user)
  }
}

module.exports = UsersController
