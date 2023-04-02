import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import publicapi from './api/public.mjs';
import mongoose, { connect } from 'mongoose';
dotenv.config();


const app = express();
const port = process.env.PORT;
mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://admin:1162109050010@blockchain-transaction.xrorj0m.mongodb.net/evote-blockchain?retryWrites=true&w=majority')
// mongoose.connect('mongodb+srv://admin:1162109050010@blockchain-transaction.xrorj0m.mongodb.net/?retryWrites=true&w=majority')
    .then(()=>{
        console.log("mongo conection complete")
    })
    .catch((err) => console.error(err));

app.use(cors());
app.use(express.json());

app.use('/sorrawitj/chain_api/', publicapi);

app.listen(port, () => console.log(`Listening on http://localhost:${port}/`));