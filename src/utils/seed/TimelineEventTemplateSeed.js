const TimelineEventTemplate = require('../../models/TimelineEventTemplate');
const mockedTimelineEventTemplates = require('./mockedInfos/mockedTimelineEventTemplatesInfo');

const seedTimelineEventTemplates = async () => {
  try {
    const timelineEventTemplateCollection = await TimelineEventTemplate.find();
    if (timelineEventTemplateCollection.length > 0) {
      return;
    }
    const timelineEventTemplates = mockedTimelineEventTemplates.map(
      (timelineEventTemplate) => new TimelineEventTemplate(timelineEventTemplate),
    );
    await TimelineEventTemplate.deleteMany({});
    timelineEventTemplates.forEach((timelineEventTemplate) => {
      TimelineEventTemplate.create(timelineEventTemplate);
    });
    console.log('Templates de eventos de linha do tempo populados com sucesso!');
  } catch (error) {
    console.log('Não foi possível popular os templates de eventos de linha do tempo na base de dados!');
    console.log(error);
  }
};

module.exports = seedTimelineEventTemplates;
