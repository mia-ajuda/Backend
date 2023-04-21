const BadgeTemplate = require('../../models/BadgeTemplate');
const mockedBadges = require('./mockedInfos/mockedBadgesInfo');

const seedBadges = async () => {
  try {
    await BadgeTemplate.deleteMany({});

    const badgeCollection = await BadgeTemplate.find();

    if (badgeCollection.length > 0) {
      return;
    }

    const badges = mockedBadges.map((badge) => new BadgeTemplate(badge));

    await BadgeTemplate.deleteMany({});

    badges.forEach((badge) => {
      BadgeTemplate.create(badge);
    });
    console.log('Conquistas populadas com sucesso!');
  } catch (error) {
    console.log('Não foi possível popular as categorias na base de dados!');
    console.log(error);
  }
};

module.exports = seedBadges;
