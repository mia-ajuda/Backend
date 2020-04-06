/* eslint-disable */
const faker = require('faker/locale/pt_BR');
const Help = require('../../models/Help');
const Category = require('../../models/Category');
const User = require('../../models/User');

const seedHelp = async () => {
    try {
        const categoryCollection = await Category.find();
        const userCollection = await User.find();
        const helpCollection = await Help.find();

        // with sudo docker-compose -f docker-compose.yml up --build, the seed will work only one time
        // because the database was not dropped, so it will fail de if below
        // to continue seeding diffent users, comment the if bellow or execute sudo docker-compose down
        // to drop everything
        if (helpCollection.length > 0) {
            return;
        }
        const quantity = 10;
        const helps = [];
        const t1 = userCollection.length;
        const t2 = categoryCollection.length;

        for (let i = 0; i < quantity; i++) {
            let quant = faker.random.number(t1 - 2);
            quant++;
            const Helpers = [];
            for (let u = 0; u < quant; u++) {
                Helpers[u] = userCollection[faker.random.number(t1 - 1)]._id;
            }

            helps.push(
                new Help({
                    title: faker.lorem.lines(1),
                    description: faker.lorem.lines(1),
                    status: faker.random.arrayElement(['waiting', 'on_going', 'finished', 'deleted']),
                    possibleHelpers: Helpers,
                    categoryId: categoryCollection[faker.random.number(t2 - 1)]._id,
                    ownerId: userCollection[faker.random.number(t1 - 1)]._id,
                    helperId: userCollection[faker.random.number(t1 - 1)]._id,
                    finishedDate: faker.date.future(),
                }),
            );
        }

        await Help.deleteMany({});

        helps.forEach((help) => {
            Help.create(help);
        });


        console.log('Ajudas populadas com sucesso!');
    } catch (error) {
        console.log('Não foi possível popular as ajudas na base de dados!');
        console.log(error);
    }
};

module.exports = seedHelp;
