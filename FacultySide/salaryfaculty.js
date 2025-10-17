document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("preload");

  const sidebar = document.getElementById("sidebar");
  const toggleSidebarBtn = document.getElementById("toggleSidebar");
  const logoutBtn = document.querySelector(".logout-btn");
  const filterMonth = document.getElementById("filterMonth");
  const filterYear = document.getElementById("filterYear");
  const salaryTableBody = document.getElementById("salaryTableBody");

  // Summary elements
  const currentMonthSalary = document.getElementById("currentMonthSalary");
  const totalDeductions = document.getElementById("totalDeductions");
  const netSalary = document.getElementById("netSalary");

  // Sidebar state
  const savedSidebarState = localStorage.getItem("sidebarState");
  if (savedSidebarState === "open") {
    sidebar.classList.add("open");
    sidebar.classList.remove("collapsed");
  } else {
    sidebar.classList.remove("open");
    sidebar.classList.add("collapsed");
  }

  setTimeout(() => document.body.classList.remove("preload"), 50);

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

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem("sidebarState");
        window.location.href = "../login/Login.html";
      }
    });
  }

  // ✅ Fixed Salary Data
  const salaryData = [
    { month: "September", year: "2025", basic: 30000, allowance: 5000, deduction: 2000 },
    { month: "August", year: "2025", basic: 30000, allowance: 5000, deduction: 2500 },
    { month: "July", year: "2025", basic: 30000, allowance: 5000, deduction: 1800 },
  ];

  // ✅ Render Salary Table
  function renderSalaryTable(data) {
    salaryTableBody.innerHTML = "";
    if (data.length === 0) {
      salaryTableBody.innerHTML = `<tr><td colspan="6">No records found</td></tr>`;
      updateSummary(null);
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
          <td><button class="download-btn" data-month="${item.month}" data-year="${item.year}" data-basic="${item.basic}" data-allowance="${item.allowance}" data-deduction="${item.deduction}" data-net="${net}">Download</button></td>
        </tr>
      `
      );
    });

    const latest = getLatestMonth(data);
    updateSummary(latest);

    // ✅ Add download event for each button (PDF version)
    document.querySelectorAll(".download-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const month = btn.dataset.month;
        const year = btn.dataset.year;
        const basic = parseFloat(btn.dataset.basic);
        const allowance = parseFloat(btn.dataset.allowance);
        const deduction = parseFloat(btn.dataset.deduction);
        const net = parseFloat(btn.dataset.net);

        // 🧾 Generate PDF using jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Faculty Payslip", 70, 20);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Month: ${month} ${year}`, 20, 40);
        doc.text(`Basic Pay: ₱${basic.toLocaleString()}`, 20, 55);
        doc.text(`Allowance: ₱${allowance.toLocaleString()}`, 20, 65);
        doc.text(`Deductions: ₱${deduction.toLocaleString()}`, 20, 75);
        doc.line(20, 80, 190, 80); // separator line
        doc.text(`Net Pay: ₱${net.toLocaleString()}`, 20, 95);

        doc.setFontSize(10);
        doc.text("Thank you for your service!", 20, 115);

        doc.save(`Payslip_${month}_${year}.pdf`);
      });
    });
  }

  // ✅ Get Latest Month Record
  function getLatestMonth(data) {
    const months = {
      January: 1, February: 2, March: 3, April: 4,
      May: 5, June: 6, July: 7, August: 8,
      September: 9, October: 10, November: 11, December: 12
    };
    return data.reduce((latest, current) => {
      if (!latest) return current;
      if (
        current.year > latest.year ||
        (current.year === latest.year && months[current.month] > months[latest.month])
      ) {
        return current;
      }
      return latest;
    }, null);
  }

  // ✅ Update Top Summary
  function updateSummary(item) {
    if (!item) {
      currentMonthSalary.textContent = "₱0";
      totalDeductions.textContent = "₱0";
      netSalary.textContent = "₱0";
      return;
    }

    const net = item.basic + item.allowance - item.deduction;
    currentMonthSalary.textContent = `₱${(item.basic + item.allowance).toLocaleString()}`;
    totalDeductions.textContent = `₱${item.deduction.toLocaleString()}`;
    netSalary.textContent = `₱${net.toLocaleString()}`;
  }

  // Show all data initially
  renderSalaryTable(salaryData);

  // ✅ Apply Filters
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
