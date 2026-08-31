const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.get("/health", (req, res) => res.json({ status: "ok", service: "api-gateway" }));
app.listen(PORT, () => console.log(`Gateway running on ${PORT}`));
