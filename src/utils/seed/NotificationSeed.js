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
        for(let i = 0; i < quantity; i++) {
            const sampleHelp = await lodash.sample(helpCollection);
            const sampleNotificationType = await lodash.sample(
                notificationTypes);
            
            notifications.push({
                helpId: sampleHelp._id,
                title: faker.lorem.words(5),
                body: faker.lorem.paragraph(),
                notificationType: sampleNotificationType
            });
        }

        await Notification.deleteMany({});

        for(let i = 0; i < quantity; i++) {
            await Notification.create(notifications[i]);
        }

        const notificationCollectionId = await Notification.find({}, '_id');
        const notificationArrayId = await notificationCollectionId.map((obj) => {
            return obj.id;
        })

        for(let i = 0; i < userCollection.length; i++) {
            const sampleNotifications = await lodash.sampleSize(
                notificationArrayId,
                faker.random.number(quantity % faker.random.number({'min': 1, 'max': 50})));
            
            userCollection[i].notificationHistory = await sampleNotifications;
            await userCollection[i].save();
        }

        console.log('Notificações populadas com sucesso!');
    } catch (error) {
        console.log('Não foi possível popular as notificações na base de dados!');
        console.log(error);
    }
};

module.exports = notificationSeed;
