import { MongoClient } from 'mongodb'

import { app } from '../app'

const URI_BD = `mongodb://localhost/arquivos`; 

export const conectarNoBD = async () => {

    const clienteMongo = new MongoClient(URI_BD, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    try {
        const conexao = await clienteMongo.connect()
        app.locals.bd = conexao.db()
        console.log(`App conectado ao bd ${conexao.db().databaseName}`)

        process.on('SIGINT', async () => {
            try {
                await conexao.close()
                console.log('Conexão com o bd fechada')
            } catch (erro) {
                console.log(erro)
            }
        })
    } catch (erro) {
        console.log(erro)
    }
}