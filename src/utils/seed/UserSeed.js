const faker = require('faker/locale/pt_BR');
const lodash = require('lodash');
const { cpf } = require('cpf-cnpj-validator');
const User = require('../../models/User');

const diseases = ['dc', 'hiv', 'diab', 'hiperT', 'doenCardio'];
let latitude = process.env.LATITUDE_ENV || -15.824544;
let longitude = process.env.LONGITUDE_ENV || -48.060878;
const seedUser = async () => {
  try {
    const userCollection = await User.find();

    // this condition avoid populate duplicate users
    if (userCollection.length > 0) {
      return;
    }

    const users = [];
    const quantity = 100;
    for (let i = 0; i < quantity; i += 1) {
      const sampleRiskGroup = lodash.sampleSize(diseases, faker.random.number(5));
      longitude = Number(longitude) + (faker.random.number({ min: -999, max: 999 }) / 100000);
      latitude = Number(latitude) + (faker.random.number({ min: -999, max: 999 }) / 100000);
      users.push(
        new User({
          name: faker.name.findName(),
          birthday: Date.parse(faker.date.between('1940-01-01', '2020-01-01')),
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
              longitude,
              latitude,
            ],
          },
          riskGroup: sampleRiskGroup,
          ismentalHealthProfessional: faker.random.boolean(),
          phone: faker.phone.phoneNumber('+55######-####'),
          active: true,
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
