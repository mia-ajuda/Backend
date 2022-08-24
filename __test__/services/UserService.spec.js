const UserRepository = require('../../src/repository/UserRepository');
const UserService = require('../../src/services/UserService');

const service = new UserService();

jest.mock('../../src/repository/UserRepository', () => {
  return jest.fn().mockImplementation(() => ({
    getById: jest.fn().mockImplementation(id => {
      if(id === 1234) return { id: 1234 }
      return undefined
    }),
    getUserByEmail: jest.fn().mockImplementation(email => {
      if(email === 'gabriel@email.com') return { id: 1234 }
      return undefined
    }),
  }));
});

describe('#UserService', () => {
  describe('#getUser', () => {
    it('succes case with getUserByEmail', async () => {
      const result = await service.getUser({ email: 'gabriel@email.com' });
  
      expect(result).toEqual({ id: 1234 });
    })

    it('succes case with getById', async () => {
      const result = await service.getUser({ id: 1234, email: undefined });

      expect(result).toEqual({ id: 1234 });
    });

    it('throw error if id or email is undefined', () => {
      const callGetUser = async () => {
        await service.getUser({ id: undefined, email: undefined });
      };

      expect(callGetUser).rejects.toThrow(new Error('Nenhum identificador encontrado'));
    });

    it('throw error if user is undefinied by getById', () => {
      const callGetUser = async () => {
        await service.getUser({ id: 2 });
      }

      expect(callGetUser).rejects.toThrow(new Error('Usuário não encontrado'));
    });

    it('throw error if user is undefinied by getByUserEmail', () => {
      const callGetUser = async () => {
        await service.getUser({ email: 'narutin@gmail.com' });
      }

      expect(callGetUser).rejects.toThrow(new Error('Usuário não encontrado'));
    });
  });
});
