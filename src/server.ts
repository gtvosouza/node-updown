import { app } from './app'
import { conectarNoBD } from './config/bd'

const porta = process.env.PORT || 3335

const server = app.listen(
    porta,
    () => {
        conectarNoBD()
        console.log(`App ouvindo na porta ${porta}`)
    }
)

process.on('SIGINT', () => {
    server.close()
    console.log('App finalizado')
})