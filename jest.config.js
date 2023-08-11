module.exports = {
  bail: true,
  coverageProvider: 'v8',

  testMatch: ['<rootDir>/src/**/*.spec.js']
}

//O bail por padrão ele é false - sua funcionalidade é de para toda a execução do teste caso algumas das funcionalidades esteja errada - estrategia utilizada pela rocketseat para resolver erro por erro - caso não passarmos true como valor o teste irá reportar todos os erros de uma vez
//Estou deixando selecionado o v8 como ferramenta de compilação de js
//testMatch funciona como um padrão de arquivo que serão feitos os testes na aplicação dentro do vetor você coloca um padrão onde só os arquivos com este formato serão testados - os outros serão ignorados => <rootDir> (Pegue a raiz do nosso diretório) / src (Só dentro da pasta src - ou seja irá ignorar as outras inclusive o node_modules) / ** (Qualquer pasta) / * (Qualquer nome) .spec (pode ser .test - você decide o nome - o bom do spec é o simbolo do arquivo) (diferenciar os arquivos que serão testados) .js (extensão dos arquivos que serão testados)
