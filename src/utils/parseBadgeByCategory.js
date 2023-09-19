const parseBadgeByCategory = (badgeList) => {
  const parsedBadges = badgeList.reduce((obj, current) => {
    const { category } = current.template;
    obj[category] = {
      badge: current,
    };
    return obj;
  }, {});
  return parsedBadges;
};

module.exports = parseBadgeByCategory;
