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

$speciesID = isset($_GET['speciesID']) ? intval($_GET['speciesID']) : 0;

$sql = "SELECT tblbreeds.BreedID, tblbreeds.BreedName, tblbreeds.SpeciesID 
        FROM tblbreeds 
        WHERE tblbreeds.SpeciesID = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $speciesID);
$stmt->execute();
$result = $stmt->get_result();

$breeds = array();
while ($row = $result->fetch_assoc()) {
    $breeds[] = $row;
}

header('Content-Type: application/json');
echo json_encode($breeds);

$stmt->close();
$conn->close();
?>
