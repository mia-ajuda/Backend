const EntityService = require("../../src/services/EntityService");


jest.mock("../../src/repository/EntityRepository", () => {
  const entities = [
    {
      name: "Jotaro Joestar",
      email: "jotaro@jojo.com",
      cnpj: "84.293.871/0001-30",
      photo: "foto Jotaro",
      address: {
        cep: "59073-280",
        number: 1,
        city: "Natal",
        state: "RN",
        complement: "",
      },
      phone: "64 99875-8236",
      registerDate: "2022-08-10T20:37:40.555Z",
      active: true
    },
    {
      name: "Giorno Giovanna",
      email: "gio@jojo.com",
      cnpj: "84.293.871/0001-30",
      photo: "foto Giorno",
      address: {
        cep: "29115-102",
        number: 1,
        city: "Vila Velha",
        state: "ES",
        complement: "",
      },
      phone: "64 99999-8888",
      registerDate: "2022-08-10T20:37:40.092Z",
      active: true
    }
  ];


  return jest.fn().mockImplementation(() => {
    return {
      getById: jest.fn().mockImplementation(id => {
        return entities[id];
      }),
      getEntityByEmail: jest.fn().mockImplementation(email => {
        return entities.find(element => element.email == email);
      })
    }
  })
});


const service = new EntityService();


describe('#EntityService', () => {
  describe('#getEntity', () => {
    it('throw error if both id and email are undefined', () => {
      const callGetEntity = async () => {
        await service.getEntity({ id: undefined, email: undefined });
      };

      expect(callGetEntity).rejects.toThrow(new Error('Nenhum identificador encontrado'));
    });

    it('return entity if id exists and email is undefined', async () => {
      const data = await service.getEntity({
        id: 1
      });

      expect(data).toEqual(
        {
          name: "Giorno Giovanna",
          email: "gio@jojo.com",
          cnpj: "84.293.871/0001-30",
          photo: "foto Giorno",
          address: {
            cep: "29115-102",
            number: 1,
            city: "Vila Velha",
            state: "ES",
            complement: "",
          },
          phone: "64 99999-8888",
          registerDate: "2022-08-10T20:37:40.092Z",
          active: true
        }
      );
    });

    it('return entity if id is undefined and email exists', async () => {
      const data = await service.getEntity({
        email: "jotaro@jojo.com"
      });

      expect(data).toEqual(
        {
          name: "Jotaro Joestar",
          email: "jotaro@jojo.com",
          cnpj: "84.293.871/0001-30",
          photo: "foto Jotaro",
          address: {
            cep: "59073-280",
            number: 1,
            city: "Natal",
            state: "RN",
            complement: "",
          },
          phone: "64 99875-8236",
          registerDate: "2022-08-10T20:37:40.555Z",
          active: true
        }
      );
    });

    it('return entity if both id and email exists', async () => {
      const data = await service.getEntity({
        id: 1,
        email: "gio@jojo.com"
      });

      expect(data).toEqual(
        {
          name: "Giorno Giovanna",
          email: "gio@jojo.com",
          cnpj: "84.293.871/0001-30",
          photo: "foto Giorno",
          address: {
            cep: "29115-102",
            number: 1,
            city: "Vila Velha",
            state: "ES",
            complement: "",
          },
          phone: "64 99999-8888",
          registerDate: "2022-08-10T20:37:40.092Z",
          active: true
        }
      );
    });

    it('throw error if entity is undefined when id is invalid and email is undefined', () => {
      const callGetEntity = async () => {
        await service.getEntity({
          id: 3
        });
      };

      expect(callGetEntity).rejects.toThrow(new Error('Usuário não encontrado'));
    });

    it('throw error if entity is undefined when id is undefined and email is is invalid', () => {
      const callGetEntity = async () => {
        await service.getEntity({
          email: "jorge@neves.com"
        });
      };

      expect(callGetEntity).rejects.toThrow(new Error('Usuário não encontrado'));
    });

    it('throw error if entity is undefined when both id and email are invalid', () => {
      const callGetEntity = async () => {
        await service.getEntity({
          id: 3,
          email: "jorge@neves.com"
        });
      };

      expect(callGetEntity).rejects.toThrow(new Error('Usuário não encontrado'));
    });
  });
});