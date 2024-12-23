const playerService = require("../services/playerSevice");

const getAllPlayerInfo = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Số người chơi mỗi trang
    const offset = (page - 1) * limit;
    const positionFilter = req.query.position || "all";
    const statusFilter = req.query.status || "all";
    const searchQuery = req.query.q || "";

    // Gọi service để lấy dữ liệu người chơi theo query tìm kiếm
    const [players, players_history] = await Promise.all([
      playerService.getAllPlayerByQuery(
        searchQuery,
        positionFilter,
        statusFilter
      ),
      playerService.getPlayerHistory(),
    ]);

    // Xử lý dữ liệu từ hai bảng
    let processedPlayers = players.map((player) => {
      const playerHistory = players_history.filter(
        (history) => history.playerId === player.playerId
      );
      const currentTeam = playerHistory.find(
        (history) => new Date(history.endDate) > new Date()
      );
      const teamName = currentTeam ? currentTeam.teamName : "Tự do";

      return {
        ...player,
        teamName: teamName,
        isExpired: !currentTeam && playerHistory.length > 0,
      };
    });

    // Tính toán số trang
    const totalPages = Math.ceil(processedPlayers.length / limit);
    const paginatedPlayers = processedPlayers.slice(offset, offset + limit);

    res.render("pages/players", {
      players: paginatedPlayers,
      currentPage: page,
      totalPages: totalPages,
      query: {
        position: positionFilter,
        status: statusFilter,
        search: searchQuery,
      },
    });
  } catch (error) {
    console.error("Error fetching player details:", error);
    res.status(500).send("Lỗi khi lấy thông tin người chơi");
  }
};

const addPlayer = async (req, res) => {
  try {
    const {
      ingameName,
      playerFirstName,
      playerLastMiddleName,
      dob,
      nationality,
      role,
    } = req.body;

    // Kiểm tra giá trị undefined hoặc null
    if (
      !ingameName ||
      !playerFirstName ||
      !playerLastMiddleName ||
      !dob ||
      !nationality ||
      !role
    ) {
      throw new Error("Missing required fields");
    }

    // Gọi service để thêm người chơi vào cơ sở dữ liệu
    await playerService.addPlayer({
      ingameName,
      playerFirstName,
      playerLastMiddleName,
      dob,
      nationality,
      role,
    });

    // Chuyển hướng về trang danh sách người chơi với thông báo thành công
    res.redirect("/players/create?success=true");
  } catch (error) {
    console.error("Error adding new player:", error.message);
    // Chuyển hướng về trang danh sách người chơi với thông báo lỗi
    res.render(`pages/createPlayer`, {
      values: req.body,
      error: error.message,
    });
  }
};

module.exports = {
  getAllPlayerInfo,
  addPlayer,
};
