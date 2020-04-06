const HelpService = require('../services/HelpService')
const UserService = require('../services/UserService')
const notify = require('./Notification')
const nodeSchedule = require('node-schedule')

function dailySchedule() {
    nodeSchedule.scheduleJob('5 * * * * *', async () => {
        const helpService = new HelpService();
        const userService = new UserService();
        const helpsToDelete = await helpService.getListToDelete()
        console.log(helpsToDelete)
        let messages = []
        for (let help of helpsToDelete) {
            let user = userService.getUser(help.ownerId)
            console.log(help)
            console.log(user)
            let message = {
                to: user.deviceId,
                sound: 'default',
                body: 'Seu pedido de ajuda expirou',
                data: { Pedido: help.description }
            }
            messages.push(message)
        }
        console.log(messages[0])
        try {
            notify(messages)
        } catch (err) {
            console.log(err)
        }
        return await Promise.all(helpsToDelete.map(async (help) => {
            try {
                return await helpService.delete(help)
            } catch (err) {
                throw err
            }
        }))
    })
}

// * * 08,18 * * *

module.exports = dailySchedule