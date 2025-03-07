import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import apiRoutes from './routes/apiRoutes'


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;


//Middleware
// app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"], // Allow all origins (Change this in production)
    credentials: true,
    methods: "Get,POST,PUT,DELETE",
    allowedHeaders:["Content-Type", "Authorization"]
}));
app.use(helmet());
app.use(compression());


app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    next();
});


app.use("/", apiRoutes)

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
})