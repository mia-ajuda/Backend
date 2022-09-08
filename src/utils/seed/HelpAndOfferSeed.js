const lodash = require('lodash');
const faker = require('faker/locale/pt_BR');
const Category = require('../../models/Category');
const Help = require('../../models/Help');
const User = require('../../models/User');
const HelpOffer = require('../../models/HelpOffer');

const status = [
  'waiting',
  'on_going',
  'finished',
  'helper_finished',
  'owner_finished',
];

const seedHelp = async () => {
  try {
    const categoryCollection = await Category.find();
    const userCollection = await User.find();
    const helpCollection = await Help.find();
    const helpOfferCollection = await HelpOffer.find();

    // this condition avoid populate duplicate users
    if (helpCollection.length > 0 || helpOfferCollection.length >0) {
      return;
    }

    const quantity = 100;
    const requests = [];
    const offers = [];
    for (let i = 0; i < quantity; i += 1) {
      const sampleStatus = lodash.sample(status);
      const sampleCategory = lodash.sample(categoryCollection);
      const sampleUsers = lodash.sampleSize(userCollection, 2);
      const samplePossibleHelpers = lodash.sampleSize(
        userCollection,
        faker.random.number(5),
      );
      const samplePossibleHelpsID = [];
      samplePossibleHelpers.forEach((item) => {
        samplePossibleHelpsID.push(item._id);
      });
      const sharedInfo = {
        title: faker.lorem.lines(1),
        description: faker.lorem.lines(1),
        status: sampleStatus,
        categoryId: [sampleCategory._id],
        ownerId: sampleUsers[0]._id,
        finishedDate: faker.date.future(),
      };
      requests.push(
        new Help({
          ...sharedInfo,
          possibleHelpers: samplePossibleHelpsID,
        }),
      );
      
      offers.push(
        new HelpOffer({
          ...sharedInfo,
          possibleHelpedUsers: samplePossibleHelpsID,
        })
      )
    }

    await Help.deleteMany({});
    await HelpOffer.deleteMany({});

    requests.forEach((request) => {
      Help.create(request);
    });

    offers.forEach((offer) => {
      HelpOffer.create(offer);
    });

    console.log('Pedidos e ofertas populados com sucesso!');
  } catch (error) {
    console.log('Não foi possível pedidos e ofertas na base de dados!');
    console.log(error);
  }
};

module.exports = seedHelp;
