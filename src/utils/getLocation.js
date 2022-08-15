const getLocation = (obj) => {
  if (obj.location) {
    return obj.location.coordinates;
  }
  if (obj.user) {
    return obj.user.location.coordinates;
  }
  return obj.entity.location.coordinates;
};

module.exports = getLocation;
