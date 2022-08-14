const getLocation = (obj) => {
  if (obj.location) {
    return obj.location.coordinates;
  }
  return obj.user.location.coordinates;
};

module.exports = getLocation;
