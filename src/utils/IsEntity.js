const isEntity = (userName) => {
  let userType = userName.trim().split(' ');
  userType = userType.pop();

  if (userType === 'PJ') {
    return true;
  }
  return false;
};

module.exports = isEntity;
