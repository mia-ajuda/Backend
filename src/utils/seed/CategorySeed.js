/* eslint-disable */
const Category = require('../../models/Category');

const mapCategories = [
    {
        name: 'Higiene Pessoal',
        description: 'São considerados produtos de higiene pessoal, papel higienico, pasta dental, absorvente feminino, fraldas, entre outros.',
    },
    {
        name: 'Apoio Social',
        description: 'Pedidos de apoio social são coisas imateriais, você pode pedir por alguém para conversar, por exemplo.',
    },
    {
        name: 'Itens de Proteção',
        description: 'Pedidos de itens de proteção são pedidos de itens como mascaras, alcool gel, luvas, entre outros.',
    },
    {
        name: 'Apoio Psicológico',
        description: 'Pedido de apoio psicológico são direcionados à psicológos, eles podem conversar com você para te ajudar com alguma dificuldade que esteja passando',
    },
    {
        name: 'Pequenos Serviços',
        description: 'Pedidos de pequenos serviços são para caso você necessite de alguém para fazer um pequeno conserto, trocar uma lâmpada, entre outras coisas.',
    },
    {
        name: 'Suprimentos Básicos',
        description: 'Pedidos de suprimentos básicos são para quando você precisa que alguém lhe traga algum item, como arroz, feijão.',
    },
    {
        name: 'Transporte de Emergência',
        description: 'Pedidos por transporte de emergência são para caso você necessite de alguém para levar você ou algum familiar ao hospital.',
    },
    {
        name: 'Apoio Físico',
        description: 'Pedidos de apoio físico são para caso precise de alguém para auxiliar em exercícios físicos, alongamentos, entre outros.',
    },
];

const seedCategory = async () => {
    try {
        const categoryCollection = await Category.find();
        // with sudo docker-compose -f docker-compose.yml up --build, the seed will work only one time
        // because the database was not dropped, so it will fail de if below
        // to continue seeding diffent users, comment the if bellow or execute sudo docker-compose down
        // to drop everything
        if (categoryCollection.length > 0) {
            return;
        }

        const categories = [];
        const quantity = mapCategories.length;
        for (let i = 0; i < quantity; i++) {
            categories.push(
                new Category({
                    name: mapCategories[i].name,
                    description: mapCategories[i].description,
                }),
            );
        }

        await Category.deleteMany({});

        categories.forEach((category) => {
            Category.create(category);
        });
        console.log('Categorias populadas com sucesso!');
    } catch (error) {
        console.log('Não foi possível popular as categorias na base de dados!');
        console.log(error);
    }
};

module.exports = seedCategory;
