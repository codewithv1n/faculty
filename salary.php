<?php
$host = "localhost";
$username = "root";
$password = "";
$dbname = "salary_db";

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $job_position = $_POST['position'];
    $pay_level = $_POST['payLevel'];
    $monthly_salary = $_POST['monthlySalary'];
    $employment_type = $_POST['employmentType'];
    $effective_date = $_POST['effectiveDate'];

    $stmt = $conn->prepare("INSERT INTO positions (job_position, pay_level, monthly_salary, employment_type, effective_date) 
                             VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sdsss", $job_position, $pay_level, $monthly_salary, $employment_type, $effective_date);

    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "Database error: " . $stmt->error;
    }
    $stmt->close();
    exit; 
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Faculty Management System</title>
    <link rel="stylesheet" href="salarycss.css">
    <script src="salaryfunctions.js" defer></script>
</head>
<body>
<div class="container">
        <!-- Sidebar (hidden by default on mobile) -->
    <div class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <h2>Faculty Management</h2>
            <p>Administrator Dashboard</p>
        </div>
        
        <div class="menu">
            <a href="#" class="menu-item">
                <span class="menu-icon">📊</span>
                <span class="menu-text">Dashboard</span>
            </a>
            <a href="facultyProfile.html" class="menu-item">
                <span class="menu-icon">👤</span>
                <span class="menu-text">Faculty Profile</span>
            </a>
            <a href="#" class="menu-item">
                <span class="menu-icon">📚</span>
                <span class="menu-text">Subject Load Tracker</span>
            </a>
            <a href="#" class="menu-item">
                <span class="menu-icon">📅</span>
                <span class="menu-text">Schedule Assignment</span>
            </a>
            <a href="#" class="menu-item">
                <span class="menu-icon">✅</span>
                <span class="menu-text">Attendance Monitoring</span>
            </a>
            <a href="#" class="menu-item">
                <span class="menu-icon">🏖️</span>
                <span class="menu-text">Leave Application</span>
            </a>
            <a href="#" class="menu-item active">
                <span class="menu-icon">💰</span>
                <span class="menu-text">Salary Grade & Pay</span>
            </a>
            <a href="#" class="menu-item">
                <span class="menu-icon">🏫</span>
                <span class="menu-text">Teaching History</span>
            </a>
            <a href="#" class="menu-item">
                <span class="menu-icon">📝</span>
                <span class="menu-text">Clearance System</span>
            </a>
            <a href="evaluation.html" class="menu-item">
                <span class="menu-icon">⭐</span>
                <span class="menu-text">Evaluation Summary</span>
            </a>
            <a href="#" class="menu-item">
                <span class="menu-icon">📋</span>
                <span class="menu-text">Faculty Directory</span>
            </a>
        </div>
        <div class="logout-container">
            <a href="Login/Login.html" class="logout-btn">
                <span class="menu-icon">🚪</span>
                <span class="menu-text">Log out</span>
            </a>
        </div>
    </div>
    <button id="toggleSidebar" class="toggle-btn">☰</button>

<div class="main-content">
  <form action="salary.php" method="POST">
    <div class="salarytitle"> <h1>Salary Grade & Pay</h1></div>
    <div class="container1">
    <h2>Add New Position</h2>
    <div class="form-group">
      <label for="position">Job Position</label>
      <input type="text"name="position" required>
    </div>
    <div class="form-group">
      <label for="payLevel">Pay Level</label>
      <input type="number"  name="payLevel" required>
    </div>
    <div class="form-group">
      <label for="monthlySalary">Monthly Salary (required charges must applied)</label>
      <input type="number"  name="monthlySalary" required>
    </div>
    <div class="form-group">
      <label for="employmentType">Employment Type (ex. fulltime, part-time, intern, contractual)</label>
      <input type="text"  name="employmentType" required>
    </div>
    <div class="form-group">
      <label for="effectiveDate">Effective Date</label>
      <input type="date"  name="effectiveDate" required>
    </div>
    <button type="submit">Add Position</button>
  </div>
  </form>


 
<div class="container3">
    <h2>Legend</h2>
    <table>
      <thead>
        <tr>
          <th>Pay Level</th>
          <th>Position</th>
          <th>Monthly Salary</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Utility / Janitor</td>
          <td>₱12,000</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Security Guard / Maintenance</td>
          <td>₱18,000</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Administrative Staff / Clerk</td>
          <td>₱23,000</td>
        </tr>
        <tr>
          <td>4</td>
          <td>College Instructor (Part-time,Intern)</td>
          <td>₱28,000</td>
        </tr>
        <tr>
          <td>5</td>
          <td>College Instructor (Full-time)</td>
          <td>₱45,000</td>
        </tr>
      </tbody>
    </table>
</div>



  <div class="container2">
    <h2>Position List</h2>
    <button class="print-btn" id="printBtn">Print</button>
    <table>
      <thead>
        <tr>
          <th>Job Position</th>
          <th>Pay Level</th>
          <th>Monthly Salary</th>
          <th>Employment Type</th>
          <th>Effective Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody class="positionBody">
      </tbody>
    </table>
  </div>
</div>

</body>
</html>