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
