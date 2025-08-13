<?php
$localhost = 'localhost';
$username = 'root';
$password = '';
$db_name = 'salary_database';

$conn = new mysqli($localhost, $username, $password, $db_name);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>