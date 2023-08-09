//Agora que já temos nosso UPLOAD DE IMAGEM configurado
//Precisamos de duas funções: I - Salvar a imagem/arquivo - II - Deletar a foto/arquivo anterior (pois o usuário só precisa de uma foto para o perfil além de evitar erros oriundos de várias fotos cadastradas para o mesmo fim)

//Funcionalidade de próprio node para lidar com manipulação de arquivos
const fs = require('fs')

const path = require('path')

//Importando as configurações de upload
const uploadConfig = require('../configs/upload')

//Classe - com as 2 funções mencionadas no começo do arquivo js
class DiskStorage {
  //Função para salvar o arquivo - que recebe o file(arquivo como argumento)
  async saveFile(file) {
    //Utilize a funcionalidade fs fazendo uma promessa - renomeando o local (NÃO O NOME - mas o destino) do arquivo especificado - fazendo com que o arquivo seja salvo
    //rename (utiliza 2 argumento - o 1º onde está - 2º para onde vai)
    await fs.promises.rename(
      //Ou seja peque o arquivo que está na pasta temporária - especificando qual arquivo
      path.resolve(uploadConfig.TMP_FOLDER, file),
      //E o mude para a pasta final - especificando qual arquivo
      path.resolve(uploadConfig.UPLOADS_FOLDER, file)
    )
    //Retorne as informações do arquivo - neste caso sua mudança de temporário para definitivo
    return file
  }

  //Função para deletar arquivo que está sendo substituído
  async deleteFile(file) {
    //Busque pelo arquivo/caminho na pasta final de upload
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file)

    //try - catch (Tratamento de erro para caso o arquivo buscado não exista mais) - para evitar que a aplicação bug
    try {
      //Ou seja pegue o arquivo
      //Então no caso de nosso projeto aqui no Explorer, o stat() deve estar ali para garantir que não há erro com o caminho do arquivo. - Havendo erro catch
      await fs.promises.stat(filePath)
    } catch {
      //Caso exista algum tipo de erro retorne parando a função
      return
    }
    //Para deletar efetivamente utilize a biblioteca fs com promessa - funcionalidade unlink (É a funcionalidade para excluir arquivo do FS)
    await fs.promises.unlink(filePath)
  }
}

//Exportando a classe que salva e deleta arquivos de imagem
module.exports = DiskStorage

/*
Algumas das principais funções do módulo "fs" incluem:

fs.readFile(): lê um arquivo e retorna seu conteúdo.
fs.writeFile(): escreve dados em um arquivo.
fs.existsSync(): verifica se um arquivo ou diretório existe.
fs.mkdir(): cria um novo diretório.
fs.unlink(): exclui um arquivo.
fs.rename(): renomeia um arquivo ou diretório.

*/
