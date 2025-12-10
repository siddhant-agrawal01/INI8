import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import documentRoutes from './routes/document.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: process.env.FRONTEND_URL ,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/documents', documentRoutes);



app.listen(PORT, () => {
    console.log(` Server is running on http://localhost:${PORT}`);
});
