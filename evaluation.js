// sidebar
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const toggleSidebarBtn = document.getElementById("toggleSidebar");
  const logoutBtn = document.querySelector(".logout-btn");

  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  document.body.appendChild(overlay);

  if (window.innerWidth <= 768) {
    sidebar.classList.remove("open");
  } else {
    sidebar.classList.add("open");
  }

  toggleSidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");

    if (window.innerWidth <= 768) {
      overlay.classList.toggle("active", sidebar.classList.contains("open"));
    }
  });

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
  });

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

window.addEventListener("load", () => {
  document.querySelector(".sidebar").classList.add("animated");
  document.querySelector(".main").classList.add("animated");
  document.querySelector(".toggle-btn").classList.add("animated");
});

// Evaluation dropdown functionality
document.addEventListener("DOMContentLoaded", function () {
  const evaluationMenu = document.getElementById("evaluation-menu");
  const evaluationSubmenu = document.getElementById("evaluation-submenu");
  const evaluationLinks = evaluationSubmenu.querySelectorAll(".submenu-item");

  evaluationSubmenu.classList.toggle(
    "open",
    localStorage.getItem("evaluationDropdownOpen") === "true"
  );

  if (localStorage.getItem("evaluationDropdownOpen") === "true") {
    evaluationMenu
      .querySelector(".dropdown-icon i")
      .classList.replace("fa-chevron-down", "fa-chevron-up");
  }

  evaluationMenu.addEventListener("click", function () {
    const icon = this.querySelector(".dropdown-icon i");
    evaluationSubmenu.classList.toggle("open");

    const isOpen = evaluationSubmenu.classList.contains("open");
    localStorage.setItem("evaluationDropdownOpen", isOpen);

    icon.classList.toggle("fa-chevron-up", isOpen);
    icon.classList.toggle("fa-chevron-down", !isOpen);
  });

  evaluationLinks.forEach((link) => {
    link.addEventListener("click", function () {
      evaluationLinks.forEach((item) => item.classList.remove("active"));
      this.classList.add("active");

      const linkText = this.textContent.trim().toLowerCase();

      if (linkText === "summary") {
        evaluationMenu.classList.remove("active");
      } else {
        evaluationMenu.classList.add("active");
      }

      localStorage.setItem("activeEvaluationSubmenu", this.textContent.trim());

      evaluationSubmenu.classList.add("open");
      localStorage.setItem("evaluationDropdownOpen", "true");

      const icon = evaluationMenu.querySelector(".dropdown-icon i");
      icon.classList.replace("fa-chevron-down", "fa-chevron-up");
    });
  });

  const activeEvaluation = localStorage.getItem("activeEvaluationSubmenu");
  if (activeEvaluation) {
    evaluationLinks.forEach((link) => {
      if (link.textContent.trim() === activeEvaluation) {
        link.classList.add("active");

        if (activeEvaluation.toLowerCase() !== "summary") {
          evaluationMenu.classList.add("active");
        }
      }
    });
  }
});

// LocalStorage Utilities
function getEvaluations() {
  return JSON.parse(localStorage.getItem("evaluations")) || [];
}
function saveEvaluations(evaluations) {
  localStorage.setItem("evaluations", JSON.stringify(evaluations));
}

// FORM PAGE (evalform.html)
if (document.getElementById("evaluationForm")) {
  const form = document.getElementById("evaluationForm");
  const saveStay = document.getElementById("saveStay");
  const toast = document.createElement("div");
  toast.id = "toast";
  toast.className = "toast";
  document.body.appendChild(toast);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSave(true);
  });

  saveStay.addEventListener("click", (e) => {
    e.preventDefault();
    handleSave(false);
  });

  function handleSave(redirect) {
    const facultyName = document.getElementById("facultyName").value.trim();
    const studentFeedback = parseFloat(
      document.getElementById("studentFeedback").value
    );
    const peerReview = parseFloat(document.getElementById("peerReview").value);
    const hodEvaluation = parseFloat(
      document.getElementById("hodEvaluation").value
    );
    const semester = document.getElementById("semester").value;

    if (!facultyName || !semester) {
      showToast("⚠️ Please complete all fields.", "error");
      return;
    }

    const entry = {
      facultyName,
      studentFeedback,
      peerReview,
      hodEvaluation,
      semester,
    };

    const evaluations = getEvaluations();
    evaluations.push(entry);
    saveEvaluations(evaluations);

    if (redirect) {
      window.location.href = "evaluation.html";
    } else {
      showToast("✅ Saved successfully!", "success");
      form.reset();
    }
  }

  function showToast(message, type) {
    toast.textContent = message;
    toast.style.backgroundColor = type === "error" ? "#c0392b" : "#27ae60";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  }
}

// EVALUATION PAGE (evaluation.html)
if (document.getElementById("facultyTable")) {
  const facultyTable = document.getElementById("facultyTable");
  const avgScoreElem = document.getElementById("avgScore");
  const topFacultyElem = document.getElementById("topFaculty");
  const semesterElem = document.getElementById("semesterDisplay");

  const controls = document.createElement("div");
  controls.className = "table-controls";
  controls.innerHTML = `
    <input type="text" id="searchInput" placeholder="🔍 Search Faculty...">
    <div class="right-controls">
      <select id="semesterFilter">
        <option value="all">All Semesters</option>
        <option value="1st Semester AY 2025">1st Semester AY 2025</option>
        <option value="2nd Semester AY 2025">2nd Semester AY 2025</option>
        <option value="1st Semester AY 2026">1st Semester AY 2026</option>
        <option value="2nd Semester AY 2026">2nd Semester AY 2026</option>
      </select>
      <button id="exportBtn" class="export-btn">Export CSV</button>
      <button id="clearDataBtn" class="clear-btn">Clear Data</button>
    </div>
  `;
  facultyTable.parentElement.before(controls);

  const semesterFilter = document.getElementById("semesterFilter");
  const searchInput = document.getElementById("searchInput");
  const exportBtn = document.getElementById("exportBtn");
  const clearDataBtn = document.getElementById("clearDataBtn");

  const evaluations = getEvaluations();

  function renderTable(filterSemester = "all", searchText = "") {
    let filtered = evaluations;

    if (filterSemester !== "all") {
      filtered = filtered.filter(
        (e) =>
          e.semester.trim().toLowerCase() ===
          filterSemester.trim().toLowerCase()
      );
    }

    if (searchText.trim() !== "") {
      filtered = filtered.filter((e) =>
        e.facultyName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filtered.length === 0) {
      facultyTable.innerHTML = `<tr><td colspan="5" style="text-align:center;">No records found.</td></tr>`;
      avgScoreElem.textContent = "—";
      topFacultyElem.textContent = "—";
      semesterElem.textContent =
        filterSemester === "all" ? "All Semesters" : filterSemester;
      return;
    }

    facultyTable.innerHTML = filtered
      .map((e) => {
        const avg = (
          (e.studentFeedback + e.peerReview + e.hodEvaluation) /
          3
        ).toFixed(2);
        return `
          <tr data-name="${e.facultyName}">
            <td>${e.facultyName}</td>
            <td>${e.studentFeedback}</td>
            <td>${e.peerReview}</td>
            <td>${e.hodEvaluation}</td>
            <td>${avg}</td>
          </tr>
        `;
      })
      .join("");

    const averages = filtered.map((e) => ({
      name: e.facultyName,
      avg: (e.studentFeedback + e.peerReview + e.hodEvaluation) / 3,
      semester: e.semester,
    }));

    const totalAvg = (
      averages.reduce((sum, e) => sum + e.avg, 0) / averages.length
    ).toFixed(2);

    const topFaculty = averages.reduce(
      (max, e) => (e.avg > max.avg ? e : max),
      averages[0]
    );

    avgScoreElem.textContent = `${totalAvg} / 5`;
    topFacultyElem.textContent = topFaculty.name;
    semesterElem.textContent =
      filterSemester === "all" ? "All Semesters" : filterSemester;

    document.querySelectorAll("#facultyTable tr").forEach((row) => {
      row.classList.toggle("highlight", row.dataset.name === topFaculty.name);
    });
  }

  exportBtn.addEventListener("click", () => {
    const rows = [
      [
        "Faculty Name",
        "Student Feedback",
        "Peer Review",
        "HOD Evaluation",
        "Average",
        "Semester",
      ],
    ];

    document.querySelectorAll("#facultyTable tr").forEach((row) => {
      const cols = Array.from(row.querySelectorAll("td")).map(
        (td) => td.textContent
      );
      if (cols.length) {
        const faculty = evaluations.find((ev) => ev.facultyName === cols[0]);
        cols.push(faculty ? faculty.semester : "");
        rows.push(cols);
      }
    });

    const csvContent = rows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "evaluation_records.csv";
    link.click();
  });

  clearDataBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all evaluation data?")) {
      localStorage.removeItem("evaluations");
      alert("All evaluation records have been deleted.");
      location.reload();
    }
  });

  semesterFilter.addEventListener("change", () => {
    renderTable(semesterFilter.value, searchInput.value);
  });

  searchInput.addEventListener("input", () => {
    renderTable(semesterFilter.value, searchInput.value);
  });

  renderTable();
}

// for logs
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
      "%cEvaluation Summary is active and ready.",
      "color: #00ff7f; font-weight: bold;"
    );
  }, 1000);
});
