const Help = require('../../models/Help')
const faker = require('faker/locale/pt_BR')
const Category = require('../../models/Category')
const User = require('../../models/User')
const seedHelp = async () => {
    //console.log('iaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    try {
        
        const categoryCollection = await Category.find()
        const userCollection = await User.find()
        const helpCollection = await Help.find()
        
        // with sudo docker-compose -f docker-compose.yml up --build, the seed will work only one time
        // because the database was not dropped, so it will fail de if below
        // to continue seeding diffent users, comment the if bellow or execute sudo docker-compose down
        // to drop everything
        if (helpCollection.length > 0) {
            return
        }
        const quantity = 10
        let helps = []
        var t1 = userCollection.length
        var t2 = categoryCollection.length
       
        for (let i = 0; i < quantity; i++) {
            var quant = faker.random.number(t1-2)
            quant++
            var Helpers = []
            for (let u = 0; u < quant; u++) {
                Helpers[u] =  userCollection[faker.random.number(t1-1)]._id
            }
            
            helps.push(
                new Help({
                    title:faker.lorem.lines(1),
                    description: faker.lorem.lines(1),
                    status: faker.random.arrayElement(['nao aceito', 'em andamento', 'concluido', 'excluido']),
                    possibleHelpers:Helpers,
                    categoryId:categoryCollection[faker.random.number(t2-1)]._id,
                    ownerId: userCollection[faker.random.number(t1-1)]._id,
                    helperId: userCollection[faker.random.number(t1-1)]._id,
                    
                })
            )
            
          
        }

        await Help.deleteMany({})

        helps.forEach(help => {
            //console.log(help + 'batom')
            Help.create(help)
        })
        
        //console.log(Helps)


    } catch (error) {
        console.log(error)
    }
}

module.exports = seedHelp
