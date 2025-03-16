<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "db_pets";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT SpeciesID, SpeciesName FROM tblspecies";
$result = $conn->query($sql);

$species = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $species[] = $row;
    }
} else {
    echo json_encode(["message" => "No records found."]);
    exit;
}

header('Content-Type: application/json');
echo json_encode($species);

$conn->close();
?>
