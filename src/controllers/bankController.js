const { compare } = require('bcryptjs')

const AppError = require('../utils/AppError')

const extractController = require('../controllers/extractController') //*

//Instanciando classe para utilizar suas funções
const ExtractController = new extractController()

const sqliteConnection = require('../database/sqlite')
// const knex = require('../database/knex')

class BankController {
  async update(request, response) {
    const { account, deposit, password } = request.body

    const database = await sqliteConnection()

    const accountExist = await database.get(
      'SELECT * FROM accountHolder WHERE account = (?)',
      [account]
    )

    if (!accountExist) {
      throw new AppError('Conta inserida é inexistente. Tente novamente!')
    }

    const checkingPassword = await compare(password, accountExist.password)

    if (!checkingPassword) {
      throw new AppError('Senha inserida está incorreta. Tente novamente!')
    }

    const checkingDeposit = deposit > 0 ? true : false

    if (checkingDeposit === false) {
      throw new AppError(
        'Valor inserido é invalido. Valores permitidos: acima de 0!'
      )
    }

    const bank = await database.get(`SELECT * FROM bank WHERE id = (?);`, [
      accountExist.bank_id
    ])

    await database.run(`UPDATE bank SET deposit = (?) WHERE id = (?);`, [
      deposit,
      bank.id
    ])

    // const sumDepositBalance = accountExist.balance + deposit

    // await database.run(
    //   `UPDATE accountHolder SET balance = (?) WHERE account = (?);`,
    //   [sumDepositBalance, account]
    // )

    ExtractController.create({
      cpf: accountExist.cpf,
      debts: deposit,
      description: 'Deposito'
    })

    bank.deposit = 0

    await database.run(`UPDATE bank SET deposit = (?) WHERE id = (?);`, [
      bank.deposit,
      bank.id
    ])

    return response
      .status(200)
      .json({ message: 'deposito efetuado com sucesso!!!' })
  }
}

module.exports = BankController
