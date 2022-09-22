import { Router } from 'express'
import * as path from 'path'
import * as fs from 'fs'
import { ArquivoController, ErroUpload } from '../controllers/ArquivoController'
import { Console } from 'console'

export const uploadRouter = Router()

uploadRouter.post('/', async (req, res) => {
    if (!req.files || Object.keys(req.files).length == 0) {
        console.log('aaaaa')
        return res.status(400).send('Nenhum arquivo recebido')

    }



    const nomesArquivos = Object.keys(req.files)
    const diretorio = path.join(__dirname, '..', '..', 'arquivos')
    if (!fs.existsSync(diretorio)) {
        fs.mkdirSync(diretorio)
    }

    const bd = req.app.locals.bd
    const arquivoCtrl = new ArquivoController(bd)
    const idsArquivosSalvos : String[] = []
    let quantidadeErroGravacao = 0
    let quantidadeErroObjArquivoInvalido = 0
    let quantidadeErroInesperado = 0
    

    const promises = nomesArquivos.map(async (arquivo) => {
       
        
        const objArquivo = req.files ? req.files[arquivo] : null;

        const {nomeEmpresa} = req.query;

        try {
            const idArquivo = await arquivoCtrl.realizarUpload(objArquivo, String(nomeEmpresa))
            idsArquivosSalvos.push(String(idArquivo))
        } catch (erro) {
            switch (erro) {
                case ErroUpload.NAO_FOI_POSSIVEL_GRAVAR:
                    quantidadeErroGravacao++
                    break
                case ErroUpload.OBJETO_ARQUIVO_INVALIDO:
                    quantidadeErroObjArquivoInvalido++
                    break
                default:
                    quantidadeErroInesperado++
            }
        }
    })

    await Promise.all(promises)

    
    res.json(idsArquivosSalvos.length > 0 ? idsArquivosSalvos[0] : "")


})