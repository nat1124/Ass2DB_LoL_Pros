function openModal() {
  document.getElementById("bookModal").style.cssText =
    "display : flex; flex-direction : column;";
}

// Hàm đóng modal
function closeModal(e) {
  window.location.href = `/${e}`;
}
