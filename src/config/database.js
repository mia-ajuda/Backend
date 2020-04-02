const mongoose = require('mongoose')
const CategorySeed = require('../utils/seed/CategorySeed')

const databaseURL = process.env.DATABASE_URL || 'mongodb://mongo:27017/miaAjudaDB'
const envType = process.env.NODE_ENV || 'development'

const databaseConnect = async() => {
    try {
        await mongoose.connect(databaseURL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => console.log('Banco de dados conectado!'))
            .catch(error => console.log('Não foi possível se conectar ao banco de dados!'))
        
        CategorySeed()
        if(envType === 'development') {
            console.log('Popula usuários e ajudas falsas');
        }
    } catch(error) {
        console.log('Não foi possível initializar corretamente a base de dados!')
        console.log(error)
    }
}

module.exports = databaseConnect;