import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import publicapi from './api/public.mjs';
dotenv.config();


const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/sorrawitj/chain_api/', publicapi);

app.listen(port, () => console.log(`Listening on http://localhost:${port}/`));