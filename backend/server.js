// Import required modules
import express from 'express';  // Express framework for building web applications
import dotenv from 'dotenv';    // Loads environment variables from a .env file
import helmet from 'helmet';    // Adds security-related HTTP headers
import morgan from 'morgan';    // Logs HTTP requests for debugging
import cors from 'cors';
import productRoutes from './routes/ProductRoutes.js';
import { sql } from './config/db.js';
import { aj } from './lib/arcjet.js';
import  path from 'path'

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();

// Define the port, defaulting to 3000 if not set in the environment
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware for enabling CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Middleware for security best practices (hides "X-Powered-By" and adds headers)
app.use(helmet());

// Middleware for logging HTTP requests in a readable "dev" format
app.use(morgan("dev"));


// apply arcjet rate-limit to all routes
app.use(async (req ,res ,next) => {
    try {
        const decision = await aj.protect(req , {requested:1});


        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                console.log("🚨 Rate limit triggered!");
                res.status(429).json({ message: "Too many requests. Please try again later." });
            }else if (decision.reason.isBot()){
                res.status(403).json({ message: "Bot detected. Please try again later." });
            }else {
                res.status(403).json({ error: "Forbidden" });
            }
            return;
        }

        // check for spoofed bots
        if(decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())){
            res.status(403).json({ message: "Spoofed bot detected. Please try again later." });
            return;
        }


        // If the request passes the rate-limit, continue processing it
        next();
    } catch (error) {
        console.error("�� Error applying ArcJet rate-limit:", error);
        // res.status(500).json({ error: "Internal Server Error" });
        next(error)
    }
})


app.use("/api/products", productRoutes)


if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, 'frontend/dist')));


    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend" , "dist" , "index.html"));
    });
}



// Function to initialize the database and create the "products" table if it doesn't exist
async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                image VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log("✅ Database initialized successfully");
    } catch (error) {
        console.error("❌ Error initializing database:", error);
    }
}

// Initialize the database, then start the server
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
});


