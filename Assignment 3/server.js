const express = require("express");
var expressLayout = require("express-ejs-layouts")

let app = express();
app.set("view engine", "ejs");
app.use(expressLayout);
app.use(express.static("public"));


app.get("/", (req, res) => {
  res.render("homepage");
});

app.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});