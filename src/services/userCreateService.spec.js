//Teste para serviço de criação de usuário
//Verificando se usuário é criado com sucesso
//O it do método meio que se insere na compreensão da semântica da expectativa
const UserCreateService = require('./userCreateService')

const UserRepositoryInMemory = require('../repositories/userRepositoryInMemory')

const AppError = require('../utils/AppError')

//Funciona como um agrupador de testes - O ideal é ter um describe por arquivo
describe('UserCreateService', () => {
  //Conceito de beforeEach - Reutilização de código para todos os testes - crio eles dentro do describe - funcionando como um escopo global para ficar acessível para cada teste
  //Let pois varia
  let userRepositoryInMemory = null
  let userCreateService = null

  //Irei executar está mesma lógica em todos os testes dentro deste describe
  //Ou seja antes de cada teste estão sendo instanciados nosso repositório (fake) - e o nosso service (Nosso lógica de app)
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    userCreateService = new UserCreateService(userRepositoryInMemory)
  })

  it('user should be create', async () => {
    //Meu teste não vai depender dos usuários criados estamos apenas simulando os inputs (entradas)
    const user = {
      name: 'User Test',
      cpf: '123456789',
      email: 'user@test.com',
      password: '123'
    }

    //Desta forma vou capturar o retorno do meu serviço
    const userCreated = await userCreateService.execute(user)

    // console.log(userCreated)

    //Minha expectativa é que o userCreated tenha uma propriedade id
    //ter propriedade (toHaveProperty)
    //. este ponto no caso operadores do expect podem ser encontrados na página do JEST em using matches (https://jestjs.io/pt-BR/docs/using-matchers)
    expect(userCreated).toHaveProperty('id')

    //Atenção!!! Os testes tem que conseguir serem executados de forma independente do BD/Serviços/API

    //Atenção!!! - apesar de ter utilizado duas lógicas de BD diferentes a estratégia de negócio se permaneceu a mesma - Desestruturação/Inversão de dependência
  })

  //Usuário não pode criar com email existente
  it('user not should be created with email', async () => {
    //Usuários criados para tester email já existente
    const userOne = {
      name: 'User Test 1',
      cpf: '123456789',
      email: 'user@test.com',
      password: '123'
    }

    const userTwo = {
      name: 'User Test 2',
      cpf: '1234567890',
      email: 'user@test.com',
      password: '123'
    }

    await userCreateService.execute(userOne)
    //Sendo rejeitado o usuário 2 .é igual ao que? A instancia de apperror exatamente igual ao do código importante copiar do código original - ele verifica se a intanciada gerada pelo erro que está sendo testado é exatamente igual ao do código original - por isto a necessidade de copiar exatamente como é
    await expect(userCreateService.execute(userTwo)).rejects.toEqual(
      new AppError('Este e-mail já está em uso!!!')
    )
  })

  //ATENÇÃO!!! Como estamos utilizando um conceitos de im memory não é necessário utilizar o async await - porém escolhemos manter pois - numa real seria desta forma que seria utilizado pois o bd exemplificado para testes seria feito de outra forma

  //Só para exemplificar o describe
  // it("another test", () => {
  //   expect(1).toBe(1)
  // })
})

//it (É uma função de teste que recebe dois parâmetros - 1º Descrição do teste, o que ele faz seja objetivo - 2º Função que irá executar de fato o nosso teste)
//Sempre que vamos trabalhar com teste temos que deixar claro a EXPECTATIVA DO TESTE - no caso a descrição - o que você pretende com este teste
//Por isto utilizamos a função expect() que irá analisar o objetivo do nosso teste que no caso será verificar se result é igual a 4
//toEqual(4) = Ou seja que seja igual(equal) a 4
//Se o teste corresponder a expectativa o teste passou!!!
// it('result of them sum of 2 + 2 must be 4', () => {
//   const a = 2
//   const b = 2
//   const result = a + b

//   expect(result).toEqual(4)
// })
//Para executar o teste - é só executar o npm test
