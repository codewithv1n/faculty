 function toggleDropdown() {
    const dropdown = document.getElementById("myDropdown");
    const arrow = document.getElementById("arrowIcon");

    const isOpen = dropdown.style.display === "block";
    dropdown.style.display = isOpen ? "none" : "block";
    arrow.classList.toggle("rotate", !isOpen);
  }