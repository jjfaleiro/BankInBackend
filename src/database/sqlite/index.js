//Comunicação
const sqlite3 = require('sqlite3')

//Conexão
const sqlite = require('sqlite')

//Acesso a arquivo em diferentes sistemas operacionais
const path = require('path')

async function sqliteConnection() {

  //sqlite.open (conexão)
  //Crio o arquivo db caso ele não exista e armazeno neste const database
  const database = await sqlite.open({
    filename: path.resolve(__dirname, '..', 'database.db'),

    driver: sqlite3.Database
  })

  return database

}

module.exports = sqliteConnection