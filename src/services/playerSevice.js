const db = require("../config/db");
const getAllPlayerInfo = async () => {
  try {
    const result = await db.execute("SELECT * FROM player");
    return result[0];
  } catch (error) {
    throw error;
  }
};

const getPlayerHistory = async () => {
  try {
    const result = await db.execute(
      "SELECT * FROM player_team_history LEFT JOIN team ON player_team_history.teamId = team.teamId"
    );
    return result[0];
  } catch (error) {
    throw error;
  }
};

const getAllPlayerByQuery = async (
  searchQuery,
  positionFilter,
  statusFilter
) => {
  try {
    let query = `
      SELECT DISTINCT player.*, team.teamName 
      FROM player
      LEFT JOIN player_team_history ON player.playerId = player_team_history.playerId
      LEFT JOIN team ON player_team_history.teamId = team.teamId
      WHERE 1=1
    `;

    const values = [];

    if (searchQuery) {
      query += `
        AND (
          player.playerFirstName LIKE ? OR
          player.playerLastMiddleName LIKE ? OR
          player.ingameName LIKE ? OR
          player.role LIKE ? OR
          player.nationality LIKE ? OR
          team.teamName LIKE ?
        )
      `;
      values.push(
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `%${searchQuery}%`
      );
    }

    if (positionFilter !== "all") {
      query += " AND player.role = ?";
      values.push(positionFilter);
    }

    if (statusFilter !== "all") {
      if (statusFilter === "Tự do") {
        query += " AND team.teamName IS NULL";
      } else {
        query += " AND team.teamName IS NOT NULL";
      }
    }

    const [result] = await db.execute(query, values);
    return result;
  } catch (error) {
    throw error;
  }
};

const addPlayer = async ({
  ingameName,
  playerFirstName,
  playerLastMiddleName,
  dob,
  nationality,
  role,
}) => {
  try {
    const query = `CALL InsertPlayer(?, ?, ?, ?, ?, ?)`;
    await db.execute(query, [
      ingameName,
      playerFirstName,
      playerLastMiddleName,
      dob,
      nationality,
      role,
    ]);
  } catch (error) {
    if (error.sqlState === "45000") {
      throw new Error("Tên ingameName đã tồn tại. Vui lòng chọn tên khác.");
    } else {
      throw error;
    }
  }
};

const getPlayersFree = async () => {
  try {
    const result = await db.execute("CALL GetFreePlayers()");
    return result[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllPlayerInfo,
  getPlayerHistory,
  getAllPlayerByQuery,
  addPlayer,
  getPlayersFree,
};
