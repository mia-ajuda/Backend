const socketio = require('socket.io')
const { calculateDistance, convertDistance }  = require('./src/utils/geolocation/calculateDistance')

let io
const connections = [];

exports.setupWebsocket = (server) => {
    io = socketio(server)

    io.on('connection', (socket) => {
        console.log(socket.id)
        const { latitude, longitude } = socket.handshake.query

        connections.push({
            id: socket.id,
            coordinates: {
                latitude : Number(latitude),
                longitude: Number(longitude)
            }
        })

    })
}

exports.findConnections = (coordinates) => {
    return connections.filter(connection => {
        const distance = calculateDistance(coordinates, connection.coordinates)
        connection.distance = convertDistance(distance)
        return distance <= 2
    })
}

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        data.distance = connection.distance
        io.to(connection.id).emit(message, data)
    })
}