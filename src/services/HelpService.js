const HelpRepository = require('../repository/HelpRepository');

class HelpService {
    constructor() {
        this.HelpRepository = new HelpRepository();
    }

    async createHelp(data) {
        try {

            const createdHelp = await this.HelpRepository.create(data);
            
            return createdHelp;
        } catch(err) {
            throw err;
        }
    }

    async getHelpByid(id) {
        const Help = await this.HelpRepository.getById(id);

        if (!Help) {
            throw new Error('Pedido de ajuda não encontrado')
        }

        return Help
    }

    async getHelpList(query) {
        const Helplist = await this.HelpRepository.list(query);

        if (!Helplist) {
            throw new Error('Pedidos de ajuda não encontrados')
        }

        return Help
    }
}

module.exports = HelpService