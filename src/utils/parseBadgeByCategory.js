const parseBadgeByCategory = (badgeList) => {
  const parsedBadges = badgeList.reduce((obj, current) => {
    const { category } = current;
    if (!Object.keys(obj).includes(category)) {
      obj[category] = {
        badges: [],
        title: current.name.split(' ').slice(0, -1).join(' '),
      };
    }
    obj[category].badges.push(current);
    return obj;
  }, {});
  return parsedBadges;
};

module.exports = parseBadgeByCategory;
