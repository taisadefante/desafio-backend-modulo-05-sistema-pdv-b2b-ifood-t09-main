const B2 = require('backblaze-b2');
const { param } = require('../rotas/rotas');

const b2 = new B2({
    accountId: process.env.KEY_ID,
   applicationKey: process.env.APP_KEY
});

const autenticarB2 = async () => {
   await b2.authorize();
   console.log('Autenticado com o B2');
};

const enviarParaB2 = async (nomeArquivo, bufferArquivo) => {
   console.log(nomeArquivo, bufferArquivo)
   const parametros = {
     uploadUrl: process.env.ENDPOINT_S3,
     uploadAuthToken: process.env.APP_KEY,
     fileName: nomeArquivo,
     data: bufferArquivo,
     onUploadProgress: null,
     // idBalde: 'c4c9278bd8543df588c2081a',
   };
   console.log(parametros);
   const resposta = await b2.uploadFile(parametros);

   console.log('Enviado para o B2:', resposta);

   return resposta;
};

module.exports = { autenticarB2, enviarParaB2 };
