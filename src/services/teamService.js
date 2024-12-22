const db = require("../config/db");

const getAllTeamInfo = async () => {
  try {
    const result = await db.execute(
      "SELECT * FROM team NATURAL JOIN team_region"
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
      FROM (team NATURAL JOIN team_region)
      LEFT JOIN (player_team_history NATURAL JOIN player) on team.teamId = player_team_history.teamId
      WHERE team.teamId = ?`,
      [teamId]
    );
    return result[0];
  } catch (error) {
    throw error;
  }
};
module.exports = {
  getAllTeamInfo,
  getAllTeamSponsors,
  getAllRegions,
  getTeamById,
  getAllTrophy,
};
