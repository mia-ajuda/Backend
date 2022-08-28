const should = require('should');
const OngFunctions = require('../src/controllers/OngController');

describe('cadastrar ONG', () => {
    it('Cadastrar ONG 1', () => {
        OngFunctions.createOng
        (
        "Joana e Luís Restaurante ME",
        "03075080000132",
        "115428340878",
        new Date(1995, 11, 25),
        "www.joanaeluis.com.br",
        "joaneluis@gmail.com",
        "61991284234",
        "123456",
        "123456" // confirmação de senha correta
        ).should.be.equal(1) // 1 = sucesso
    })
    it('Cadastrar ONG 2', () => {
        OngFunctions.createOng
        (
        "Joana e Luís Restaurante ME",
        "03075080000132",
        "115428340878",
        new Date(1995, 11, 25),
        "www.joanaeluis.com.br",
        "joaneluis@gmail.com",
        "61991284234",
        "123456",
        "000000" // confirmação de senha errada
        ).should.be.equal(0) // 0 = erro
    })
    it('Cadastrar ONG 3', () => {
        OngFunctions.createOng
        (
        "Ong Do Bem",
        "030750800001GG", // CNPJ inválido
        "115428340878",
        new Date(1995, 11, 25),
        "www.joanaeluis.com.br",
        "joaneluis@gmail.com",
        "61991284234",
        "303030",
        "303030"
        ).should.be.equal(0) // 0 = erro
    })
    it('Cadastrar ONG 4', () => {
        OngFunctions.createOng
        (
            "Ong Do Bem 2",
            "03075080000890",
            "115428340AAA", // Inscrição estadual inválida - possui letras
            new Date(1995, 11, 25),
            "www.joanaeluis.com.br",
            "joaneluis@gmail.com",
            "61991284234",
            "303030",
            "303030"
        ).should.be.equal(0) // 0 = erro
    })
        it('Cadastrar ONG 5', () => {
            OngFunctions.createOng
            (
                "Ong Do Bem 3",
                "03075080000890",
                "115428340000",
                new Date(1995, 11, 25),
                "www.joanaeluis.com.br",
                "joaneluis@gmail.com",
                "619912GGGG4", // Telefone inválido - possui letras
                "303030",
                "303030"
            ).should.be.equal(0) // 0 = erro
        })
    it('Cadastrar ONG 6', () => {
        OngFunctions.createOng
        (
            "Ong Do Bem 4",
            "03075080000", // CNPJ com menos de 14 dígitos
            "115428340222", 
            new Date(1995, 11, 25),
            "www.joanaeluis.com.br",
            "joaneluis@gmail.com",
            "61991284234",
            "303030",
            "303030"
        ).should.be.equal(0) // 0 = erro
    })
    it('Cadastrar ONG 7', () => {
        OngFunctions.createOng
        (
            "Ong Do Bem 5",
            "03075080000890", 
            "11542834", // Inscrição estadual com menos de 12 dígitos 
            new Date(1995, 11, 25),
            "www.joanaeluis.com.br",
            "joaneluis@gmail.com",
            "61991284234",
            "303030",
            "303030"
        ).should.be.equal(0) // 0 = erro
    })
    it('Cadastrar ONG 8', () => {
        OngFunctions.createOng
        (
            "Ong Do Bem 5",
            "03075080000890", 
            "115428340222", 
            new Date(1995, 11, 25),
            "www.joanaeluis.com.br",
            "joaneluis@gmail.com",
            "991284234", // Telefone com menos de 11 dígitos
            "303030",
            "303030"
        ).should.be.equal(0) // 0 = erro
    })

})

