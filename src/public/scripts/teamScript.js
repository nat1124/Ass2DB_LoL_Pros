function openModal() {
  document.getElementById("bookModal").style.cssText =
    "display : flex; flex-direction : column;";
}

// Hàm đóng modal
function closeModal() {
  window.location.href = "/team";
}

// document.addEventListener("DOMContentLoaded", (event) => {
//   const addPlayerBtn = document.querySelector(".add-player button");
//   const listPlayerFree = document.querySelector(".list-player-free");
//   const closeBtn = document.querySelector(".close-btn");
//   const contractModal = document.getElementById("contractModal");
//   const closeContractBtn = document.querySelector(".close-contract");
//   const contractForm = document.getElementById("contractForm");

//   // Hiển thị danh sách người chơi tự do khi nhấn nút "Thêm Player"
//   addPlayerBtn.onclick = function () {
//     listPlayerFree.style.display = "block";
//   };

//   // Ẩn danh sách người chơi tự do khi nhấn nút "Hủy"
//   closeBtn.onclick = function () {
//     listPlayerFree.style.display = "none";
//   };

//   // Hiển thị form nhập hợp đồng khi nhấn nút "Chọn"
//   document.querySelectorAll(".select-btn").forEach((button) => {
//     button.onclick = function () {
//       const playerId = this.getAttribute("data-player-id");
//       document.getElementById("playerId").value = playerId;
//       listPlayerFree.style.display = "none";
//       contractModal.style.display = "flex";
//     };
//   });

//   // Ẩn form nhập hợp đồng khi nhấn nút "Hủy"
//   closeContractBtn.onclick = function () {
//     contractModal.style.display = "none";
//   };
// });

document.addEventListener("DOMContentLoaded", (event) => {
  const addPlayerBtn = document.querySelector(".add-player button");
  const listPlayerFree = document.querySelector(".list-player-free");
  const closeBtn = document.querySelector(".close-btn");
  const contractModal = document.getElementById("contractModal");
  const closeContractBtn = document.querySelector(".close-contract");
  const contractForm = document.getElementById("contractForm");

  const teamId = document.getElementById("teamId").value; // Lấy giá trị teamId từ phần tử ẩn

  // Hiển thị danh sách người chơi tự do khi nhấn nút "Thêm Player"
  addPlayerBtn.onclick = function () {
    listPlayerFree.style.display = "block";
  };

  // Ẩn danh sách người chơi tự do khi nhấn nút "Hủy"
  closeBtn.onclick = function () {
    listPlayerFree.style.display = "none";
  };

  // Hiển thị form nhập hợp đồng khi nhấn nút "Chọn"
  document.querySelectorAll(".select-btn").forEach((button) => {
    button.onclick = function () {
      const playerId = this.closest("tr").getAttribute("data-player-id");
      document.getElementById("playerId").value = playerId;
      listPlayerFree.style.display = "none";
      contractModal.style.display = "flex";
    };
  });

  // Ẩn form nhập hợp đồng khi nhấn nút "Hủy"
  closeContractBtn.onclick = function () {
    contractModal.style.display = "none";
  };

  // Gửi dữ liệu hợp đồng khi nhấn nút "Xác nhận"
  contractForm.onsubmit = function (e) {
    e.preventDefault();

    const playerId = document.getElementById("playerId").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    fetch(`/team/add-player`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamId: teamId, // Sử dụng giá trị teamId từ phần tử ẩn
        playerId: playerId,
        startDate: startDate,
        endDate: endDate,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        contractModal.style.display = "none";
        location.reload();
      })
      .catch((error) => console.error("Error adding player:", error));
  };

  
});

function contractRenew (playerId, teamId) {
  document.getElementById('contractRenewModal').style.display = "flex";
  document.getElementById('contractRenewModal').querySelector(".close-contract").onclick = () => {
    document.getElementById('contractRenewModal').style.display = "none";
  }
  document.getElementById('contractRenewModal').querySelector('form').onsubmit = (e) => {
    e.preventDefault();
    const endDate = document.getElementById('contractRenewModal').querySelector('.endDate').value;
    fetch('/team/renew-contract', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamId: teamId, // Sử dụng giá trị teamId từ phần tử ẩn
        playerId: playerId,
        endDate: endDate,
      })
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        document.getElementById('contractRenewModal').style.display = "none";
        location.reload();
      })
      .catch((error) => console.error("Error renew contract:", error));
    location.reload()
  }
}
