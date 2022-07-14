const Category = require('../../models/Category');

const mapCategories = [
  {
    name: 'Higiene Pessoal',
    description: `Todos precisam de itens essenciais, como itens de higiene pessoal como papel higienico, 
    lenços umidecidos, fraldas, pasta de dente, entre outros, ajude como pode quem mais precisa! 
    Seja a diferença na vida de alguém hoje!`,
  },
  {
    name: 'Apoio Social',
    description: `Todo apoio é bem-vindo, seja este afetivo, emocional e/ou motivacional! 
    Você pode colaborar contando uma história, cantando uma música, recitando um poema, 
    apresentando uma peça teatral, tocando um instrumento musical, ou apenas conversando. 
    Use a sua criatividade! Muitos precisam do seu apoio nesse momento! 
    Sua colaboração faz muita diferença! Participe!`,
  },
  {
    name: 'Itens de Proteção',
    description: `Em momentos difíceis como este, precisamos nos proteger e proteger nossos parentes e entes queridos, 
    ajude pessoas doando ou comprando para elas itens como máscaras, alcool gel, luvas, entre outros. 
    Vamos todos nos ajudar!`,
  },
  {
    name: 'Apoio Psicológico',
    description: `Pessoas em estado de isolamento tendem a se sentir mais tristes ou ansiosas do que o normal. 
    Ajude uma pessoa que está passando por esse momento sozinho.`,
  },
  {
    name: 'Pequenos Serviços',
    description: `As pequenas coisas podem fazer diferença. 
    Colabore ajudando em um pequeno conserto ou até mesmo trocando uma lâmpada. 
    Toda forma de ajuda é necessária, para aqueles que mais precisam!`,
  },
  {
    name: 'Suprimentos Básicos',
    description: `Todo mundo precisa do básico para viver, seja com um pacote de arroz, um quilo de feijão, 
    ou até mesmo uma duzia de ovos. Você pode ajudar quem mais precisa ou não tem como ir ao mercado! 
    Faça a diferença!`,
  },
  {
    name: 'Transporte de Emergência',
    description: `As vezes, um pequeno gesto pode salvar uma vida, 
    alguém pode estar precisando de uma carona para o hospital. 
    Ajude, mas proteja-se! Você pode ser o motivo de agradecimento de alguém.`,
  },
  {
    name: 'Apoio Físico',
    description: `Não podemos ficar parados, sedentarismo pode atrair diversas doenças. 
    Ajude quem mais precisa com alguma série de exercícios físicos, ou até mesmo em uma sessão de alongamentos. 
    Vamos nos movimentar!`,
  },
];

const seedCategory = async () => {
  try {
    const categoryCollection = await Category.find();

    // this condition avoid populate duplicate users
    if (categoryCollection.length > 0) {
      return;
    }

    const categories = [];
    const quantity = mapCategories.length;
    for (let i = 0; i < quantity; i += 1) {
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
