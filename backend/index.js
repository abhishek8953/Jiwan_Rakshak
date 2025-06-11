import express from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes/authRoutes.js';
import dotenv from "dotenv"
dotenv.config();

import { authenticate } from './middleware/auth.js';

const app = express();

// Middleware setup
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Use the routes
app.use('/api/user', routes);

app.get('/data',authenticate,(req,res)=>{
  console.log(req.user);
  res.json({"user":req.user})
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
