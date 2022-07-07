const socketio = require('socket.io');
const { calculateDistance } = require('./src/utils/geolocation/calculateDistance');

let io;
const connections = [];

exports.setupWebsocket = (server) => {
  io = socketio(server);

  io.on('connection', (socket) => {
    const { userPosition, userId } = socket.handshake.query;
    connections.push({
      id: socket.id,
      userId,
      userPosition,
      categories: [],
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

exports.findConnections = (category, userId) => {
  const filtered = connections.filter((connection) => {
    if (userId === connection.userId) {
      return false;
    }
    if (connection.categories.length) {
      const { categories } = connection;
      let categoryExist = false;
      for (let i = 0; i < categories.length; i += 1) {
        if (categories[i] == category) {
          categoryExist = true;
          break;
        }
      }
      if (!categoryExist) {
        return false;
      }
    }
    return true;
  });
  return filtered;
};

exports.sendMessage = (to, message, data) => {
  to.forEach((connection) => {
    if (typeof (data) === 'object' && message == 'new-help') {
      const userLocation = JSON.parse(connection.userPosition);
      const helpLocation = {
        latitude: data.user.location.coordinates[1],
        longitude: data.user.location.coordinates[0],
      };
      data.distanceValue = calculateDistance(helpLocation, userLocation);
    }

    io.to(connection.id).emit(message, data);
  });
};
