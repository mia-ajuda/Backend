const CampaignRepository = require('../repository/CampaignRepository');
const OfferdHelpRepository = require('../repository/HelpOfferRepository');
const HelpRepository = require('../repository/HelpRepository');
const addHelpTypeToList = require('../utils/addHelpTypeToList');
const sortActivitiesByDistance = require('../utils/sortActivitiesByDistance');

class ActivityService {
  constructor() {
    this.OfferedHelpRepository = new OfferdHelpRepository();
    this.HelpRepository = new HelpRepository();
    this.CampaignRepository = new CampaignRepository();
  }

  async getHelpList(coords, id, isUserEntity, categoryArray) {
    const Helplist = await this.HelpRepository.shortList(
      coords,
      id,
      isUserEntity,
      categoryArray,
    );
    if (!Helplist) {
      throw new Error(
        'Pedidos de ajuda não encontrados no seu raio de distância',
      );
    }

    return addHelpTypeToList(Helplist, 'help');
  }

  async getHelpOfferList(
    coords,
    id,
    isUserEntity,
    categoryArray,
    getOtherUsers,
  ) {
    const helpOffers = await this.OfferedHelpRepository.list(
      coords,
      id,
      isUserEntity,
      categoryArray,
      getOtherUsers,
    );
    const helpOffersList = addHelpTypeToList(helpOffers, 'offer');
    return helpOffersList;
  }

  async getCampaignList(coords, except, id, categoryArray) {
    const CampaignList = await this.CampaignRepository.listNear(
      coords,
      except,
      id,
      categoryArray,
    );
    if (!CampaignList) {
      throw new Error(
        'Nenhuma campanha foi encontrada no seu raio de distância',
      );
    }

    return addHelpTypeToList(CampaignList, 'campaign');
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

    activitiesArray.forEach((activity) => {
      switch (activity) {
      case 'help': {
        promises.push(
          this.getHelpList(coords, id, isUserEntity, categoryArray),
        );
        break;
      }

      case 'helpOffer': {
        promises.push(
          this.getHelpOfferList(
            coords,
            id,
            isUserEntity,
            categoryArray,
            getOtherUsers,
          ),
        );
        break;
      }

      case 'campaign': {
        promises.push(
          this.getCampaignList(coords, null, id, categoryArray),
        );
        break;
      }

      default: {
        const promisesList = Promise.all([
          this.getCampaignList(coords, true, id, categoryArray),
          this.getHelpOfferList(
            coords,
            id,
            isUserEntity,
            categoryArray,
            getOtherUsers,
          ),
          this.getHelpList(coords, id, isUserEntity, categoryArray),
        ]);
        promises.push(promisesList);
      }
      }
    });
    const activitiesList = await Promise.all(promises);

    const flattedList = activitiesList.flat(2);

    return sortActivitiesByDistance({ helpList: flattedList });
  }
}

module.exports = ActivityService;
