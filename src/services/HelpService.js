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

    async ownerConfirmation(data) {
        const help = await this.getHelpByid(data.helpId);
        if(!help){
            throw 'Ajuda não encontrada';
        }
        else if(help.ownerId!=data.ownerId){
            throw 'Usuário não é o dono da ajuda';
        }
        else if(help.status == 'helperFinished'){
            help.status = 'finished';
        }
        else if(help.status == 'ownerFinished'){
            throw 'Usuário já confirmou a finalização da ajuda';
        }
        else if(help.status == 'finished'){
            throw 'Essa ajuda já foi finalizada';
        }
        else{
            help.status = 'ownerFinished';
        }
        
        
       const result = await this.HelpRepository.update(help);
       return result;
    }


}

module.exports = HelpService;
