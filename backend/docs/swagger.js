import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'My API',
    description: 'Автоматично згенерована документація',
  },
  host: 'localhost:5000',
  schemes: ['http'],
  basePath: '/api',
};

const outputFile = '../docs/swagger-output.json';
const endpointsFiles = ['../routes/index.js'];

swaggerAutogen()(outputFile, endpointsFiles, doc);
