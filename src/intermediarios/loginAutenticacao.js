const knex = require('../configs/conexao');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const loginAutenticacao = async (req, res, next) => {
    const { authorization } = req.headers

    try {
        const token = authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' })
        }

        const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
        let usuario = (await knex('usuarios').select('*').where('id', id));

        if (!usuario.length) {
            throw "Erro na autenticação do usuário";
        }

        req.usuario = {
            id,
            nome: usuario[0].nome,
            email: usuario[0].email
        };

        next();

    } catch (error) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' })
    }
}

module.exports = loginAutenticacao;