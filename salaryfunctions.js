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




/** Position List */
document.addEventListener("DOMContentLoaded", () => {
  const positionForm = document.getElementById("positionForm");
  const positionTableBody = document.getElementById("positionTableBody");

 
  positionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const position = document.getElementById("position").value;
    const payLevel = document.getElementById("payLevel").value;
    const monthlySalary = parseFloat(document.getElementById("monthlySalary").value);
    const employmentType = document.getElementById("employmentType").value;
    const effectiveDate = document.getElementById("effectiveDate").value;

    
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${position}</td>
      <td>${payLevel}</td>
      <td>₱${monthlySalary.toLocaleString()}</td>
      <td>${employmentType}</td>
      <td>${effectiveDate}</td>
      <td>
        <button type="button" class="delete-btn">Delete</button>
      </td>
    `;
    positionTableBody.appendChild(newRow);

    positionForm.reset();
  });

  
  positionTableBody.addEventListener("click", (e) => {
    const target = e.target;
    const row = target.closest("tr");
    if (!row) return;

    if (target.classList.contains("delete-btn")) {
      row.remove();
    }
  });
});



/** Assign Salary */
document.addEventListener("DOMContentLoaded", () => {
  const assignSalaryForm = document.getElementById("assignSalaryForm");
  const facultySalaryBody = document.getElementById("facultySalaryBody");
  const positionDropdown = document.getElementById("positionDropdown");
  const basicPayField = document.getElementById("basicPay");
  const transportAllowanceField = document.getElementById("transportAllowance");
  const taxDeductionField = document.getElementById("taxDeduction");
  const netPayField = document.getElementById("netPay");

  
  positionDropdown.addEventListener("change", function() {
    const salary = parseFloat(this.options[this.selectedIndex].dataset.salary);
    const allowance = 1000;
    const tax = salary * 0.10;
    const netPay = salary + allowance - tax;

    basicPayField.value = `₱${salary.toLocaleString()}`;
    transportAllowanceField.value = `₱${allowance.toLocaleString()}`;
    taxDeductionField.value = `₱${tax.toLocaleString()}`;
    netPayField.value = `₱${netPay.toLocaleString()}`;
  });

  
  assignSalaryForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const facultyName = document.getElementById("facultyName").value; 
    const positionName = document.getElementById("positionDropdown").selectedOptions[0].text;
    const basicPay = basicPayField.value;
    const allowance = transportAllowanceField.value;
    const tax = taxDeductionField.value;
    const netPay = netPayField.value;
    const effectiveDate = document.getElementById("effectiveDateAssign").value;

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${facultyName}</td>
      <td>${positionName}</td>
      <td>${basicPay}</td>
      <td>${allowance}</td>
      <td>${tax}</td>
      <td>${netPay}</td>
      <td>${effectiveDate}</td>
      <td> <button type="button" class="delete-btn">Delete</button></td>
    `;
    facultySalaryBody.appendChild(newRow);

   
    newRow.querySelector(".delete-btn").addEventListener("click", function() {
      newRow.remove();
    });

    
    assignSalaryForm.reset();
    basicPayField.value = "";
    transportAllowanceField.value = "₱1000";
    taxDeductionField.value = "";
    netPayField.value = "";
  });
});



document.addEventListener("DOMContentLoaded", () => {
  // Kunin lahat ng menu na may dropdown
  const dropdownMenus = document.querySelectorAll(".menu-item");

  dropdownMenus.forEach(menu => {
    menu.addEventListener("click", () => {
      // toggle open/close
      menu.classList.toggle("active");
    });
  });
});



/** Position Search */
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchPosition");
  const tableBody = document.getElementById("positionTableBody");

  searchInput.addEventListener("keyup", function() {
    const filter = searchInput.value.toLowerCase();
    const rows = tableBody.getElementsByTagName("tr");

    Array.from(rows).forEach(row => {
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

  searchInput.addEventListener("keyup", function() {
    const filter = searchInput.value.toLowerCase();
    const rows = tableBody.getElementsByTagName("tr");

    Array.from(rows).forEach(row => {
      const cellsText = row.innerText.toLowerCase();
      if (cellsText.includes(filter)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
});
