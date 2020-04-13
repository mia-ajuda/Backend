const HelpService = require('../services/HelpService')
const UserService = require('../services/UserService')
const notify = require('./Notification')
const nodeSchedule = require('node-schedule')

function dailySchedule() {
    nodeSchedule.scheduleJob('* * 08,18 * * *', async () => {
        const helpService = new HelpService();
        const userService = new UserService();
        const helpsToDelete = await helpService.getListToDelete()
        console.log(helpsToDelete)
        let messages = []
        for (let help of helpsToDelete) {
            let user = userService.getUser(help.ownerId)
            let message = {
                to: user.deviceId,
                sound: 'default',
                body: 'Seu pedido ' + help.title + ' expirou',
                data: { Pedido: help.description }
            }
            messages.push(message)
        }
        try {
            notify(messages)
        } catch (err) {
            console.log(err)
        }
        return await Promise.all(helpsToDelete.map(async (help) => {
            try {
                return await helpService.deleteHelpLogically(help.id)
            } catch (err) {
                throw err
            }
        }))
    })
}

module.exports = dailySchedule