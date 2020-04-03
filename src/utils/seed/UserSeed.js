const User = require('../../models/User')
const faker = require('faker/locale/pt_BR')

const seedUser = async () => {
    try {
        const userCollection = await User.find()
        // with sudo docker-compose -f docker-compose.yml up --build, the seed will work only one time
        // because the database was not dropped, so it will fail de if below
        // to continue seeding diffent users, comment the if bellow or execute sudo docker-compose down
        // to drop everything
        if(userCollection.length > 0) {
            return
        }
        
        let users = []
        const quantity = 10
        for(let i = 0; i < quantity; i++) {
            users.push(
                new User({
                    name:faker.name.findName(),
                    birthday:Date.parse(faker.date.between('1900-01-01', '2020-03-01')),
                    cpf:'12345678910',
                    email: faker.internet.email(),
                    photo:faker.image.avatar(),
                    address:{
                        cep:faker.address.zipCode(),
                        number:faker.random.number(),
                        city:faker.address.city(),
                        state:faker.address.state(),
                        complement:faker.lorem.lines(1)
                    },
                    location: {
                        type: "Point",
                        coordinates: [
                            faker.address.longitude(),
                            faker.address.latitude()
                        ]
                    },
                    phone:faker.phone.phoneNumber('+55 (##) #####-####')
                })
            )
        }

        await User.deleteMany({})

        users.forEach(async user => {
            await user.save();
        })
        console.log('Usuários populados com sucesso!')
    } catch(error) {
        console.log('Não foi possível popular os usuáriios na base de dados!')
        console.log(error)
    }
}

module.exports = seedUser
