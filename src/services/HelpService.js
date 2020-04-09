const HelpRepository = require('../repository/HelpRepository');

class HelpService {
    constructor() {
        this.HelpRepository = new HelpRepository();
    }

    async createHelp(data) {
        try {
            
            const countHelp = await this.HelpRepository.countDocuments(data.ownerId);
            if (countHelp >= 5) {
                throw { countHelp: ' Limite máximo de pedidos atingido' };
            }
            
            const createdHelp = await this.HelpRepository.create(data);
            return createdHelp;
        } catch (err) {
            throw err;
        }
    }

    async getHelpByid(id) {
        const Help = await this.HelpRepository.getById(id);

        if (!Help) {
            throw { Help: 'Ajuda não encontrada' };
        }

        return Help;
    }

    async getHelpList(id, status, category, except, helper) {
        const Helplist = await this.HelpRepository.list(id, status, category, except, helper);
        if (!Helplist) {
            throw { Helplist: 'Nenhuma Ajuda com esse status foi encontrada' };
        }

        return Helplist;
    }

    async deleteHelpLogically(id) {
        const help = await this.getHelpByid(id);

        help.active = false;

        await this.HelpRepository.update(help);

        return {'message': `Help ${id} deleted!`};
    }

    async updatePossibleHelpers(id,idHelper) {

        const help = await this.getHelpByid(id);

        if (!help) {
            throw 'Ajuda não encontrada';
        }

        for(let i = 0; i < help.possibleHelpers.length; i++){
            if(idHelper == help.possibleHelpers[i]){
                throw 'Você já se cadastrou nessa ajuda';
            }
        }
        
        help.possibleHelpers.push(idHelper);
       

        const result = await this.HelpRepository.update(help);

        return result;
    }
}

module.exports = HelpService;
