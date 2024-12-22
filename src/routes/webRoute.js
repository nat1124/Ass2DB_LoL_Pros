const { Router } = require("express");
const path = require("path");
const route = Router();

route.get("/", (req, res) => {
  // return res.sendFile(path.join(__dirname, "../public/views/pages/home"));
  res.render("pages/home");
});

//

module.exports = route;
