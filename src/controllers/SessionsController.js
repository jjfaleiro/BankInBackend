//Autenticação do usuário
const knex = require('../database/knex')

const AppError = require('../utils/AppError')

const { compare } = require('bcryptjs')

const authConfig = require('../configs/auth')

const { sign } = require('jsonwebtoken')

class SessionsController {
  async create(request, response) {
    const { cpf, password } = request.body

    //First = garante que traga só um
    const user = await knex('accountHolder').where({ cpf }).first()

    if (!user) {
      throw new AppError('CPF e/ou senha estão incorretos!!!', 401)
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new AppError('Conta e/ou senha estão incorretos!!!', 401)
    }

    //Duplicidade do erro: Para caso alguém esteja tentando hackear uma conta a pessoa não tenha crtz se é a conta ou a senha

    //Gerando o TOKEN - JWL - crtl + espaço eu consigo ver os elementos de dentro da desestruturação
    const { secret, expiresIn } = authConfig.jwt
    const token = sign({}, secret, {
      subject: String(user.cpf),
      expiresIn
    })

    return response.json({user, token})
  }
}

module.exports = SessionsController
