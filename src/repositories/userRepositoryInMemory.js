//Criando uma especie de BD em formato de vetor(array) para executar nosso teste de forma independente do BD - Testando a execução da funções criadas similarmente ao código original
class UserRepositoryInMemory {
  users = []

  async create({ name, cpf, email, password }) {
    //Pegue os parâmetros e crie um objeto com id aleatório
    const user = {
      id: Math.floor(Math.random() * 1000) + 1,
      name,
      cpf,
      email,
      password
    }

    this.users.push(user)

    return user
  }

  async findByEmail(email) {
    return this.users.find(user => user.email === email)
  }

  async findByCPF(cpf) {
    return this.users.find(user => user.cpf === cpf)
  }
}

module.exports = UserRepositoryInMemory