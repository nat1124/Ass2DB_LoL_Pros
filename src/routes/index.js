const webRoute = require("./webRoute");
const teamRoute = require("./teamRoute");
const playerRoute = require("./playerRoute");
const initRoute = (app) => {
  // Starst
  app.use("/", webRoute);
  app.use("/team", teamRoute);
  app.use("/players", playerRoute);
};

module.exports = initRoute;
