const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const userRoutes = require('./UserRoutes');
const helpRoutes = require('./HelpRoutes');
const categoryRoutes = require('./CategoryRoutes');
const notificationRoutes = require('./NotificationRoutes');

const swaggerDocument = YAML.load('docs/swagger.yaml');

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/api', [userRoutes, helpRoutes, categoryRoutes, notificationRoutes]);
};
