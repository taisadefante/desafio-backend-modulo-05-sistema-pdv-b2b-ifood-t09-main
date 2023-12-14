require("dotenv").config();
const { func } = require("joi");
const knex = require("../configs/conexao");
const { enviadorEmail } = require("../configs/emailNotificacao");

const cadastrarPedido = async (req, res) => {
  const novoPedido = req.body;
  try {
    if (!novoPedido.pedido_produtos) {
      return res.status(404).json({ mensagem: "É necessário que o pedido contenha pelo menos um produto." });
    }

    const clienteExiste = await knex("clientes").select('*').where("id", novoPedido.cliente_id);
    let emailNotificacao, nomeCliente;
    if (!clienteExiste) {
      return res.status(404).json({ mensagem: "Não existe cliente com o id informado" });
    } else {
      emailNotificacao = clienteExiste[0].email;
      nomeCliente = clienteExiste[0].nome;
    }

    let valorTotalPedido = 0;

    let produtosPedido = [];

    for (const produtoPedido of novoPedido.pedido_produtos) {
      const produtosDb = await knex("produtos").select('*').where("id", produtoPedido.produto_id);

      if (!produtosDb) {
        return res.status(404).json({ mensagem: `O id do produto informado '${produtoPedido.produto_id}', não está vinculado a nenhum produto` });
      }

      const produtoDb = produtosDb[0];

      if (produtoPedido.quantidade_produto > produtoDb.quantidade_estoque) {
        return res.status(400).json({ mensagem: "A quantidade do produto em estoque é inferior ao pedido" });
      }

      produtosPedido.push({
        produto_id: produtoDb.id,
        quantidade_produto: produtoPedido.quantidade_produto,
        valor_produto: produtoDb.valor
      });

      valorTotalPedido += (produtoDb.valor * produtoPedido.quantidade_produto);
    }

    const pedidoCadastrado = await salvarPedido(novoPedido, valorTotalPedido, produtosPedido);
    enviarEmailNotificacao(emailNotificacao, nomeCliente, pedidoCadastrado.id);
    pedidoCadastrado.emailNotificacao = emailNotificacao;

    return res.json(pedidoCadastrado);

  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

async function salvarPedido(novoPedido, valorTotal, produtosPedido) {
  const transacaoDb = await knex.transaction();
  try {
    const { observacao, cliente_id } = novoPedido;
    const pedido = await transacaoDb("pedidos")
      .insert({
        cliente_id,
        observacao,
        valor_total: valorTotal,
      })
      .returning("*");
    let pedidoFinal = { produtos: [], ...pedido[0] };
    for (const produto of produtosPedido) {
      const { produto_id, quantidade_produto, valor_produto } = produto;
      const itemPedido = await transacaoDb("pedido_produtos")
        .insert({
          pedido_id: pedido[0].id,
          produto_id,
          quantidade_produto,
          valor_produto
        })
        .returning("*");
      pedidoFinal.produtos.push(itemPedido[0]);
    }
    transacaoDb.commit();
    return pedidoFinal;
  } catch (error) {
    transacaoDb.rollback();
    throw error;
  }
}

async function enviarEmailNotificacao(email, nome, pedido) {
  enviadorEmail.sendMail({
    from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
    to: `${nome} <${email}>`,
    subject: `Pedido ${pedido} efetuado com sucesso`,
    text: "Pedido efetuado com sucesso, obrigada pela preferência."
  });
}

const listarPedido = async (req, res) => {
  const { id } = req.query;

  try {
    let query = knex('pedidos');

    if (id) {
      query = query.where({ cliente_id: id });
    }

    const pedidos = await query.select();

    if (pedidos.length === 0) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado.' });
    }

    for (const pedido of pedidos) {
      pedido.pedido_produtos = await knex('pedido_produtos')
        .where({ pedido_id: pedido.id })
        .select();
    }

    return res.status(201).json(pedidos);

  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};

module.exports = {
  cadastrarPedido,
  listarPedido
};
