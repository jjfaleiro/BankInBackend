const { hash } = require("bcryptjs")
const AppError = require('../utils/AppError')

//Classe de serviço de criação de usuário
class UserCreateService {
  //Toda classe tem um método/função construtora e sempre que a classe é instanciada este método é EXECUTADO AUTOMATICAMENTE - Sendo assim a forma que iremos utilizar a seguir se chama abstração observar imagens na pasta - Estou tirando a necessidade de dependência do meu código - flexibilizando ela, desta forma se houver necessidades de mudanças no futuro - faço com que as mudanças sejam minímas sem afetar o código
  constructor(userRepository){
    //Ou seja estou tornando o userRepository que está sendo recebido como parâmetro sempre que a minha classe é instanciada visível para toda a minha classe
    this.userRepository = userRepository
  }
  //Neste caso estou tornando o BD que a minha app vai consumir flexível e não dependente - sendo possível altera-la de forma prática



  async execute({name,cpf,email,password}){
    
    if (!name || !password || !email || !cpf) {
      throw new AppError(
        'Necessário inserir nome, CPF, email e CPF para cadastro. Tente novamente!'
      )
    }

    const checkUserCpf = await this.userRepository.findByCPF(cpf)

    const checkUserEmail = await this.userRepository.findByEmail(email)


    if (checkUserCpf) {
      throw new AppError('Este CPF já está em uso!!!')
    }

    if (checkUserEmail) {
      throw new AppError('Este e-mail já está em uso!!!')
    }

    const hashedPassword = await hash(password, 8)

    //Capturando a dado
    const userCreated = await this.userRepository.create({name, cpf, email, password: hashedPassword})
    
    //E o retornando
    return userCreated
  }


}

module.exports = UserCreateService