//MIDDLEWARE que verifica o TOKEN de autenticação

const { verify } = require('jsonwebtoken')

const AppError = require('../utils/AppError')

const authConfig = require('../configs/auth')

function ensureAuthenticated(request, response, next) {
  //O TOKEN do usuário vai estar dentro da requisição do usuário no cabeçalho acessado pela autorização(Que é onde está o token efetivamente)

  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError('JWT Token não informado!!!', 401)
  }

  //Pegando só a parte codificada do Token
  //Ou seja o split retira os espaço e junta todo o texto capturado pela requisição - como entre as aspas só foi especifido o espaço então é isto que ele retira assim juntando todo o texto
  //e dentro dos colchetes estamos configurando uma nova variavél que está excluindo a primeira parte do split por isto tem uma virgula com nada antes e após a virgula estamos pegando a parte que interessa - que é o token em si
  const [, token] = authHeader.split(' ') //Bearer xxxxxxxx

  //Ou seja tente verificar se o token informado está correto comparando com o secret de dentro do jwt
  //Este sub cria uma especie de apelido para se referir ao retorno deste verify
  try {
    const { sub: user_account } = verify(token, authConfig.jwt.secret)
    //Aqui estou fazendo com que o token que estava em formato de texto vire um número de novo
    request.user = {
      cpf: Number(user_account)
    }
    //Se deu tudo certo siga para a próxima função
    return next()
  } catch {
    throw new AppError('JWT Token inválido!!!', 401)
    //Se for um erro capture e retorne está mensagem de erro
  }
}

module.exports = ensureAuthenticated
