const User = require('../../models/User');
const faker = require('faker/locale/pt_BR');
const lodash = require('lodash');
const { cpf } = require('cpf-cnpj-validator');

const diseases = ['dc','hiv','diab','hiperT','doenCardio'];

const seedUser = async () => {
    try {
        const userCollection = await User.find();

        // this condition avoid populate duplicate users
        if (userCollection.length > 0) {
            return;
        }

        const users = [];
        const quantity = 10;
        for (let i = 0; i < quantity; i++) {
            const sampleRiskGroup = await lodash.sampleSize(diseases, faker.random.number(5));

            users.push(
                new User({
                    name: faker.name.findName(),
                    birthday: Date.parse(faker.date.between('1900-01-01', '2020-01-01')),
                    cpf: cpf.generate(),
                    email: faker.internet.email(),
                    photo: faker.image.avatar(),
                    address: {
                        cep: faker.address.zipCode(),
                        number: faker.random.number(),
                        city: faker.address.city(),
                        state: faker.address.state(),
                        complement: faker.lorem.lines(1),
                    },
                    location: {
                        type: 'Point',
                        coordinates: [
                            faker.address.longitude(),
                            faker.address.latitude(),
                        ],
                    },
                    riskGroup: sampleRiskGroup,
                    ismentalHealthProfessional: faker.random.boolean(),
                    phone: faker.phone.phoneNumber('+55 (##) 9####-####'),
                }),
            );
        }

        await User.deleteMany({});

        users.forEach((user) => {
            User.create(user);
        });
        console.log('Usuários populados com sucesso!');
    } catch (error) {
        console.log('Não foi possível popular os usuáriios na base de dados!');
        console.log(error);
    }
};

module.exports = seedUser;