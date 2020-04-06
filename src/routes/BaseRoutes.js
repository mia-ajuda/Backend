const userRoutes = require('./UserRoutes');
const helpRoutes = require('./HelpRoutes');
const categoryRoutes = require('./CategoryRoutes');

module.exports = (app) => {
    app.use('/api', [userRoutes, helpRoutes, categoryRoutes]);
};
