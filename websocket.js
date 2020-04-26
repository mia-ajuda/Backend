const socketio = require('socket.io');
const { calculateDistance, getDistance } = require('./src/utils/geolocation/calculateDistance');

let io;
let connections = [];

exports.setupWebsocket = (server) => {
    io = socketio(server);

    io.on('connection', (socket) => {
        const { currentRegion } = socket.handshake.query;
        
        connections.push({
            id: socket.id,
            currentRegion,
            locations: [currentRegion],
            categories:[]
        });
        

        socket.on('change-locations', (locations) => {
            const index = connections.map((connection) => connection.id).indexOf(socket.id);
            //console.log(JSON.stringify(locations)+'salsicha')
            if (index >= 0) {
                connections[index].locations = locations;
            }
        });

        socket.on('change-categories', (categories) => {
            const index = connections.map((connection) => connection.id).indexOf(socket.id);
            if (index >= 0) {
                connections[index].categories = categories;
            }
        });

        socket.on('disconnect', () => {
            const index = connections.map((connection) => connection.id).indexOf(socket.id);
            if (index >= 0) {
                connections.splice(index, 1);
            }
        });
    });
};

function canParse(locs){
    //console.log(JSON.stringify(locs));
    try{
        JSON.parse(locs)
        return true
    }catch{
        return false;
    }
}
exports.findConnections = (coordinates, category) => {
    console.log(connections)
    return connections.filter((connection) => {
        if (connection.categories && connection.categories.length) {
            const categories = connection.categories;
            if (categories.length && !categories.includes(category)) {
                return false;
            }
        }
        
        let should = false;
        let locs =  connection.locations;
        
        if(canParse(locs)){
            locs = [JSON.parse(locs)];
        }
        
        locs.every((location) => {
            let distance = calculateDistance(coordinates, location);
            if (distance < 2) {
                distance = getDistance(JSON.parse(connection.currentRegion), coordinates);
                connection.distance = distance;
                should = true;
                return false;
            }
            return true;
        });
        return should;
    })
};

exports.sendMessage = (to, message, data) => {
    to.forEach((connection) => {
        data.distance = connection.distance;
        io.to(connection.id).emit(message, data);
    });
};
