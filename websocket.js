const socketio = require('socket.io');
const { calculateDistance, getDistance } = require('./src/utils/geolocation/calculateDistance');

let io;
const connections = [];

exports.setupWebsocket = (server) => {
  io = socketio(server);

  io.on('connection', (socket) => {
    const { currentRegion, userId } = socket.handshake.query;

    connections.push({
      id: socket.id,
      userId,
      currentRegion,
      locations: [currentRegion],
      categories: [],
    });


    socket.on('change-locations', (locations) => {
      const index = connections.map((connection) => connection.id).indexOf(socket.id);
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

function canParse(locs) {
  try {
    JSON.parse(locs);
    return true;
  } catch (err) {
    return false;
  }
}
exports.findConnections = (coordinates, category, userId) => {
  const filtered = connections.filter((connection) => {
    if (userId === connection.userId) {
      return false;
    }
    if (connection.categories && connection.categories.length) {
      const { categories } = connection;
      if (!categories.includes(category)) {
        return false;
      }
    }
    let should = false;
    let locs = connection.locations;
    if (canParse(locs)) {
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
  });
  return filtered;
};

exports.sendMessage = (to, message, data) => {
  to.forEach((connection) => {
    data.distance = connection.distance;
    io.to(connection.id).emit(message, data);
  });
};
