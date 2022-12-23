import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is the D2D API");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
