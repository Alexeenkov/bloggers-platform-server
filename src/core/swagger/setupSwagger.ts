import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express, {Express} from 'express';
import path from 'path';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bloggers platform',
      version: '1.0.0',
      description: 'Bloggers platform API. Всё для Евгения',
    },
  },
  apis: ['./src/**/*.swagger.yml'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  const staticPath = path.join(__dirname, 'public');

  app.use(express.static(staticPath));
  app.use('/api', swaggerUi.serve);

  app.get('/api', swaggerUi.setup(swaggerSpec));
};
