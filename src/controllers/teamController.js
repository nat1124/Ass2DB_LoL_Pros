const teamService = require("../services/teamService");
const playerService = require("../services/playerSevice");
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

const createTeam = async (req, res) => {
  try {
    const [regions] = await Promise.all([teamService.getAllRegions()]);
    res.render("pages/createTeam", {
      success: req.query.success,
      regions: regions,
    });
  } catch (error) {
    console.error("Error fetching team details:", error);
    res.status(500).send("Lỗi khi lấy thông tin team");
  }
};

//Add team

const addTeam = async (req, res) => {
  try {
    const { teamName, regionName, sponsors } = req.body;
    // Kiểm tra giá trị undefined hoặc null
    if (!teamName) {
      throw new Error("Missing required fields");
    }

    // Gọi service để thêm người chơi vào cơ sở dữ liệu
    await teamService.addTeam({
      teamName,
      sponsors,
      regionName,
    });

    // Chuyển hướng về trang danh sách người chơi với thông báo thành công
    res.redirect("/team/create?success=true");
  } catch (error) {
    console.error("Error adding new player:", error.message);
    // Chuyển hướng về trang danh sách người chơi với thông báo lỗi
    const [regions] = await Promise.all([teamService.getAllRegions()]);
    res.render(`pages/createTeam`, {
      values: req.body,
      error: error.message,
      regions: regions,
    });
  }
};

const addPlayerToTeam = async (req, res) => {
  try {
    const { teamId, playerId, startDate, endDate } = req.body;
    await teamService.addPlayerToTeam({ teamId, playerId, startDate, endDate });
    res.json({ message: "Thêm người chơi thành công" });
  } catch (error) {
    console.error("Error adding player:", error);
    res.status(500).json({ message: "Lỗi khi thêm người chơi" });
  }
};

const editContract = async (req, res) => {
  await teamService.editContract(req.body.playerId, req.body.teamId, req.body.endDate);
  res.status(200).json();
}

const cancelContract = async (req, res) => {
  await teamService.cancelContract(req.params.playerId, req.params.teamId);
  res.redirect(`/team/${req.params.teamId}`)
}

module.exports = {
  getAllTeams,
  getTeamDetail,
  addTeam,
  createTeam,
  addPlayerToTeam,
  editContract,
  cancelContract,
};
