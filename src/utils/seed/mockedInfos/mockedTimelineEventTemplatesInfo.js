const timelineEnum = require('../../enums/timelineEnum');

const mockedTimelineEventTemplates = [
  {
    _id: timelineEnum.register,
    title: 'Se cadastrou no aplicativo',
    description: 'Começou a fazer parte da comunidade para ajudar pessoas ou ser ajudado.',
    iconName: 'sign-direction',
  },
  {
    _id: timelineEnum.offerHelp,
    title: 'Ofereceu ajuda a um pedido',
    description: 'Você tentou fazer a diferença na vida de uma pessoa pela primeira vez utilizando o aplicativo Mia Ajuda.',
    iconName: 'hand-heart',
  },
  {
    _id: timelineEnum.createRequest,
    title: 'Criou um pedido de ajuda',
    description: 'Você conseguiu criar um pedido de ajuda no aplicativo.',
    iconName: 'hand-back-right',
  },
  {
    _id: timelineEnum.finishRequest,
    title: 'Finalizou um pedido de ajuda',
    description: 'Alguém conseguiu te ajudar e seu pedido foi finalizado.',
    iconName: 'hands-pray',
  },
  {
    _id: timelineEnum.feedback,
    title: 'Deixou um feedback',
    description: 'Você deixou um feedback para uma pessoa que te ajudou, mostrando para ela a importância de sua ajuda.',
    iconName: 'message',
  },
  {
    _id: timelineEnum.offer,
    title: 'Realizou uma oferta',
    description: 'Você realizou uma oferta de ajuda para uma pessoa que precisava.',
    iconName: 'star',
  },
];

module.exports = mockedTimelineEventTemplates;
