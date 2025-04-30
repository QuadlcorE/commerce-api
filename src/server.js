import express  from 'express';
import bodyParser from 'body-parser';
import {config} from 'dotenv';
import { connect } from './config/database.js';
import userRouter from './api/v1/routes/users.js';

config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

connect();


app.use('/api/v1', userRouter);

// TODO: Remove test and home routes.
app.get('/', (req, res) => {
    res.send('Hello World');
})

app.get('/test', (req, res) => {
    console.log(req.body);
    res.send('Test received');
});

app.post('/test', (req, res) => {
    console.log(req.body);
    res.send('Test received');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
})