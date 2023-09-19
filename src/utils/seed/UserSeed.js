const faker = require('faker/locale/pt_BR');
const lodash = require('lodash');
const { cpf, cnpj } = require('cpf-cnpj-validator');
const User = require('../../models/User');
const Entity = require('../../models/Entity');

const diseases = ['dc', 'hiv', 'diab', 'hiperT', 'doenCardio'];
let latitude = process.env.LATITUDE_ENV || -15.824544;
let longitude = process.env.LONGITUDE_ENV || -48.060878;
const seedUser = async () => {
  try {
    const userCollection = await User.find();
    const entityCollection = await Entity.find();

    // this condition avoid populate duplicate users
    if (userCollection.length > 0 || entityCollection > 0) {
      return;
    }

    const users = [];
    const entities = [];
    const quantity = 100;
    for (let i = 0; i < quantity; i += 1) {
      const sampleRiskGroup = lodash.sampleSize(diseases, faker.random.number(5));
      longitude = Number(longitude) + (faker.random.number({ min: -999, max: 999 }) / 100000);
      latitude = Number(latitude) + (faker.random.number({ min: -999, max: 999 }) / 100000);
      const sharedInfo = {
        name: faker.name.findName(),
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
        phone: faker.phone.phoneNumber('+55######-####'),
        active: true,
      };

      users.push(
        new User({
          ...sharedInfo,
          birthday: Date.parse(faker.date.between('1940-01-01', '2020-01-01')),
          cpf: cpf.generate(),
          riskGroup: sampleRiskGroup,
          ismentalHealthProfessional: faker.random.boolean(),
        }),
      );

      entities.push(
        new Entity({
          ...sharedInfo,
          cnpj: cnpj.generate(),
        }),
      );
    }
    await User.deleteMany({});
    await Entity.deleteMany({});

    users.forEach((user) => {
      User.create(user);
    });

    entities.forEach((entity) => {
      Entity.create(entity);
    });
    console.log('Usuários e entidades populados com sucesso!');
  } catch (error) {
    console.log('Não foi possível popular os usuáriios na base de dados!');
    console.log(error);
  }
};

module.exports = seedUser;
