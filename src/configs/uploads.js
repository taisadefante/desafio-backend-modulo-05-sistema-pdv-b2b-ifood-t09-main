const aws = require("aws-sdk");

const endpoint = new aws.Endpoint(process.env.ENDPOINT_S3);

const s3 = new aws.S3({
  endpoint,
  credentials: {
    accessKeyId: process.env.KEY_ID,
    secretAccessKey: process.env.APP_KEY,
  },
});

const uploadImagem = async (path, buffer, mimetype) => {
  try{
  const imagem = await s3.upload({
      Bucket: process.env.BUCKET,
      Key: path,
      Body: buffer,
      ContentType: mimetype
    })
    .promise();

    return {
        path: imagem.Key,
        url: `https://${process.env.BUCKET}.${process.env.ENDPOINT_S3}/${imagem.Key}`,
      };
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const deleteImagem = async (path) =>{
  try{

    await s3.deleteObject({
      Bucket:process.env.BUCKET,
      Key: path
    }).promise();
    
  }catch(error){
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = {
  uploadImagem,
  deleteImagem
};