const db = require("../config/db");
const getAllTournament = async () => {
  try {
    const result = await db.execute("SELECT * FROM tournament");
    return result[0];
  } catch (error) {
    throw error;
  }
};

const getAllLocation = async () => {
  try {
    const result = await db.execute("SELECT * FROM tournament_place");
    return result[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllTournament,
  getAllLocation,
};
