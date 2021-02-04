const express = require("express");
const path = require("path");

const app = express();

app.use("/assets", express.static(path.join(__dirname, "dist")));
app.use("/resources", express.static(path.resolve(__dirname, "storage", "images")));
app.get(['/', "/client", "/admin"], (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(3000, () => console.log("successfully started server at localhost:3000"));

