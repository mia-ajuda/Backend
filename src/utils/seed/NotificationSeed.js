const lodash = require('lodash');
const faker = require('faker/locale/pt_BR');
const Help = require('../../models/Help');
const User = require('../../models/User');
const { Notification } = require('../../models/Notification');

const notificationTypes = ['ajudaRecebida', 'ajudaAceita', 'ajudaFinalizada', 'ajudaExpirada', 'outros'];

const notificationSeed = async () => {
  try {
    const userCollection = await User.find();
    const helpCollection = await Help.find();
    const notificationCollection = await Notification.find();

    // this condition avoid populate duplicate users
    if (notificationCollection.length > 0) {
      return;
    }

    const quantity = 500;
    const notifications = [];
    for (let i = 0; i < quantity; i += 1) {
      const sampleUser = lodash.sample(userCollection);
      const sampleHelp = lodash.sample(helpCollection);
      const sampleNotificationType = lodash.sample(notificationTypes);

      notifications.push({
        userId: sampleUser._id,
        helpId: sampleHelp._id,
        title: faker.lorem.words(5),
        body: faker.lorem.paragraph(),
        notificationType: sampleNotificationType,
      });
    }

    await Notification.deleteMany({});

    notifications.forEach((notification) => {
      Notification.create(notification);
    });

    console.log('Notificações populadas com sucesso!');
  } catch (error) {
    console.log('Não foi possível popular as notificações na base de dados!');
    console.log(error);
  }
};

module.exports = notificationSeed;
