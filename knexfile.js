//=== Configurações do Knex ===

const path = require('path')

module.exports = {
  development: {
    //Base de dados sendo utilizada
    client: 'sqlite3',
    //Conexão
    connection: {
      filename: path.resolve(__dirname, 'src', 'database', 'database.db')
    },
    //Por padrão o SQLITE (desabilita a função onDelete(cascade) - sendo assim incluímos esta funcionalidade POOL - que irá executar o que for passado no momento que for feita a conexão com o nosso banco de dados
    pool: {
      //função afterCreate(depois de criar) - execute outra função
      //Os argumento passados conn(significa capturar a conexão) - cb (significa capturar a callback)
      //PRAGMA fk = on (é para habilitar a função onDelete(CASCADE) - assim que a conexão for estabelecida - cb? deve ser para rodar o onDelete(CASCADE) dentro das migrate
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb)
    },
    migrations: {
      //Que ao utilizar o comando npx knex migrate:make createNotes - estarei criando dentro da pasta migrations direcionada um arquivo tipo migrations para versionar código sql dentro do vsc que irá fazer conexão direta com o meu banco de dados
      directory: path.resolve(
        __dirname,
        'src',
        'database',
        'knex',
        'migrations'
      )
    },
    //Propriedade padrão para trabalharmos com sqlite
    useNullAsDefault: true
  }
}
