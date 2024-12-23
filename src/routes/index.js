const webRoute = require("./webRoute");
const teamRoute = require("./teamRoute");
const playerRoute = require("./playerRoute");
const tournamentRoute = require("./tournamentRouter");
const initRoute = (app) => {
  // Starst
  app.use("/", webRoute);
  app.use("/team", teamRoute);
  app.use("/players", playerRoute);
  app.use("/tournament", tournamentRoute);
};

module.exports = initRoute;
