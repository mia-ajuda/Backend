const CampaignRepository = require('../repository/CampaignRepository');
const OfferdHelpRepository = require('../repository/HelpOfferRepository');
const HelpRepository = require('../repository/HelpRepository');
const sortActivitiesByDistance = require('../utils/sortActivitiesByDistance');

class ActivityService {
  constructor() {
    this.OfferedHelpRepository = new OfferdHelpRepository();
    this.HelpRepository = new HelpRepository();
    this.CampaignRepository = new CampaignRepository();
  }

  async fetchActivityList(
    coords,
    id,
    isUserEntity,
    categoryArray,
    activitiesArray,
    getOtherUsers,
  ) {
    const promises = [];

    const mappedActivitiesRepositories = {
      help: this.HelpRepository.shortList(coords, id, isUserEntity, categoryArray),
      helpOffer: this.OfferedHelpRepository.list(id, isUserEntity, categoryArray, getOtherUsers, coords),
      campaign: this.CampaignRepository.listNear(coords, null, id, categoryArray),
    };

    for (const activity in activitiesArray) {
      if (mappedActivitiesRepositories[activity]) promises.push(mappedActivitiesRepositories[activity]);
    };

    if (!promises.length) {
      const promisesList = Promise.all([
        this.HelpRepository.shortList(coords, id, isUserEntity, categoryArray),
        this.OfferedHelpRepository.list(id, isUserEntity, categoryArray, getOtherUsers, coords),
        this.CampaignRepository.listNear(coords, null, id, categoryArray),
      ]);
      promises.push(promisesList);
    };
    
    const activitiesList = await Promise.all(promises);

    const flattedList = activitiesList.flat(2);

    return sortActivitiesByDistance({ helpList: flattedList });
  }
}

module.exports = ActivityService;
