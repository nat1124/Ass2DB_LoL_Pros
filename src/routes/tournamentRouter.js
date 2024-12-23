const { Router } = require("express");
const controllers = require("../controllers");
const route = Router();

route.get("/", controllers.tournamentController.getAllTournament);
route.get("/:tournamentId")

module.exports = route;
