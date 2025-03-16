<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "db_pets";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

file_put_contents('php://stderr', print_r($_POST, TRUE));

$speciesName = $_POST['speciesName'] ?? '';

$sql = "INSERT INTO tblspecies  (SpeciesName) VALUES ('$speciesName')";

if ($conn->query($sql) === TRUE) {
    echo "Owner added successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
