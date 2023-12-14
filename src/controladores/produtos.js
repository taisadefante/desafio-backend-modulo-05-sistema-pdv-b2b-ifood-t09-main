require("dotenv").config();
const knex = require("../configs/conexao");
const { uploadImagem, deleteImagem } = require("../configs/uploads");

const listarProdutos = async (req, res) => {
  try {
    const { categoria_id } = req.query;
    if (categoria_id) {
      const categoriaValida = await knex("categorias")
        .where({ id: categoria_id })
        .first();

      if (categoriaValida) {
        const query = await knex("produtos")
          .select("*")
          .from("produtos")
          .where({ categoria_id: categoriaValida.id });

        return res.json(query);
      } else {
        return res
          .status(404)
          .json({ mensagem: "A categoria informada é inválida." });
      }
    } else {
      const query = await knex("produtos").select("*").from("produtos");
      return res.json(query);
    }
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const cadastrarProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  const { originalname, buffer, mimetype } = req.file;

  try {
    const categoriaEncontrada = await knex("categorias")
      .where({ id: categoria_id })
      .first();

    if (!categoriaEncontrada) {
      return res
        .status(404)
        .json({ mensagem: "A categoria informada não foi encontrada" });
    }

    let produto = await knex("produtos")
      .insert({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id,
      })
      .returning("*");

    if (!produto) {
      return res.status(400).json({ mensagem: "O produto não foi cadastrado" });
    }

    const id = produto[0].id;

    const imagem = await uploadImagem(
      `produtos/${id}/${originalname}`,
      buffer,
      mimetype
    );

    produto = await knex(`produtos`)
      .update({
        produto_imagem: imagem.url,
      })
      .where({ id })
      .returning("*");

    produto[0].produto_imagem = imagem.url;

    return res.status(201).json(produto[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const detalharProduto = async (req, res) => {
  const { id } = req.params;
  try {
    const produtoDetalhado = await knex("produtos").where({ id }).first();

    if (!produtoDetalhado) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }

    return res.status(200).json(produtoDetalhado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const editarProduto = async (req, res) => {
  const { id } = req.params;
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  const { originalname, buffer, mimetype } = req.file;

  try {
    const categoria = await knex("categorias")
      .select("descricao")
      .where("id", categoria_id);

    if (!categoria || categoria.length === 0) {
      return res
        .status(404)
        .json({ mensagem: "A categoria informada não foi encontrada" });
    }

    const produto = await knex("produtos")
      .select("id", "descricao", "produto_imagem")
      .where("id", id)
      .first();

    if (!produto) {
      return res
        .status(400)
        .json({ mensagem: "Este produto ainda não foi cadastrado" });
    }

    if (produto.produto_imagem) {
      await deleteImagem(produto.produto_imagem);
    }

    const imagem = await uploadImagem(
      `produtos/${id}/${originalname}`,
      buffer,
      mimetype
    );

    const produtoAtualizado = await knex("produtos")
      .update({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id,
        produto_imagem: imagem.url,
      })
      .where({ id })
      .returning("*");

    produtoAtualizado[0].produto_imagem = imagem.url;

    return res.status(200).json(produtoAtualizado[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const excluirProduto = async (req, res) => {
  const { id } = req.params;
  const { file } = req.query;
  try {
    const produto = await knex("produtos")
      .select("descricao")
      .where({ id })
      .first();

    if (!produto) {
      return res
        .status(400)
        .json({ mensagem: "Este produto ainda não foi cadastrado" });
    }

    const produtoPedido = await knex("pedido_produtos")
      .select("pedido_id")
      .where("produto_id", id)
      .first();

    if (produtoPedido) {
      return res.status(403).json({
        mensagem:
          "Este produto não pode ser excluído, pois está vinculado a um pedido.",
      });
    }

    const produtoExcluido = await knex("produtos").where({ id }).del();

    await deleteImagem(file);

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = {
  listarProdutos,
  cadastrarProduto,
  detalharProduto,
  editarProduto,
  excluirProduto,
};
