import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { connect } from './src/config/connection.js';

dotenv.config()

// CONFIGURATION
const app = express();
const port = process.env.PORT || 2500;

// db connection
const db = connect();

// path
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan('common'));

// cors options
app.use(cors({
  origin: "*"
}));

// routes
app.get('/', (req, res) => {
  res.send('Hello Express!');
});


app.listen(port,() => {
  console.log(`<------------------------------------->`)
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`)
  console.log(`<------------------------------------->`)
});