const Category = require('../../models/Category')

const mapCategories = [
    {   
        name: "Higiene Pessoal",
        description: "Higiene Pessoal"
    },
    {
        name: "Apoio Social",
        description: "Apoio Social"
    },
    {
        name: "Itens de Proteção",
        description: "Itens de Proteção"
    },
    {
        name: "Apoio Psicológico",
        description: "Apoio Psicológico"
    },
    {
        name: "Pequenos Serviços",
        description: "Pequenos Serviços"
    },
    {
        name: "Suprimentos Básicos",
        description: "Suprimentos Básicos"
    },
    {
        name: "Transporte de Emergência",
        description: "Transporte de Emergência"
    },
    {
        name: "Apoio Físico",
        description: "Apoio Físico"
    }
]

const seedCategory = async () => {
    try {
        const categoryCollection = await Category.find()
        if(categoryCollection.length > 0) {
            return
        }
        
        let categories = []
        const quantity = mapCategories.length
        for(let i = 0; i < quantity; i++) {
            categories.push(
                new Category({
                    name: mapCategories[i].name,
                    description: mapCategories[i].description
                })
            )
        }

        await Category.deleteMany({})

        categories.forEach(category => {
            Category.create(category)
        })
        console.log('Categorias populadas com sucesso!')
    } catch(error) {
        console.log('Não foi possível popular as categorias na base de dados!')
        console.log(error)
    }
}

module.exports = seedCategory
