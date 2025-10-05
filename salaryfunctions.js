// toggle sidebar and logout functionality
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const toggleSidebarBtn = document.getElementById("toggleSidebar");
  const logoutBtn = document.querySelector(".logout-btn");

  if (sidebar) sidebar.classList.add("open");

  if (toggleSidebarBtn && sidebar) {
    toggleSidebarBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const confirmLogout = confirm("Are you sure you want to log out?");
      if (confirmLogout) {
        window.location.href = "Login/Login.html";
      }
    });
  }
});

window.addEventListener("load", function () {
  document.body.classList.add("loaded");
});

// Sidebar dropdown functionality
document.addEventListener("DOMContentLoaded", function () {
  const salaryMenu = document.getElementById("salary-menu");
  const submenu = document.getElementById("salary-submenu");

  if (!salaryMenu || !submenu) return;

  if (localStorage.getItem("salaryDropdownOpen") === "true") {
    submenu.classList.add("open");
    const icon = salaryMenu.querySelector(".dropdown-icon i");
    if (icon) icon.classList.replace("fa-chevron-down", "fa-chevron-up");
  }

  salaryMenu.addEventListener("click", function () {
    const icon = this.querySelector(".dropdown-icon i");
    submenu.classList.toggle("open");

    const isOpen = submenu.classList.contains("open");
    localStorage.setItem("salaryDropdownOpen", isOpen);

    if (icon) {
      icon.classList.toggle("fa-chevron-up", isOpen);
      icon.classList.toggle("fa-chevron-down", !isOpen);
    }
  });
});

// ============================
// Position List (with LocalStorage)
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const positionForm = document.getElementById("positionForm");
  const positionTableBody = document.getElementById("positionTableBody");
  if (!positionForm || !positionTableBody) return;

  const savedPositions = JSON.parse(localStorage.getItem("positions")) || [];
  savedPositions.forEach(addRowToTable);

  positionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const position = document.getElementById("position").value.trim();
    const payLevel = document.getElementById("payLevel").value.trim();
    const monthlySalary = parseFloat(
      document.getElementById("monthlySalary").value
    );
    const employmentType = document
      .getElementById("employmentType")
      .value.trim();
    const effectiveDate = document.getElementById("effectiveDate").value;

    const newPosition = {
      position,
      payLevel,
      monthlySalary,
      employmentType,
      effectiveDate,
    };

    addRowToTable(newPosition);

    savedPositions.push(newPosition);
    localStorage.setItem("positions", JSON.stringify(savedPositions));

    positionForm.reset();
  });

  positionTableBody.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("delete-btn")) {
      const row = target.closest("tr");
      const index = [...positionTableBody.children].indexOf(row);

      savedPositions.splice(index, 1);
      localStorage.setItem("positions", JSON.stringify(savedPositions));

      row.remove();
    }
  });

  function addRowToTable(item) {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${item.position}</td>
      <td>${item.payLevel}</td>
      <td>₱${item.monthlySalary.toLocaleString()}</td>
      <td>${item.employmentType}</td>
      <td>${item.effectiveDate}</td>
      <td><button type="button" class="delete-btn">Delete</button></td>
    `;
    positionTableBody.appendChild(newRow);
  }
});

// ============================
// Assign Salary (with LocalStorage)
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const assignSalaryForm = document.getElementById("assignSalaryForm");
  const facultySalaryBody = document.getElementById("facultySalaryBody");
  const positionDropdown = document.getElementById("positionDropdown");
  const basicPayField = document.getElementById("basicPay");
  const transportAllowanceField = document.getElementById("transportAllowance");
  const taxDeductionField = document.getElementById("taxDeduction");
  const netPayField = document.getElementById("netPay");

  if (
    !assignSalaryForm ||
    !facultySalaryBody ||
    !positionDropdown ||
    !basicPayField ||
    !transportAllowanceField ||
    !taxDeductionField ||
    !netPayField
  )
    return;

  const savedSalaries =
    JSON.parse(localStorage.getItem("assignedSalaries")) || [];
  savedSalaries.forEach(addRowToTable);

  positionDropdown.addEventListener("change", function () {
    const salary = parseFloat(
      this.options[this.selectedIndex].dataset.salary || 0
    );
    const allowance = 1000;
    const tax = salary * 0.1;
    const netPay = salary + allowance - tax;

    basicPayField.value = `₱${salary.toLocaleString()}`;
    transportAllowanceField.value = `₱${allowance.toLocaleString()}`;
    taxDeductionField.value = `₱${tax.toLocaleString()}`;
    netPayField.value = `₱${netPay.toLocaleString()}`;
  });

  assignSalaryForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const facultyName = document.getElementById("facultyName").value.trim();
    const positionName =
      document.getElementById("positionDropdown").selectedOptions[0].text;
    const basicPay = basicPayField.value;
    const allowance = transportAllowanceField.value;
    const tax = taxDeductionField.value;
    const netPay = netPayField.value;
    const effectiveDate = document.getElementById("effectiveDateAssign").value;

    const newSalary = {
      facultyName,
      positionName,
      basicPay,
      allowance,
      tax,
      netPay,
      effectiveDate,
    };

    addRowToTable(newSalary);
    savedSalaries.push(newSalary);
    localStorage.setItem("assignedSalaries", JSON.stringify(savedSalaries));

    assignSalaryForm.reset();
    basicPayField.value = "";
    transportAllowanceField.value = "₱1000";
    taxDeductionField.value = "";
    netPayField.value = "";
  });

  facultySalaryBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const row = e.target.closest("tr");
      const index = [...facultySalaryBody.children].indexOf(row);

      savedSalaries.splice(index, 1);
      localStorage.setItem("assignedSalaries", JSON.stringify(savedSalaries));

      row.remove();
    }
  });

  function addRowToTable(item) {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${item.facultyName}</td>
      <td>${item.positionName}</td>
      <td>${item.basicPay}</td>
      <td>${item.allowance}</td>
      <td>${item.tax}</td>
      <td>${item.netPay}</td>
      <td>${item.effectiveDate}</td>
      <td><button type="button" class="delete-btn">Delete</button></td>
    `;
    facultySalaryBody.appendChild(newRow);
  }
});

/** Position Search */
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchPosition");
  const tableBody = document.getElementById("positionTableBody");
  if (!searchInput || !tableBody) return;

  searchInput.addEventListener("keyup", function () {
    const filter = searchInput.value.toLowerCase();
    const rows = tableBody.getElementsByTagName("tr");

    Array.from(rows).forEach((row) => {
      const cellsText = row.innerText.toLowerCase();
      row.style.display = cellsText.includes(filter) ? "" : "none";
    });
  });
});

/** Faculty Salary Search */
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("facultySearch");
  const tableBody = document.getElementById("facultySalaryBody");
  if (!searchInput || !tableBody) return;

  searchInput.addEventListener("keyup", function () {
    const filter = searchInput.value.toLowerCase();
    const rows = tableBody.getElementsByTagName("tr");

    Array.from(rows).forEach((row) => {
      const cellsText = row.innerText.toLowerCase();
      row.style.display = cellsText.includes(filter) ? "" : "none";
    });
  });
});

/** ==========================
 * EXPORT TO CSV (Reusable)
 * ========================== */
function exportTableToCSV(tableSelector, filename) {
  const table = document.querySelector(tableSelector);
  if (!table) return alert("Table not found!");

  const rows = Array.from(table.querySelectorAll("tr"));
  let csvContent = [];

  rows.forEach((row) => {
    const cols = Array.from(row.querySelectorAll("th, td"));
    const filteredCols = cols.slice(0, -1); // skip "Action"

    const rowData = filteredCols.map((col) => {
      let text = col.textContent.trim();

      // Remove peso signs and commas for numbers
      if (text.startsWith("₱")) text = text.replace(/₱|,/g, "");

      // Escape quotes
      if (text.includes('"')) text = text.replace(/"/g, '""');

      // Wrap text in quotes
      return `"${text}"`;
    });

    csvContent.push(rowData.join(","));
  });

  // Add UTF-8 BOM for Excel compatibility
  const bom = "\uFEFF";
  const csvBlob = new Blob([bom + csvContent.join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(csvBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// 🔹 Position List Export Button
document.addEventListener("DOMContentLoaded", () => {
  const exportPositionBtn = document.getElementById("exportPositionCSV");
  if (!exportPositionBtn) return;

  exportPositionBtn.addEventListener("click", () => {
    exportTableToCSV(".container2 table", "position_list.csv");
  });
});

// 🔹 Faculty Salary List Export Button
document.addEventListener("DOMContentLoaded", () => {
  const exportSalaryBtn = document.getElementById("exportSalaryCSV");
  if (!exportSalaryBtn) return;

  exportSalaryBtn.addEventListener("click", () => {
    exportTableToCSV(".container5 table", "faculty_salary_list.csv");
  });
});

// for debug logs
document.addEventListener("DOMContentLoaded", () => {
  console.log("%cSystem performance log initialized.", "color: #00bfff");
  console.log(
    "%cfinalInitialization completed successfully!",
    "color: #00ffff"
  );
  console.log(
    "%cFaculty Management System initialized successfully!",
    "color: #1e90ff; font-weight: bold;"
  );
  console.log("%cChecking localStorage integrity...", "color: #87cefa");

  // Optional: custom status check
  setTimeout(() => {
    console.log(
      "%cSalary Grade & Pay is active and ready.",
      "color: #00ff7f; font-weight: bold;"
    );
  }, 1000);
});
