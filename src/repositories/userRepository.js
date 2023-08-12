//Importando a conexão com o BD
const sqliteConnection = require('../database/sqlite')

//Classe que será responsável pela conexão com nosso BD
class UserRepository {
  //Função que irá estabelecer a conexão com o BD através do CPF
  async findByCPF(cpf) {
    const database = await sqliteConnection()
    const user = await database.get(
      `SELECT * FROM accountHolder WHERE cpf = (?)`,
      [cpf]
    )

    //Retornando o conexão através do cpf
    return user
  }

  async findByEmail(email) {
    const database = await sqliteConnection()
    const user = await database.get(
      `SELECT * FROM accountHolder WHERE email = (?)`,
      [email]
    )

    //Retornando o conexão através do cpf
    return user
  }

  //Conexão + Update do BD
  async create({ name, cpf, email, password }) {
    const database = await sqliteConnection()

    const userId = await database.run(
      `INSERT INTO accountHolder (name, cpf, email, password) VALUES (?,?,?,?)`,
      [name, cpf, email, password]
    )

    //Retornando o id do usuário pois ao capturar a conexão e fazer um update colocando dentro de uma variável ele irá retornar o objeto que está sendo alterado dessa forma consigo acessar o id
    return { id: userId }
  }
}

module.exports = UserRepository
