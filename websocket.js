const socketio = require('socket.io')
const { calculateDistance, convertDistance, getDistance }  = require('./src/utils/geolocation/calculateDistance')

let io
const connections = [];

exports.setupWebsocket = (server) => {
    io = socketio(server)

    io.on('connection', (socket) => {
        const { locations, currentRegion } = socket.handshake.query

        connections.push({
            id: socket.id,
            currentRegion,
            locations
        })

    })
}

exports.findConnections = (coordinates) => {
    return connections.filter(connection => {
        let should = false
        const locs = JSON.parse(connection.locations)
        locs.every(location => {
            const distance = calculateDistance(coordinates, location)
            if(distance < 2) {
                connection.distance = getDistance(JSON.parse(connection.currentRegion), coordinates)
                should = true
                return false
            }
            return true
        })
        return should
    })
}

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        data.distance = connection.distance
        io.to(connection.id).emit(message, data)
    })
}