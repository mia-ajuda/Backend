const isEntity = (userName) => {
  let userType = userName.trim().split(' ');
  userType = userType.pop();

  return userType === 'PJ';
};

module.exports = isEntity;
