const HelpRepository = require('../repository/HelpRepository');

class HelpService {
    constructor() {
        this.HelpRepository = new HelpRepository();
    }

    async createHelp(data) {
        try {
            const createdHelp = await this.HelpRepository.create(data);

            return createdHelp;
        } catch (err) {
            throw err;
        }
    }

    async getHelpByid(id) {
        const Help = await this.HelpRepository.getById(id);

        if (!Help) {
            throw new Error('Pedido de ajuda não encontrado');
        }

        return Help;
    }

    async getHelpList(id) {
        const Helplist = await this.HelpRepository.list(id);
        if (!Helplist) {
            throw new Error('Pedidos de ajuda não encontrados');
        }

        return Helplist;
    }

    async delete(data) {
        try {
            return await this.HelpRepository.delete(data)
        } catch (err) {
            throw err;
        }
    }

    async getListToDelete() {
        const Helplist = await this.HelpRepository.listToExpire();
        return Helplist
    }
    
    async getHelpListByStatus(id, status) {
        const Helplist = await this.HelpRepository.listByStatus(id, status);
        if (!Helplist) {
            throw new Error('Pedidos de ajuda não encontrados');
        }

        return Helplist;
    }
}

module.exports = HelpService;
