module.exports = {
  jwt: {
    secret: process.env.AUTH_SECRET || "default",
    expiresIn: '1d'
  }
}

//expiresIn - tempo de expiração - 1d = 1 dia
//secret é para rodar a encriptação - palvra/chave/hash que são inseridos ali para gerar um token
//Ou seja pegue o .env caso não encontre coloque o padrão
