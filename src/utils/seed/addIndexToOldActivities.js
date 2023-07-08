const addIndexToOldActivities = async (activityList) => {
  activityList.forEach(async (activity, index) => {
    activity.index = index;
    await activity.save();
  });
};
module.exports = addIndexToOldActivities;
