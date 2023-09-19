const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const userRoutes = require('./UserRoutes');
const entityRoutes = require('./EntityRoutes');
const helpRoutes = require('./HelpRoutes');
const categoryRoutes = require('./CategoryRoutes');
const notificationRoutes = require('./NotificationRoutes');
const helpOfferRoutes = require('./HelpOfferRoutes');
const campaignRoutes = require('./CampaignRoutes');
const socialNetworkRoutes = require('./SocialNetworkRoutes');
const badgeRoutes = require('./BadgeRoutes');
const feedbackRoutes = require('./FeedbackRoutes');
const timelineEventRoutes = require('./TimelineEventRoutes');
const activityRoutes = require('./ActivityRoutes');

const swaggerDocument = YAML.load('docs/swagger.yaml');

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/api', [
    userRoutes,
    helpRoutes,
    categoryRoutes,
    notificationRoutes,
    entityRoutes,
    helpOfferRoutes,
    campaignRoutes,
    socialNetworkRoutes,
    badgeRoutes,
    feedbackRoutes,
    timelineEventRoutes,
    activityRoutes,
  ]);
};
