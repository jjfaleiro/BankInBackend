const { compare } = require('bcryptjs')

const AppError = require('../utils/AppError')

const knex = require('../database/knex')

class ExtractController {
  async create(request, response) {
    //Recebendo o valor do débito e a descrição do corpo da requisição
    //Como receber isto de outra função? I
    const { cpf, debts, description, destinationAccount, recipientCPF } =
      request.body ?? request

    if (!destinationAccount || !recipientCPF) {
      // console.log(
      //   `user_account ${user_account} - debts ${debts} - descrição ${description} - conta destino ${destinationAccount} - cpf ${recipientCPF}`
      // )

      // const database = await sqliteConnection()

      // const destinationAccount = request ?? 0

      //Ou seja se os valores forem os padrões pq não foram inseridos então execute apenas a criação do extrato da pessoa que requisitou
      // if (destinationAccount === 0 || recipientCPF === '0') {
      //Armazenando TOKEN
      // const user_accountx = request.user.account ?? user_account
      //Ou seja se user_account for diferente de zero quer dizer que a requisição é callback sendo assim é oriunda de transferência
      //Se for igual a zero ela veio da criação de um extrato normal - então pegue o token
      // const user_accountx = user_account === 0 ? request.user.account : user_account
      const user = !cpf ? request.user.cpf : cpf

      //Capturando a coluna em JSON - Saldo
      const balance = await knex('accountHolder')
        .select('balance')
        .where('cpf', user.toString())

      //Transformar em number o Saldo
      const saldo = balance.map(saldoInNumber => {
        return saldoInNumber.balance
      })
      // console.log(`Valor do balance ${saldo} e o tipo: ${typeof saldo}`)

      //Transformando JSON em string
      const resulted = JSON.stringify(saldo[0])
      // console.log(`AKI: ${resulted} e o tipo ${typeof resulted}`)
      const result = parseInt(resulted)
      // console.log(`SERÁ: ${result} e o tipo ${typeof result}`)

      //Armazenando o valor original do Saldo
      const previousBalance = result

      //Armazenando o valor resultante da operação com o Novo Saldo
      const currentBalance = previousBalance + debts

      //Aqui estou atualizando o Saldo após operação
      await knex('accountHolder')
        .select('balance')
        .where('cpf', user.toString())
        .update('balance', currentBalance)

      //Capturando o id do user_account
      const accountUser = await knex('accountHolder')
        .select('account')
        .where('cpf', user.toString())

      const account_id = accountUser[0].account

      //Inserindo info necessárias para o extract - incluindo a FK - Ou seja criando o extrato
      const [id] = await knex('extract').insert({
        account_id,
        currentBalance,
        debts,
        description,
        previousBalance
      })

      // if(user === 0) {
      //   return response.status(200).json({"message": "Débito efetuado com sucesso"})
      // }

      // return //response.status(200).json({"message": "Débito A"})

      if (!cpf) {
        return response
          .status(200)
          .json({ message: 'Débito efetuado com sucesso' })
      }

      return
    }

    //Caso destinationAccount e recipientCPF recebam valores

    //Pego o user_acount e atribuo o destination account
    const accountDestination = destinationAccount

    const balance = await knex('accountHolder')
      .select('balance')
      .where('account', accountDestination)

    //Transformar em number o Saldo
    const saldo = balance.map(saldoInNumber => {
      return saldoInNumber.balance
    })
    console.log(`Valor do balance ${saldo}`)

    // Transformando JSON em string
    const resulted = JSON.stringify(saldo[0])
    const result = parseInt(resulted)
    // console.log(`SERÁ: ${result}`)

    //Armazenando o valor original do Saldo
    const previousBalance = result

    //Armazenando o valor resultante da operação com o Novo Saldo
    const currentBalance = previousBalance + debts

    //Aqui estou atualizando o Saldo após operação
    await knex('accountHolder')
      .select('balance')
      .where('account', accountDestination)
      .update('balance', currentBalance)

    //Capturando o id do accountDestination
    const account_id = accountDestination

    //Inserindo info necessárias para o extract - incluindo a FK - Ou seja criando o extrato
    const [id] = await knex('extract').insert({
      account_id,
      currentBalance,
      debts,
      description,
      previousBalance
    })

    return //response.status(200).json({"message": "Débito B"})
  }

  async update(request, response) {
    const { destinationAccount, recipientCPF, value, password } = request.body

    const user_account = request.user.cpf

    console.log(user_account) 

    // user_account = parseInt(user_account, 10)

    if (!destinationAccount) {
      throw new AppError('Necessário inserir uma conta destino')
    }

    const accountExist = await knex('accountHolder').where(
      'account',
      destinationAccount
    )

    if (!accountExist) {
      throw new AppError('Conta destino inexistente. tente novamente!!!')
    } else if (destinationAccount === user_account) {
      throw new AppError(
        'Conta inserida é a mesma do usuário. tente novamente!!!'
      )
    }

    if (!recipientCPF) {
      throw new AppError(
        'Necessário inserir um cpf para validação da transferência!!!'
      )
    }

    // const cpfExistTestTest = await knex('accountHolder').where('cpf', recipientCPF)
    const cpfExist1 = await knex('accountHolder').where('cpf', recipientCPF) //.then(numb => { return numb[0].cpf})

    const cpfExistTest = cpfExist1.length

    if (cpfExistTest === 0) { 
      throw new AppError('CPF do destinatário não existe')
    }

    console.log('Erro tipo I')

    const cpfExist2 = await knex('accountHolder')
      .where('cpf', recipientCPF)
      .select('cpf')
      .then(numb => {
        return numb[0].cpf
      })

    console.log('Erro tipo II')

    // const cpfExistUser = await knex('accountHolder')
    //   .where('cpf', user_account)
    //   .select('cpf')
    //   .then(numb => {
    //     return numb[0].cpf
    //   })

    // console.log(cpfExist1)
    // console.log(cpfExist2)
    // console.log(cpfExistUser)
    // console.log(cpfExistTest)

    if (cpfExist2 === user_account) {
      throw new AppError('Está inserindo o próprio CPF. Tente novamente!')
    }

    if (!value) {
      throw new AppError(
        'Precisa informar um valor para efetuar a transferência'
      )
    }

    const checkingTransfer = value > 0 ? true : false

    if (checkingTransfer === false) {
      throw new AppError(
        'Valor inserido é invalido. Valores permitidos: acima de 0!'
      )
    }

    const money = await knex('accountHolder')
      .where('cpf', user_account.toString())
      .then(user => user[0].balance)

      console.log(money)
      console.log(value)
      
      const insufficientValue = value > money
      console.log(insufficientValue)

    if(insufficientValue === true) {
      console.log("Entrou pai")
      throw new AppError(
        'Valor inserido é insuficiente. Faça um deposito para completar o valor!'
      )
      // console.log("Estranho")

    }

    if (!password) {
      throw new AppError('Insira uma senha para confirmar a transferência')
    }

    const passwordExist = await knex('accountHolder')
      .where('cpf', user_account.toString())
      .select('password')
      .then(pass => {
        return pass[0].password
      })

    console.log('Erro tipo III')

    const checkingPassword = await compare(password, passwordExist)

    if (!checkingPassword) {
      throw new AppError('Senha inserida está incorreta. Tente novamente!')
    }

    const balanceUser = await knex('accountHolder')
      .where('cpf', user_account.toString())
      .then(user => user[0].balance)
    console.log(`Saldo do usuário ${balanceUser}`)

    const balanceDestinationAccount = await knex('accountHolder')
      .where('cpf', recipientCPF)
      .then(user => user[0].balance)
    console.log(`Saldo do destinatário ${balanceDestinationAccount}`)

    const sub = balanceUser - value
    const sum = balanceDestinationAccount + value

    console.log(`Aqui e a subtração ${sub}`)
    console.log(`Aqui e a soma ${sum}`)

    //Instanciando classe para utilizar suas funções
    const extractController = new ExtractController()

    console.log(`Error ABC`)

    //Extrato para a pessoa fazendo a transferência
    extractController.create({
      cpf: user_account.toString(),
      debts: -value,
      description: 'Transferência realizada'
    })

    console.log(`Error XYZ`)

    //Extrato para a pessoa recebendo a transferência
    extractController.create({
      debts: value,
      description: 'Transferência recebida',
      destinationAccount: destinationAccount,
      recipientCPF: recipientCPF
    })

    await knex('accountHolder')
      .select('balance')
      .where('cpf', user_account)
      .update('balance', sub)

    await knex('accountHolder')
      .select('balance')
      .where('account', destinationAccount)
      .update('balance', sum)

    console.log(`Error WWW`)

    return response.status(200).json({ message: 'Passou por tudo' })
  }

  //Função que irá mostrar(listar) TODAS as notas
  async index(request, response) {
    // const { previousBalance, id, debts, description, created_at, currentBalance,  } = request.query ?? request


    const user_account = request.user.cpf
 
    // console.log(previousBalance, created_at, description)
    // console.log(user_account)
 
    const user = await knex("accountHolder").where("cpf", user_account.toString()).select("account")
    
    const user_id = user[0].account

    const userExtract = await knex("extract").where("account_id", user_id)

    //Retornando as notas capturadas - filtradas por usuário - agora com adição das tags vinculadas
    return response.json(userExtract)
  }
}

module.exports = ExtractController
