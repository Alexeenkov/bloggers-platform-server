// import swaggerJsdoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';
import {Express, Request, Response} from 'express';
import path from "path";
import {HTTP_STATUSES} from "../../shared/constants/httpStatuses";

// const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Bloggers platform',
//       version: '1.0.0',
//       description: 'Bloggers platform API. Всё для Евгения',
//     },
//   },
//   apis: ['./**/*.swagger.yml'],
// };
//
// const swaggerSpec = swaggerJsdoc(swaggerOptions);
//
// console.log(swaggerSpec);

export const setupSwagger = (app: Express) => {
  app.get('/api', (_: Request, res: Response) => {
    const filePath = path.resolve(__dirname, 'swagger.html');

    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(HTTP_STATUSES.NOT_FOUND).send(`File not found by path: ${filePath}`);
      }
    });
  });

  // app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
