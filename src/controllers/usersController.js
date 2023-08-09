const { hash, compare } = require('bcryptjs')

const AppError = require('../utils/AppError')

const sqliteConnection = require('../database/sqlite')

class UsersController {
  async create(request, response) {
    const { name, cpf, email, password } = request.body

    const database = await sqliteConnection()

    if (!name || !password || !email || !cpf) {
      throw new AppError(
        'Necessário inserir nome, CPF, email e CPF para cadastro. Tente novamente!'
      )
    }

    const checkUserEmail = await database.get(
      `SELECT * FROM accountHolder WHERE email = (?)`,
      [email]
    )

    if (checkUserEmail) {
      throw new AppError('Este e-mail já está em uso!!!')
    }

    const checkUserCpf = await database.get(
      `SELECT * FROM accountHolder WHERE cpf = (?)`,
      [cpf]
    )

    if (checkUserCpf) {
      throw new AppError('Este CPF já está em uso!!!')
    }

    const hashedPassword = await hash(password, 8)

    await database.run(
      `INSERT INTO accountHolder (name, cpf, email, password) VALUES (?,?,?,?)`,
      [name, cpf, email, hashedPassword]
    )

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

    const user_account = request.user.cpf
    console.log(user_account)

    const database = await sqliteConnection()

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
