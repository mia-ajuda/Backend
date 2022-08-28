function createOng(
name,
cnpj,
inscricaoEstadual,
dataAbertura,
site,
email,
phone,
password,
confirmPassword
)
{
    // verifica se há alguma letra no cnpj, inscrição estadual ou telefone
    if ( (cnpj.match(/[a-z]/i)) || (inscricaoEstadual.match(/[a-z]/i)) || (phone.match(/[a-z]/i)) ) { return 0; }
    else if ( (typeof name != "string") || (name.length < 1) || (name.length > 100) ) { return 0; } // verifica se o nome é válido
    else if ( (cnpj.length != 14) ) { return 0; } // verifica se o cnpj é válido
    else if ( (inscricaoEstadual.length != 12) ) { return 0; } // verifica se a inscrição estadual é válida
    else if ( (typeof dataAbertura != "object") ) { return 0;  } // verifica se a data de abertura é válida
    else if ( (typeof site != "string") || (site.length < 1) || (site.length > 300) ) { return 0;  } // verifica se o site é válido
    else if ( (typeof email != "string") || (email.length < 1) || (email.length > 100) ) { return 0;  }  // verifica se o email é válido
    else if ( (phone.length != 11) ) { return 0; } // verifica se o telefone é válido
    else if( (password != confirmPassword) || (password.length < 6) || (password.length > 12) || (typeof password != "string") )
    {return 0; } // verifica se a senha e a confirmação são válidas
    else { return 1; } // retorna 1 se todas as verificações forem válidas
}
module.exports = {
    createOng
}

