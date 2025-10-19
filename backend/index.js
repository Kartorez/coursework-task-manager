import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/db.js';
import router from './routes/index.js';
import errorMiddleware from './middleware/ErrorHandlingMiddleWare.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

import './models/associations.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const swaggerFile = JSON.parse(
  fs.readFileSync('./docs/swagger-output.json', 'utf-8')
);

app.use(cors());
app.use(express.json());
app.use('/api', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(errorMiddleware);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('DB connected');

    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  } catch (e) {
    console.error('Error starting server:', e.message);
  }
};

start();
