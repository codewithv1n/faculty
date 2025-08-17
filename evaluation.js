document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const toggleSidebarBtn = document.getElementById("toggleSidebar");
    const logoutBtn = document.querySelector(".logout-btn");

    // Create overlay
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);

    // Default state
    if (window.innerWidth <= 768) {
        sidebar.classList.remove("open");
    } else {
        sidebar.classList.add("open");
    }

    // Toggle sidebar
    toggleSidebarBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");

        if (window.innerWidth <= 768) {
            overlay.classList.toggle("active", sidebar.classList.contains("open"));
        }
    });

    // Close sidebar when clicking overlay
    overlay.addEventListener("click", () => {
        sidebar.classList.remove("open");
        overlay.classList.remove("active");
    });

    // Logout confirm
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
