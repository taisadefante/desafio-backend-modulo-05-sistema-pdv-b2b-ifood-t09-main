const joi = require("joi");

const produtoSchema = joi.object({
    descricao: joi.string().min(3).required().messages({
        "string.min": "O campo descrição deve ser preenchido corretamente",
        "any.required": "O campo descrição é obrigatório.",
        "string.empty": "O campo descrição é obrigatório.",
    }),
    quantidade_estoque: joi.number().positive().integer().required().messages({
        "number.integer": "O campo quantidade deve ser preenchido com um número inteiro",
        "number.positive":"O campo quantidade deve ser preenchido com um número positivo",
        "number.base": "O campo quantidade é obrigatório.",
        "any.required": "O campo quantidade é obrigatório.",
    }),
    valor: joi.number().positive().integer().required().messages({
        "number.integer":"O campo valor deve ser preenchido com um número inteiro",
        "any.required": "O campo valor é obrigatório.",
        "number.positive": "O campo valor deve ser preenchido com um número positivo",
        "number.base": "O campo valor é obrigatório.",
    }),
    categoria_id: joi.number().positive().integer().required().messages({
        "number.integer":"O campo categoria deve ser preenchido com um número inteiro",
        "number.positive":"O campo categoria deve ser preenchido com um número positivo",
        "number.base": "O campo categoria é obrigatório.",
        "any.required": "O campo categoria é obrigatório.",
    }),
});

module.exports = produtoSchema;
