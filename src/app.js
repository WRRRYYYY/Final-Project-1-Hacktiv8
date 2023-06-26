require("dotenv").config();
const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const reflectionRoutes = require("./routes/reflectionRoutes");
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/users", authRoutes);
app.use("/api/v1/reflections", reflectionRoutes);

app.listen(PORT, () => {
  console.log(`Reflection app listening at http://localhost:${PORT}`);
});
