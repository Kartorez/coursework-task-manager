import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/db.js';
import router from './routes/index.js';
import errorMiddleware from './middleware/ErrorHandlingMiddleWare.js';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import fs from 'fs';

import './models/associations.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const swaggerFile = JSON.parse(
  fs.readFileSync('./docs/swagger-output.json', 'utf-8')
);

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
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
