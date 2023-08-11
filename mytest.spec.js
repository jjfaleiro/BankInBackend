//it (É uma função de teste que recebe dois parâmetros - 1º Descrição do teste, o que ele faz seja objetivo - 2º Função que irá executar de fato o nosso teste)
//Sempre que vamos trabalhar com teste temos que deixar claro a EXPECTATIVA DO TESTE - no caso a descrição - o que você pretende com este teste
//Por isto utilizamos a função expect() que irá analisar o objetivo do nosso teste que no caso será verificar se result é igual a 4
//toEqual(4) = Ou seja que seja igual(equal) a 4
//Se o teste corresponder a expectativa o teste passou!!!
it('result of them sum of 2 + 2 must be 4', () => {
  const a = 2
  const b = 2
  const result = a + b

  expect(result).toEqual(4)
})
//Para executar o teste - é só executar o npm test
