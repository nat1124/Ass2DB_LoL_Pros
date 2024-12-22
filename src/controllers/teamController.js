const teamService = require("../services/teamService");

const getAllTeams = async (req, res) => {
  try {
    const [teams, team_sponsors, regions] = await Promise.all([
      teamService.getAllTeamInfo(),
      teamService.getAllTeamSponsors(),
      teamService.getAllRegions(),
    ]);
    res.render("pages/team", {
      teams: teams,
      team_sponsors: team_sponsors,
      regions: regions,
    });
  } catch (error) {
    console.error("Error fetching team details:", error);
    res.status(500).send("Lỗi khi lấy thông tin team");
  }
};

const getTeamDetail = async (req, res) => {
  const teamId = req.params.teamId;
  try {
    const [team, team_sponsors, trophys] = await Promise.all([
      teamService.getTeamById(teamId),
      teamService.getAllTeamSponsors(),
      teamService.getAllTrophy(),
    ]);
    res.render("pages/teamInfo", {
      team: team,
      team_sponsors: team_sponsors,
      trophys: trophys,
    });
  } catch (error) {
    console.error("Error fetching team details:", error);
    res.status(500).send("Lỗi khi lấy thông tin team");
  }
};
module.exports = {
  getAllTeams,
  getTeamDetail,
};
