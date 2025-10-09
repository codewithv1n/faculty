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

// sidebar dropdown functionality.
document.addEventListener("DOMContentLoaded", function () {
  const toggleSidebar = document.getElementById("toggleSidebar");
  const sidebar = document.getElementById("sidebar");

  if (toggleSidebar && sidebar) {
    toggleSidebar.addEventListener("click", function () {
      sidebar.classList.toggle("collapsed");
    });
  }

  document.getElementById("salary-menu").addEventListener("click", function () {
    const submenu = document.getElementById("salary-submenu");
    const icon = this.querySelector(".dropdown-icon i");

    submenu.classList.toggle("open");

    if (submenu.classList.contains("open")) {
      icon.classList.remove("fa-chevron-down");
      icon.classList.add("fa-chevron-up");
    } else {
      icon.classList.remove("fa-chevron-up");
      icon.classList.add("fa-chevron-down");
    }
  });
});
