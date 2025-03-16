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

$sql = "SELECT OwnerID, OwnerName, OwnerContactDetails, OwnerAddress FROM tblowners";
$result = $conn->query($sql);

$owners = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $owners[] = $row;
    }
} else {
    echo json_encode(["message" => "No records found."]);
    exit;
}

header('Content-Type: application/json');
echo json_encode($owners);

$conn->close();
?>
