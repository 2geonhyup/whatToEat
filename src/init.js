import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./models/User";
import app from "./server";

const PORT = 5555;

const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);