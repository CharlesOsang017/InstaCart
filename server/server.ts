import "dotenv/config";
import express, { Request, Response } from 'express';
import authRoutes from "./routes/auth.route.js";
import cors from "cors";

const app = express();

// Middleware
app.use(cors())
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);

const port = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});