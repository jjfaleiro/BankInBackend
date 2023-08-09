//path - funcionalidade do node (para resolver coisas relativas a caminhos dentro do nosso projeto)
const path = require('path')

//Importando o multer Biblioteca que gerencia UPLOADS
const multer = require('multer')

//Outra biblioteca
const crypto = require('crypto')

//Ou seja path resolva o caminho até chegar a minha pasta tmp (Pasta temporária)
const TMP_FOLDER = path.resolve(__dirname, '..', '..', 'tmp')

//Pasta (Folder) de uploads - Onde de fato os arquivos vão ficar - Destino final da imagem
//Ou seja a pasta final fica dentro de TMP_FOLDER - por isto não precisou do __dirname
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, 'uploads')

//O MULTER propriamente dito - será a biblioteca que iremos utilizar para fazer o UPLOAD - informando o destino e o nome do arquivo concatenado para ser único
const MULTER = {
  //Propriedade do multer - ou seja estou criando uma variável para armazenar do multer o diskStorage (Armazenamento de disco)
  storage: multer.diskStorage({
    //Destino - Pasta Temporária
    destination: TMP_FOLDER,
    //Nome do arquivo - filename é uma função
    filename(request, file, callback) {
      //Vou gerar um número para combinar com o nome do arquivo por meio do hash que é uma função de codificação - através da biblioteca crypto - para que os arquivos de imagem sejam sempre distintos uns dos outros - para não haver sobreposição de arquivo por conta de nomes iguais
      //Ou seja gere um número randômico em bytes - e transforme ele em uma string do tipo hexadecimal
      const fileHash = crypto.randomBytes(10).toString('hex')

      //Nome do arquivo propriamente dito
      //Concatenação do fileHash com o nome original do arquivo - utilizando deste atributo originalname
      const fileName = `${fileHash}-${file.originalname}`

      //Retornando o nome do arquivo concatenado - neste caso o 1º parâmetro é null mesmo
      return callback(null, fileName)
    }
  })
}

//Exportando os arquivos
module.exports = {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MULTER
}