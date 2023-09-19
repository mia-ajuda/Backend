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
      help: () => this.HelpRepository.shortList(coords, id, isUserEntity, categoryArray),
      helpOffer: () => this.OfferedHelpRepository.list(id, isUserEntity, categoryArray, getOtherUsers, coords),
      campaign: () => this.CampaignRepository.listNear(coords, true, id, categoryArray),
    };

    activitiesArray.forEach((activity) => {
      if (mappedActivitiesRepositories[activity]) promises.push(mappedActivitiesRepositories[activity]());
    });

    if (!promises.length) {
      const promisesList = Promise.all([
        mappedActivitiesRepositories.help(),
        mappedActivitiesRepositories.helpOffer(),
        mappedActivitiesRepositories.campaign(),
      ]);
      promises.push(promisesList);
    }

    const activitiesList = await Promise.all(promises);

    const flattedList = activitiesList.flat(2);

    return sortActivitiesByDistance({ helpList: flattedList });
  }
}

module.exports = ActivityService;
