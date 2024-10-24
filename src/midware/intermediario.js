const knex = require('../database/conexao');

const validarCampos = async (req, res, next) => {
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
    const { nome, idade, email, notaprimeiromodulo, notasegundomodulo } = req.body;
    if (!nome || !idade || !email || !notaprimeiromodulo || !notasegundomodulo) {
      return res.status(400).json({ mensagem: "Todos os campos devem ser preenchidos." });
    }if (notaprimeiromodulo < 0 || notaprimeiromodulo > 10 || notasegundomodulo < 0 || notasegundomodulo > 10) {
      return res.status(400).json({ mensagem: 'A nota deve estar entre 0 e 10.' });
    }if (!idade || idade <= 0) {
      return res.status(400).json({ mensagem: "Idade deve ser um valor positivo." });
    }if(nome.length < 3) {
      return res.status(400).json({ mensagem: "Nome deve ter pelo menos 3 letras." });
    }if (!emailRegex.test(email)) {
      return res.status(400).json({ mensagem: "Email inválido." });
    }else {
      next();
    }
  } catch (error) {
    return res.status(500).json({ mensagem: "erro interno." });
  }
}

const idValido = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ mensagem: 'Informe um ID válido' });
    next();
  } catch (error) {
    return res.status(500).json({ mensagem: "erro interno." });
  }
}

const listaVazia = async (req, res, next) => {
  try {
    const todosAlunos = await knex("alunos").select("*");
    if (todosAlunos.length === 0) return res.status(200).json("Lista vazia");
    next();
  } catch (error) {
    return res.status(500).json({ mensagem: "erro interno." });
  }
}

const emailValidoParaCadastro = async (req, res, next) => {
  try {
    const { email } = req.body;
    const emailExistente = await knex("alunos").where( "email", email).first();
    if (emailExistente) return res.status(400).json({ mensagem: 'Email ja existente.' });
    next();
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ mensagem: "erro interno." });
  }
}
const emailValidoParaAtualizacao = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const emailExistente = await knex("alunos").where( "email", email).andWhere("id", "!=", id).first();
    if (emailExistente) return res.status(400).json({ mensagem: 'Email ja existente.' });
    next();
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ mensagem: "erro interno." });
  }
}

module.exports = {
  validarCampos,
  idValido,
  listaVazia,
  emailValidoParaCadastro,
  emailValidoParaAtualizacao
};