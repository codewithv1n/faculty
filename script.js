 function toggleDropdown() {
      document.querySelector(".dropdown").classList.toggle("show");
    }

   
    window.onclick = function(event) {
      if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown");
        for (let i = 0; i < dropdowns.length; i++) {
          dropdowns[i].classList.remove('show');
        }
      }
    }