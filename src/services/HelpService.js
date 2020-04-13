const HelpRepository = require('../repository/HelpRepository');

class HelpService {
    constructor() {
        this.HelpRepository = new HelpRepository();
    }

    async createHelp(data) {
        try {
            
            const countHelp = await this.HelpRepository.countDocuments(data.ownerId);
            if (countHelp >= 5) {
                throw ' Limite máximo de pedidos atingido';
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
            throw 'Ajuda não encontrada';
        }

        return Help;
    }

    async getHelpList(id, status, category, except, helper) {
        const Helplist = await this.HelpRepository.list(id, status, category, except, helper);
        if (!Helplist) {
            throw 'Nenhuma Ajuda com esse status foi encontrada' ;
        }

        return Helplist;
    }

    async deleteHelpLogically(id) {
        const help = await this.getHelpByid(id);

        help.active = false;

        await this.HelpRepository.update(help);

        return {'message': `Help ${id} deleted!`};
    }

    async getListToDelete() {
        const Helplist = await this.HelpRepository.listToExpire();
        return Helplist
    }
    
    async getHelpListByStatus(id, status) {
        const Helplist = await this.HelpRepository.listByStatus(id, status);
        if (!Helplist) {
            throw new Error('Pedidos de ajuda não encontrados')
        }

        return Helplist
    }
}

module.exports = HelpService;
