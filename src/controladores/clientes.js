const knex = require("../configs/conexao");
require("dotenv").config();

const cadastrarCliente = async (req, res) => {
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
    req.body;

  try {
    const emailEncontrado = await knex("clientes").where({ email }).first();

    if (emailEncontrado) {
      return res.status(400).json({ mensagem: "O e-mail informado já está sendo utilizado por outro usuário." });
    }

    const cpfEncontrado = await knex("clientes").where({ cpf }).first();

    if (cpfEncontrado) {
      return res.status(400).json({ mensagem: "Este CPF já está em uso." });
    }

    const numeroNulo = numero === "" ? null : numero;

    const novoCliente = await knex("clientes")
      .insert({
        nome,
        email,
        cpf,
        cep,
        rua,
        numero: numeroNulo,
        bairro,
        cidade,
        estado,
      })
      .returning("*");

    return res.status(201).json(novoCliente[0]);

  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const detalharCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const clientesDetalhado = await knex("clientes").where({ id }).first();

    if (!clientesDetalhado) {
      return res.status(404).json({ mensagem: "Cliente não encontrado" });
    }

    return res.status(200).json(clientesDetalhado);

  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const listarCliente = async (req, res) => {
  try {

    const clientes = await knex("clientes").select("*");

    return res.status(200).json({ clientes });

  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const editarCliente = async (req, res) => {
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;
  const { id } = req.params;

  try {
    const clienteExiste = await knex("clientes").select('*').where("id", id);

    if (clienteExiste.length === 0) {
      return res.status(400).json({ mensagem: "Cliente não cadastrado!" });
    }

    const emailExiste = await knex('clientes').select('*').where('email', email).whereNot('id', id);

    if (emailExiste.length > 0) {
      return res.status(400).json({ mensagem: "O e-mail informado já está sendo utilizado por outro cliente." });
    }

    const cpfExiste = await knex('clientes').select('*').where('cpf', cpf).whereNot('id', id);

    if (cpfExiste.length > 0) {
      return res.status(400).json({
        mensagem: "O cpf informado já está sendo utilizado por outro cliente."
      });
    }

    const cliente = await knex("clientes").update({ nome, email, cpf, cep, rua, numero, bairro, cidade, estado }).where("id", id).returning("*");

    return res.status(200).json(cliente);

  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = {
  cadastrarCliente,
  detalharCliente,
  listarCliente,
  editarCliente
};


