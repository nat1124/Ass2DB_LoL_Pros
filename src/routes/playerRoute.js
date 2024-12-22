const { Router } = require("express");
const controllers = require("../controllers");
const route = Router();
route.get("/", controllers.playerController.getAllPlayerInfo);
route.get("/create", (req, res) => {
  res.render("pages/createPlayer", {
    success: req.query.success,
  });
});
route.post("/create/store", controllers.playerController.addPlayer);
module.exports = route;
