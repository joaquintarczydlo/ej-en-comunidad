import express from 'express';
import { userRoutes } from './routes/UserRoutes.js';

const app = express();
app.use(express.json());

app.use("/red-social", userRoutes);

app.listen(3000, () => {
    console.log("servidor conectado y listo para recibir requests");
});

