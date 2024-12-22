const playerService = require("../services/playerSevice");

const getAllPlayerInfo = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Số người chơi mỗi trang
    const offset = (page - 1) * limit;
    const positionFilter = req.query.position || "all";
    const statusFilter = req.query.status || "all";
    const searchQuery = req.query.q || "";

    console.log(positionFilter, statusFilter);
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

const storeBook = async (req, res) => {
  const book = req.body;

  // Kiểm tra các trường bắt buộc
  if (!book.title || !book.book_type || !book.pub_id) {
    return res.render("pages/create", {
      error: "Thiếu thông tin cần thiết",
      values: req.body,
    });
  }

  try {
    await bookService.createBook(book);
    res.redirect("/manageBooks/create?success=true"); // Chuyển hướng nếu thêm thành công
  } catch (err) {
    console.error("Lỗi khi thêm sách:", err);
    let errorMsg = "Lỗi khi thêm sách vào cơ sở dữ liệu";
    if (err.code === "ER_DUP_ENTRY") {
      errorMsg = "Book_ID đã tồn tại.";
    }
    return res.render("pages/create", {
      error: errorMsg,
      values: req.body,
    });
  }
};

module.exports = {
  getAllPlayerInfo,
  addPlayer,
};
