document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("preload"); 

  const sidebar = document.getElementById("sidebar");
  const toggleSidebarBtn = document.getElementById("toggleSidebar");
  const logoutBtn = document.querySelector(".logout-btn");
  const filterMonth = document.getElementById("filterMonth");
  const filterYear = document.getElementById("filterYear");
  const salaryTableBody = document.getElementById("salaryTableBody");

 
  const savedSidebarState = localStorage.getItem("sidebarState");
  if (savedSidebarState === "open") {
    sidebar.classList.add("open");
    sidebar.classList.remove("collapsed");
  } else {
    sidebar.classList.remove("open");
    sidebar.classList.add("collapsed");
  }

  
  setTimeout(() => {
    document.body.classList.remove("preload");
  }, 50);

  
  if (toggleSidebarBtn && sidebar) {
    toggleSidebarBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      sidebar.classList.toggle("collapsed");

      localStorage.setItem(
        "sidebarState",
        sidebar.classList.contains("open") ? "open" : "collapsed"
      );
    });
  }

  // ✅ Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem("sidebarState");
        window.location.href = "../login/Login.html";
      }
    });
  }



  
  // ✅ Sample Salary Data
  const salaryData = [
    { month: "September", year: "2025", basic: 30000, allowance: 5000, deduction: 2000 },
    { month: "August", year: "2025", basic: 30000, allowance: 5000, deduction: 2500 },
    { month: "July", year: "2025", basic: 30000, allowance: 5000, deduction: 1800 },
  ];

  function renderSalaryTable(data) {
    salaryTableBody.innerHTML = "";
    if (data.length === 0) {
      salaryTableBody.innerHTML = `<tr><td colspan="6">No records found</td></tr>`;
      return;
    }

    data.forEach((item) => {
      const net = item.basic + item.allowance - item.deduction;
      salaryTableBody.insertAdjacentHTML(
        "beforeend",
        `
        <tr>
          <td>${item.month} ${item.year}</td>
          <td>₱${item.basic.toLocaleString()}</td>
          <td>₱${item.allowance.toLocaleString()}</td>
          <td>₱${item.deduction.toLocaleString()}</td>
          <td>₱${net.toLocaleString()}</td>
          <td><button class="download-btn">Download</button></td>
        </tr>
      `
      );
    });
  }

  renderSalaryTable(salaryData);

  function applyFilters() {
    const month = filterMonth.value;
    const year = filterYear.value;

    const filtered = salaryData.filter((item) => {
      const matchMonth = month === "" || item.month === month;
      const matchYear = year === "" || item.year === year;
      return matchMonth && matchYear;
    });

    renderSalaryTable(filtered);
  }

  filterMonth.addEventListener("change", applyFilters);
  filterYear.addEventListener("change", applyFilters);
});
