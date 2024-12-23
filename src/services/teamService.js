const db = require("../config/db");

const getAllTeamInfo = async () => {
  try {
    const result = await db.execute(
      "SELECT team.*, team_region.regionName FROM team LEFT JOIN team_region ON team.teamId = team_region.teamId"
    );
    return result[0];
  } catch (error) {
    throw error;
  }
};

const getAllTeamSponsors = async () => {
  try {
    const result = await db.execute("SELECT * FROM team_sponsors");
    return result[0];
  } catch (error) {
    throw error;
  }
};

const getAllRegions = async () => {
  try {
    const result = await db.execute("SELECT regionName FROM region");
    return result[0];
  } catch (error) {
    throw error;
  }
};

const getAllTrophy = async () => {
  {
    try {
      const result = await db.execute("SELECT * FROM trophy");
      return result[0];
    } catch (error) {
      {
        throw error;
      }
    }
  }
};

const getTeamById = async (teamId) => {
  try {
    const result = await db.execute(
      `SELECT *
FROM team
LEFT JOIN team_region ON team.teamId = team_region.teamId
LEFT JOIN player_team_history ON team.teamId = player_team_history.teamId
LEFT JOIN player ON player_team_history.playerId = player.playerId
WHERE team.teamId = ?
ORDER BY endDate DESC
`,
      [teamId]
    );
    return result[0];
  } catch (error) {
    throw error;
  }
};

const addTeam = async ({ teamName, sponsors, regionName }) => {
  try {
    // Kiểm tra xem danh sách sponsors có phải là một mảng không
    if (Array.isArray(sponsors)) {
      // Chuyển đổi mảng sponsors thành chuỗi ngăn cách bởi dấu phẩy
      sponsors = sponsors.join(", ");
    } else {
      // Nếu không phải là mảng, kiểm tra và gán giá trị rỗng nếu cần
      sponsors = sponsors || "";
    }

    const query = `CALL AddTeamWithDetails(?, ?, ?)`;
    await db.execute(query, [teamName, sponsors, regionName]);
  } catch (error) {
    if (error.sqlState === "45000") {
      throw new Error("Tên team đã tồn tại. Vui lòng chọn tên khác.");
    } else {
      throw error;
    }
  }
};

const addPlayerToTeam = async ({ teamId, playerId, startDate, endDate }) => {
  try {
    const query = `INSERT INTO player_team_history (playerId, teamId, startDate, endDate) VALUES (?, ?, ?, ?)`;
    await db.execute(query, [playerId, teamId, startDate, endDate]);
  } catch (error) {
    throw new Error("Lỗi khi thêm người chơi vào đội.");
  }
};

const editContract = async (playerId, teamId, endDate) => {
  try {
    await db.execute('UPDATE player_team_history SET endDate = ? WHERE playerId = ? AND teamId = ?', [endDate, playerId, teamId])
  } catch (error) {
    throw new Error("Lỗi khi gia hạn hợp đồng.");
  }
}

const cancelContract = async (playerId, teamId) => {
  try {
    await db.execute(
      "UPDATE player_team_history SET endDate = current_date() WHERE playerId = ? AND teamId = ?",
      [playerId, teamId]
    );
  } catch (error) {
    throw new Error("Lỗi khi huỷ hợp đồng.");
  }
};

module.exports = {
  getAllTeamInfo,
  getAllTeamSponsors,
  getAllRegions,
  getTeamById,
  getAllTrophy,
  addTeam,
  addPlayerToTeam,
  cancelContract,
  editContract,
};
