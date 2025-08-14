<?php
$localhost = 'localhost';
$username = 'root';
$password = '';
$db_name = 'salary_db';

$conn = new mysqli($localhost, $username, $password, $db_name);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$result = $conn->query("SELECT * FROM positions ORDER BY id DESC");

$positions = array ();
while ($row = $result->fetch_assoc()) {
    $positions[] = $row;
}

echo json_encode($positions);
$conn->close();
?>