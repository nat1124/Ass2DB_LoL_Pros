// Function to filter players by position
function filterPlayersByPosition() {
  const positionFilter = document.getElementById("positionFilter").value;
  const rows = document.querySelectorAll("#playerTableBody tr");

  rows.forEach((row) => {
    const position = row.cells[3].innerText;
    if (positionFilter === "all" || position === positionFilter) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// Add event listener to position filter dropdown
document
  .getElementById("positionFilter")
  .addEventListener("change", filterPlayersByPosition);
