/* eslint-disable no-undef */
const UserService = require('../../src/services/UserService');

const service = new UserService();

describe('#UserService', () => {
  describe('#getUser', () => {
    it('throw error if id or email is undefined', () => {
      const callGetUser = async () => {
        await service.getUser({});
      };

      expect(callGetUser).rejects.toThrow(new Error('Nenhum identificador encontrado'));
    });
  });
});
