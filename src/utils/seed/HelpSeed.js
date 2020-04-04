const Help = require('../../models/Help')
const faker = require('faker/locale/pt_BR')
const Category = require('../../models/Category')
const User = require('../../models/User')
const lodash = require('lodash')

const status = ['waiting', 'on_going', 'finished', 'deleted']

const seedHelp = async () => {

    try {
        const categoryCollection = await Category.find()
        const userCollection = await User.find()
        const helpCollection = await Help.find()

        // this condition avoid populate duplicate users
        if (helpCollection.length > 0) {
            return
        }

        const quantity = 10
        let helps = []
        for (let i = 0; i < quantity; i++) {
            const sampleStatus = await lodash.sample(status)
            const sampleCategory = await lodash.sample(categoryCollection)
            const sampleUsers = await lodash.sampleSize(userCollection, 2)
            const samplePossibleHelpers = await lodash.sampleSize(
                userCollection, faker.random.number(userCollection.length-2))
            let samplePossibleHelpsID = []
            samplePossibleHelpers.forEach(function(item, index) {
                samplePossibleHelpsID.push(item._id)
            })

            helps.push(
                new Help({
                    title:faker.lorem.lines(1),
                    description: faker.lorem.lines(1),
                    status: sampleStatus,
                    possibleHelpers: samplePossibleHelpsID,
                    categoryId: sampleCategory._id,
                    ownerId: sampleUsers[0]._id,
                    helperId:sampleUsers[1]._id,
                    finishedDate:faker.date.future()
                })
            )
        }

        await Help.deleteMany({})

        helps.forEach(help => {
            Help.create(help)
        })

        console.log('Ajudas populadas com sucesso!')
    } catch(error) {
        console.log('Não foi possível popular as ajudas na base de dados!')
        console.log(error)
    }
}

module.exports = seedHelp
