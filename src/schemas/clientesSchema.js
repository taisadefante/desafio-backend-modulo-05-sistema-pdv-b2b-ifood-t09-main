const joi = require("joi");

const clienteSchema = joi.object({
  nome: joi.string().min(2).required().messages({
    "string.min": "O campo nome deve ser preenchido corretamente",
    "any.required": "O campo nome é obrigatório.",
    "string.empty": "O campo nome é obrigatório.",
  }),
  email: joi.string().email().required().messages({
    "string.email": "E-mail inválido",
    "string.empty": "O campo e-mail é obrigatório.",
    "any.required": "O campo e-mail é obrigatório.",
  }),
  cpf: joi.string().min(11).required().messages({
    "any.required": "O campo cpf é obrigatório.",
    "string.empty": "O campo cpf é obrigatório.",
    "string.min": "O campo cpf deve conter no mínimo 11 caracteres.",
  }),
  cep: joi.string().allow('').optional(),
  rua: joi.string().allow('').optional(),
  numero: joi.number().allow('').optional(),
  bairro: joi.string().allow('').optional(),
  cidade: joi.string().allow('').optional(),
  estado: joi.string().allow('').optional()
});

module.exports = clienteSchema;