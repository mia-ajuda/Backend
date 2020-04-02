const HelpService = require('../services/HelpService')
const nodeSchedule = require('node-schedule')

function dailySchedule() {
    nodeSchedule.scheduleJob('* * 08,18 * * *', async () => {
        const helpService = new HelpService();
        const helpsToDelete = await helpService.getListToDelete()
        return await Promise.all(helpsToDelete.map(async (help) => {
            try {
                return await helpService.delete(help)
            } catch (err) {
                throw err
            }
        }))
    })
}

module.exports = dailySchedule