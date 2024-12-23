const { Router } = require("express");
const controllers = require("../controllers");
const route = Router();
route.get("/", controllers.teamController.getAllTeams);
route.get("/create", controllers.teamController.createTeam);
route.post("/create/store", controllers.teamController.addTeam);

route.get("/:teamId", controllers.teamController.getTeamDetail);
route.post("/add-player", controllers.teamController.addPlayerToTeam);

route.post("/renew-contract", controllers.teamController.editContract)
route.get("/cancel-contract/:playerId/:teamId", controllers.teamController.cancelContract)

module.exports = route;
