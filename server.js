import express from "express"
import cors from "cors"

import productsRoute from "./routes/products.route.js"
import authRoute from "./routes/auth.route.js"
import testRoute from "./routes/test.route.js"
import emailRoute from "./routes/email.route.js"
import settingsRoute from "./routes/settings.route.js"

import cookieParser from "cookie-parser"

import path, { dirname } from "path";
import { fileURLToPath } from "url";

// creating my own _dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app= express()

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}))


app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);
app.use("/api/products", productsRoute);
app.use("/api/email", emailRoute);
app.use("/api/email", emailRoute);
app.use("/api/settings", settingsRoute);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "/client/dist/index.html")))

// const PORT = process.env.PORT || 80;
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`The server is running at ${PORT}!`)
})