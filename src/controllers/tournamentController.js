const tournamentService = require("../services/tournamentService");
const getAllTournament = async (req, res) => {
  try {
    const [tournaments, locations] = await Promise.all([
      tournamentService.getAllTournament(),
      tournamentService.getAllLocation(),
    ]);
    res.render("pages/tournament", {
      tournaments: tournaments,
      locations: locations,
    });
  } catch (error) {
    console.error("Error fetching team details:", error);
    res.status(500).send("Lỗi khi lấy thông tin team");
  }
};

const getTournamentDetail = async (req, res) => {
  const teamId = req.params.teamId;
  try {
    const [team, team_sponsors, trophys, playersFree] = await Promise.all([
      teamService.getTeamById(teamId),
      teamService.getAllTeamSponsors(),
      teamService.getAllTrophy(),
      playerService.getPlayersFree(),
    ]);
    res.render("pages/teamInfo", {
      team: team,
      team_sponsors: team_sponsors,
      trophys: trophys,
      playersFree: playersFree[0],
    });
  } catch (error) {
    console.error("Error fetching team details:", error);
    res.status(500).send("Lỗi khi lấy thông tin team");
  }
};

module.exports = {
  getAllTournament,
  getTournamentDetail,
};
