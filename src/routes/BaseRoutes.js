const userRoutes = require('./UserRoutes');


module.exports = (app) => {
    app.use('/api', userRoutes)
}
