 function toggleDropdown() {
    const dropdown = document.getElementById("myDropdown");
    const arrow = document.getElementById("arrowIcon");

    const isOpen = dropdown.style.display === "block";
    dropdown.style.display = isOpen ? "none" : "block";
    arrow.classList.toggle("rotate", !isOpen);
  }


   function addPosition() {
      const position = document.getElementById("position").value;
      const grade = document.getElementById("salaryGrade").value;
      const salary = document.getElementById("monthlySalary").value;
      const effectiveDate = document.getElementById("effectiveDate").value;
      
      if (!position || !grade || !salary || !effectiveDate) {
        alert("Please fill out all fields.");
        return;
      }

      const tbody = document.getElementById("positionBody");
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>\${position}</td>
        <td>SG \${grade}</td>
        <td>₱\${salary}</td>
        <td>\${effectiveDate}</td>
        <td><button class="btn-edit" onclick="editRow(this)">Change Salary</button></td>
      `;

      tbody.appendChild(row);

      document.getElementById("position").value = "";
      document.getElementById("salaryGrade").value = "";
      document.getElementById("monthlySalary").value = "";
      document.getElementById("effectiveDate").value = "";
    }

    function editRow(button) {
      const row = button.parentElement.parentElement;
      const currentSalary = row.children[2].innerText.replace('₱','');
      const newSalary = prompt("Enter new monthly salary:", currentSalary);
      if (newSalary !== null && !isNaN(newSalary) && newSalary.trim() !== '') {
        row.children[2].innerText = `₱\${newSalary}`;
      } else if (newSalary !== null) {
        alert("Invalid input. Salary not changed.");
      }
    }