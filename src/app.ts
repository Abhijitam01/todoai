import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import goalsRouter from '../backend/src/routes/goals';
import authRouter from '../backend/src/routes/auth';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import basicAuth from 'express-basic-auth';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/goals', goalsRouter);
app.use('/api/auth', authRouter);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'TodoAI API',
    version: '1.0.0',
    description: 'API documentation for TodoAI backend',
  },
  servers: [
    { url: '/api/v1' },
  ],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: [
    './backend/src/routes/*.ts',
    './backend/src/controllers/*.ts',
    './Instructions/backend.md',
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

if (process.env.NODE_ENV === 'production' && process.env.SWAGGER_PROTECT === 'true') {
  app.use('/api/v1/docs', basicAuth({
    users: { [process.env.SWAGGER_USER || 'admin']: process.env.SWAGGER_PASS || 'password' },
    challenge: true,
  }), swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} else {
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Optionally serve raw OpenAPI JSON
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

export default app; 