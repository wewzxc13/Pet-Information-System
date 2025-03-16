<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "db_passenger"; // Replace with your actual database name

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$pasName = $_POST['pasName'] ?? '';
$pasDestinationId = $_POST['pasDestinationId'] ?? '';
$pasGenderId = $_POST['pasGenderId'] ?? '';
$pasPrice = $_POST['pasPrice'] ?? '';

if (!$pasName || !$pasDestinationId || !$pasGenderId || !$pasPrice) {
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

$sql = "INSERT INTO tblpassengers (pas_name, pas_destinationId, pas_genderId, pas_price) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("siii", $pasName, $pasDestinationId, $pasGenderId, $pasPrice);

if ($stmt->execute()) {
    echo json_encode(['success' => 'Passenger added successfully']);
} else {
    echo json_encode(['error' => 'Failed to add passenger']);
}

$stmt->close();
$conn->close();
?>
