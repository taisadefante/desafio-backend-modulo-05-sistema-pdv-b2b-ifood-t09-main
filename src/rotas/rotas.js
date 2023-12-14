const express = require("express");
const { listarCategorias } = require("../controladores/categoria");
const validarRequisicao = require("../intermediarios/validarRequisicao");
const usuarioSchema = require("../schemas/usuariosSchema");
const loginSchema = require("../schemas/loginSchema");
const login = require("../controladores/login");
const {
  cadastrarUsuario,
  editarUsuario,
  detalharUsuario,
} = require("../controladores/usuario");
const loginAutenticacao = require("../intermediarios/loginAutenticacao");
const produtoSchema = require("../schemas/produtosSchema");
const {
  listarProdutos,
  cadastrarProduto,
  detalharProduto,
  editarProduto,
  excluirProduto,
} = require("../controladores/produtos");
const clienteSchema = require("../schemas/clientesSchema");
const {
  cadastrarCliente,
  detalharCliente,
  listarCliente,
  editarCliente,
} = require("../controladores/clientes");
const {
  cadastrarPedido, listarPedido
} = require("../controladores/pedido");
const multer = require("../configs/multer");

const rotas = express();

rotas.get("/categoria", listarCategorias);

rotas.post("/usuario", validarRequisicao(usuarioSchema), cadastrarUsuario);
rotas.post("/login", validarRequisicao(loginSchema), login);

rotas.use(loginAutenticacao);
rotas.get("/usuario", detalharUsuario);
rotas.put("/usuario", validarRequisicao(usuarioSchema), editarUsuario);

rotas.get("/produto", listarProdutos);
rotas.post("/produto", multer.single('produto_imagem'), validarRequisicao(produtoSchema), cadastrarProduto);
rotas.get("/produto/:id", detalharProduto);
rotas.put("/produto/:id", multer.single('produto_imagem'), validarRequisicao(produtoSchema), editarProduto);

rotas.delete("/produto/:id", excluirProduto);

rotas.post("/cliente", validarRequisicao(clienteSchema), cadastrarCliente);
rotas.put("/cliente/:id", validarRequisicao(clienteSchema), editarCliente);
rotas.get("/cliente/:id", detalharCliente);
rotas.get("/cliente", listarCliente);

rotas.post("/pedido", cadastrarPedido);
rotas.get("/pedido", listarPedido)


module.exports = rotas;
