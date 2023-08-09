//Importando minha conexão
const sqliteConnection = require("../../sqlite")

const createdBank = require("./createBank");

async function migrationsRun() {
  //schemas(esquemas - refere-se as tabelas)
  const schemas = [createdBank].join('') 

  sqliteConnection()
  .then(db => db.exec(schemas))
  .catch(error => console.error(error))
  //Se tiver erro o capture e imprima
}

//Exportando a função
module.exports = migrationsRun;