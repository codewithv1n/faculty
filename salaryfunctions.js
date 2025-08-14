document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault();

    let job_position = document.querySelector('input[name="position"]').value;
    let pay_level = document.querySelector('input[name="payLevel"]').value;
    let monthly_salary = document.querySelector('input[name="monthlySalary"]').value;
    let employment_type = document.querySelector('input[name="employmentType"]').value;
    let effective_date = document.querySelector('input[name="effectiveDate"]').value;

    let formData = new FormData();
    formData.append("position", job_position);
    formData.append("payLevel", pay_level);
    formData.append("monthlySalary", monthly_salary);
    formData.append("employmentType", employment_type);
    formData.append("effectiveDate", effective_date);

    fetch("salary.php", { 
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        data = data.trim(); 
        if (data === "success") {
            loadPositions();
            document.querySelector("form").reset();
        } else {
            console.error("Server response:", data); 
            alert("Error: " + data);
        }
    })
    .catch(error => {
        console.error("Fetch error:", error);
        alert("An error occurred while saving the data.");
    });
});

function loadPositions() {
    fetch("salarydatabase.php")
    .then(response => response.json())
    .then(data => {
        let tbody = document.querySelector("tbody.positionBody");
        tbody.innerHTML = "";
        data.forEach(row => {
            tbody.innerHTML += `
                <tr>
                    <td>${row.job_position}</td>
                    <td>${row.pay_level}</td>
                    <td>₱${row.monthly_salary}</td>
                    <td>${row.employment_type}</td>
                    <td>${row.effective_date}</td>
                    <td><button class="delete-btn" data-id="${row.id}">Delete</button></td>
                </tr>
            `;
        });
    })
    .catch(error => console.error("Error loading positions:", error));
}

document.addEventListener("DOMContentLoaded", loadPositions);
