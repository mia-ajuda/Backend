<<<<<<< HEAD
class BaseRepository {
  constructor(modelClass) {
    this.modelClass = modelClass;
  }

  async $save(dataModel, mongoSession = {}) {
    if (dataModel._id) {
      dataModel.lastUpdateDate = Date.now();
    }
    const savedModel = await new this.modelClass(dataModel).save({
      session: mongoSession.session
    });
    return savedModel;
  }

  async $saveMany(itemsModel, mongoSession = {}) {
    itemsModel.forEach(item => {
      item.lastUpdateDate = this.newDate();
    });
    const savedModels = await this.modelClass.insertMany(itemsModel, {
      session: mongoSession.session
    });
    return savedModels;
  }

  async $update(dataModel, mongoSession = {}) {
    dataModel.lastUpdateDate = this.newDate();
    const savedModel = await dataModel.save({ session: mongoSession.session });
    return savedModel;
  }

  async $listAggregate(aggregationPipeline) {
    return await this.modelClass.aggregate(aggregationPipeline).exec();
  }

  async $getById(id) {
    const recordModel = await this.modelClass.findById(id);

    return recordModel;
  }

  async $list(query) {
    const recordModel = await this.modelClass.find(query);
    return recordModel;
  }

  async findOne(query, mongoSession = {}) {
    if (mongoSession !== undefined || mongoSession.session !== undefined) {
      return await this.modelClass.findOne(query).session(mongoSession.session);
    }
    return await this.modelClass.findOne(query);
  }
=======
const mongoose = require('mongoose')

class BaseRepository {

    constructor(modelClass) {
        this.modelClass = modelClass;
    }


    async $save(dataModel, mongoSession = {}) {
        if(dataModel._id) {
            dataModel.lastUpdateDate = Date.now();
        }
        const savedModel = await (new this.modelClass(dataModel)).save({session: mongoSession.session});
        return savedModel;
    }


    async $saveMany(itemsModel, mongoSession = {}) {
        itemsModel.forEach(item => {
            item.lastUpdateDate = Date.now();
        })
        const savedModels = await this.modelClass.insertMany(itemsModel, {session: mongoSession.session});
        return savedModels;
    }


    async $update(dataModel, mongoSession = {}) {
        dataModel.lastUpdateDate = Date.now();
        const savedModel = await dataModel.save({session: mongoSession.session});
        return savedModel;
    }

    async $listAggregate(aggregationPipeline) {
        return await this.modelClass.aggregate(aggregationPipeline).exec();
    }

    /**
     * @param {string} id Id do objeto
     * @param {Boolean} [active = true] se vou pegar ou não elementos deletados. Se for false, mesmo elementos removidos serão exibidos.
     */
    async $getById(id, active = true) {
        let finalIdFormat = id;

        if(typeof id === "string") {
            finalIdFormat = mongoose.Types.ObjectId(id);
        }

        const query = {
            _id: finalIdFormat,
        }

        if (active) {
            query['active'] = true
        }

        const recordModel = await this.modelClass.findOne(query);

        return recordModel;
    }


    async $list(query) {
        const recordModel = await this.modelClass.find(query);
        return recordModel;
    }


    async findOne(query, mongoSession = {}) {
        if(mongoSession !== undefined
            || mongoSession.session !== undefined) {
            return await this.modelClass.findOne(query).session(mongoSession.session);
        }
        return await this.modelClass.findOne(query);
    }
>>>>>>> 28e35e3a77db63ac7966141a27238e331f1bb0d2
}

module.exports = BaseRepository;
