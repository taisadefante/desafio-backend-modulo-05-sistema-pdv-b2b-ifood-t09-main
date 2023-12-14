const Joi = require("joi");

const schemaListaPedidos = Joi.object({
  produto_id: Joi.number().integer().positive().required().messages({
    "any.required": "O campo (produto_id) é obrigatório",
  }),
  quantidade_produto: Joi.number().integer().min(1).required().messages({
    "any.required": "O campo (quantidade_produto) é obrigatório",
  }),
});

const schemaPedido = Joi.object({
  cliente_id: Joi.number().required().messages({
    "any.required": "O campo (cliente_id) é obrigatório",
  }),
  observacao: Joi.string(),
  pedido_produtos: Joi.array()
    .min(1)
    .items(schemaListaPedidos)
    .required()
    .messages({
      "any.required": "O campo (pedido_produtos) é obrigatório",
      "array.min": "O pedido deve conter ao menos um item",
    }),
});

module.exports = schemaPedido;
