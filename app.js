import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { connect } from './src/config/connection.js';

//  IMPORTING ROUTER
import userRouter from './src/routes/userRoutes.js'
import postRouter from './src/routes/postRoutes.js'
import adminRouter from './src/routes/adminRouter.js'
import authRouter from './src/routes/authRouter.js'


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
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan('common'));



// cors options
app.use(cors({
  origin: "*"
}));


app.get('/', (req, res) => {
  res.send('WELCOME TO YOCIAL');
});

// ROUTER SETUP
app.use("/api/user",userRouter)
app.use("/api/admin",adminRouter)
app.use("/api/post",postRouter)
app.use("/api/auth", authRouter);



app.listen(port,() => {
  console.log(`<------------------------------------->`)
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`)
  console.log(`<------------------------------------->`)
});