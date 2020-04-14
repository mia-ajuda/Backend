const HelpRepository = require('../repository/HelpRepository');
const UserService = require('./UserService');

class HelpService {
    constructor() {
        this.HelpRepository = new HelpRepository();
        this.UserService = new UserService();
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

    async updatePossibleHelpers(id,idHelper) {
        const help = await this.getHelpByid(id);
        if (!help) {
            throw 'Ajuda não encontrada';
        }
        if(idHelper == help.ownerId){
            throw 'Você não pode ser ajudante de sua própria ajuda'
        }
        
        await this.UserService.getUser({id:idHelper});
        const userPosition = help.possibleHelpers.indexOf(idHelper);
        if(userPosition > -1){
            throw 'Usuário já é um possível ajudante';
        }
        
        help.possibleHelpers.push(idHelper);

        const result = await this.HelpRepository.update(help);

        return result;
    }
}

module.exports = HelpService;
