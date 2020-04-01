const userRoutes = require('./UserRoutes');
const helpRoutes = require('./HelpRoutes');

module.exports = (app) => {
    app.use('/api', userRoutes)
    app.use('/api', helpRoutes)
}
