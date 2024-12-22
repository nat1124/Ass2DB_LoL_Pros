const { Router } = require("express");
const controllers = require("../controllers");
const route = Router();
route.get("/", controllers.teamController.getAllTeams);

route.get("/:teamId", controllers.teamController.getTeamDetail);
module.exports = route;
