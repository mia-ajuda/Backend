const lodash = require('lodash');
const faker = require('faker/locale/pt_BR');
const Category = require('../../models/Category');
const Help = require('../../models/Help');
const User = require('../../models/User');
const Entity = require('../../models/Entity');
const Campaign = require('../../models/Campaign');
const HelpOffer = require('../../models/HelpOffer');
const mockedOfferInfo = require('./mockedInfos/mockedOfferInfo');
const mockedHelpInfo = require('./mockedInfos/mockedHelpInfo');

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
    const entityCollection = await Entity.find();
    const helpCollection = await Help.find();
    const helpOfferCollection = await HelpOffer.find();
    const campaignCollection = await Campaign.find();

    // this condition avoid populate duplicate users
    if (helpCollection.length > 0 || helpOfferCollection.length > 0 || campaignCollection.length > 0) {
      return;
    }

    const quantity = 10;
    const requests = [];
    const offers = [];
    const campaigns = [];
    for (let i = 0; i < quantity; i += 1) {
      const sampleStatus = lodash.sample(status);
      const sampleCategory = lodash.sample(categoryCollection);
      const sampleUsers = lodash.sampleSize(userCollection, 2);
      const sampleEntities = lodash.sampleSize(entityCollection, 2);
      const randomNum = faker.random.number(5);
      const samplePossibleHelpers = lodash.sampleSize(
        userCollection,
        randomNum,
      );
      const samplePossibleHelpsID = [];
      samplePossibleHelpers.forEach((item) => {
        samplePossibleHelpsID.push(item._id);
      });
      const sharedInfo = {
        title: mockedOfferInfo.titles[randomNum],
        description: mockedOfferInfo.descriptions[randomNum],
        status: sampleStatus,
        categoryId: [sampleCategory._id],
        ownerId: sampleUsers[0]._id,
        finishedDate: faker.date.future(),
      };

      requests.push(
        new Help({
          ...sharedInfo,
          possibleHelpers: samplePossibleHelpsID,
          title: mockedHelpInfo.titles[randomNum],
          description: mockedHelpInfo.descriptions[randomNum],
        }),
      );

      offers.push(
        new HelpOffer({
          ...sharedInfo,
          possibleHelpedUsers: samplePossibleHelpsID,
        }),
      );

      campaigns.push(
        new Campaign({
          ...sharedInfo,
          ownerId: sampleEntities[0]._id,
        }),
      );
    }

    await Help.deleteMany({});
    await HelpOffer.deleteMany({});
    await Campaign.deleteMany({});

    requests.forEach((request) => {
      Help.create(request);
    });

    offers.forEach((offer) => {
      HelpOffer.create(offer);
    });

    campaigns.forEach((campaign) => {
      Campaign.create(campaign);
    });

    console.log('Pedidos, ofertas e campanhas populados com sucesso!');
  } catch (error) {
    console.log('Não foi possível criar pedidos, ofertas e campanhas na base de dados!');
    console.log(error);
  }
};

module.exports = seedHelp;
