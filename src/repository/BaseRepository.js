
class BaseRepository {

    constructor(modelClass) {
        this.modelClass = modelClass;
    }


    async $save(dataModel, mongoSession = {}) {
        if (dataModel._id) {
            dataModel.lastUpdateDate = Date.now();
        }
        const savedModel = await (new this.modelClass(dataModel)).save({ session: mongoSession.session });
        return savedModel;
    }


    async $saveMany(itemsModel, mongoSession = {}) {
        itemsModel.forEach(item => {
            item.lastUpdateDate = new Date()
        })
        const savedModels = await this.modelClass.insertMany(itemsModel, { session: mongoSession.session });
        return savedModels;
    }


    async $update(dataModel, mongoSession = {}) {
        dataModel.lastUpdateDate = new Date();
        const savedModel = await (new this.modelClass(dataModel)).save({ session: mongoSession.session });
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
        if (mongoSession !== undefined
            || mongoSession.session !== undefined) {
            return await this.modelClass.findOne(query).session(mongoSession.session);
        }
        return await this.modelClass.findOne(query);
    }
}

module.exports = BaseRepository;