// toggle sidebar and logout functionality
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const toggleSidebarBtn = document.getElementById("toggleSidebar");
  const logoutBtn = document.querySelector(".logout-btn");

  sidebar.classList.add("open");

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

  if (localStorage.getItem("salaryDropdownOpen") === "true") {
    submenu.classList.add("open");
    salaryMenu
      .querySelector(".dropdown-icon i")
      .classList.replace("fa-chevron-down", "fa-chevron-up");
  }

  salaryMenu.addEventListener("click", function () {
    const icon = this.querySelector(".dropdown-icon i");
    submenu.classList.toggle("open");

    const isOpen = submenu.classList.contains("open");
    localStorage.setItem("salaryDropdownOpen", isOpen);

    icon.classList.toggle("fa-chevron-up", isOpen);
    icon.classList.toggle("fa-chevron-down", !isOpen);
  });
});

// Position List (with LocalStorage)
document.addEventListener("DOMContentLoaded", () => {
  const positionForm = document.getElementById("positionForm");
  const positionTableBody = document.getElementById("positionTableBody");

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

// Assign Salary (with LocalStorage)
document.addEventListener("DOMContentLoaded", () => {
  const assignSalaryForm = document.getElementById("assignSalaryForm");
  const facultySalaryBody = document.getElementById("facultySalaryBody");
  const positionDropdown = document.getElementById("positionDropdown");
  const basicPayField = document.getElementById("basicPay");
  const transportAllowanceField = document.getElementById("transportAllowance");
  const taxDeductionField = document.getElementById("taxDeduction");
  const netPayField = document.getElementById("netPay");

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

  searchInput.addEventListener("keyup", function () {
    const filter = searchInput.value.toLowerCase();
    const rows = tableBody.getElementsByTagName("tr");

    Array.from(rows).forEach((row) => {
      const cellsText = row.innerText.toLowerCase();
      if (cellsText.includes(filter)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
});

/** Faculty Salary Search */
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("facultySearch");
  const tableBody = document.getElementById("facultySalaryBody");

  searchInput.addEventListener("keyup", function () {
    const filter = searchInput.value.toLowerCase();
    const rows = tableBody.getElementsByTagName("tr");

    Array.from(rows).forEach((row) => {
      const cellsText = row.innerText.toLowerCase();
      if (cellsText.includes(filter)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
});
