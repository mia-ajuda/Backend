const CategoryRepository = require('../repository/CategoryRepository');

class CategoryService {
    constructor() {
        this.CategoryRepository = new CategoryRepository();
    }

    async getCategoryByid(id) {
        const Category = await this.CategoryRepository.getById(id);

        if (!Category) {
            throw new Error('Categoria não encontrada');
        }

        return Category;
    }

    async getCategoryList(id) {
        const Categorylist = await this.CategoryRepository.list(id);
        if (!Categorylist) {
            throw new Error('Categorias não encontradas');
        }

        return Categorylist;
    }

    async getHelpListByStatus(id, status) {
        const Categorylist = await this.CategoryRepository.listByStatus(id, status);
        if (!Categorylist) {
            throw new Error('Categorias não encontradas');
        }

        return Categorylist;
    }
}

module.exports = CategoryService;
