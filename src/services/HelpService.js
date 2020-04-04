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
            throw {error: 'Pedido de ajuda não encontrado'}
        }

        return Help
    }

    async getHelpList(id) {
        const Helplist = await this.HelpRepository.list(id);
        if (!Helplist) {
            throw new Error('Pedidos de ajuda não encontrados')
        }

        return Helplist
    }

    async getHelpListByStatus(id, status) {
        const Helplist = await this.HelpRepository.listByStatus(id, status)
        if (!Helplist) {
            throw new Error('Pedidos de ajuda não encontrados')
        }

        return Helplist
    }
    async deleteHelpLogically(id) {
        const help = await this.getHelpByid(id);

        help.active = false;

        await this.HelpRepository.update(help);
    }
}

module.exports = HelpService