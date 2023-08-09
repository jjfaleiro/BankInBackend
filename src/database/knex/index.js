//Importando as configurações do Knex
const config = require("../../../knexfile")
//Importando o Knex
const knex = require("knex")

//Criando a conexão - que é uma conexão knex - e dentro do knex eu tenho que passar as configurações que estão dentro do meu arquivo knexfile que estão sendo armazenados em config em especifico a parte development que é literalmente a parte da configuração de desenvolvimento
const connection = knex(config.development)

//Exportando a minha conexão
module.exports = connection
