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

$petName = $_POST['petName'] ?? '';
$petDOB = $_POST['petDOB'] ?? '';
$speciesID = $_POST['speciesID'] ?? '';
$breedID = $_POST['breedID'] ?? '';
$ownerID = $_POST['ownerID'] ?? '';

if (!$petName || !$petDOB || !$speciesID || !$breedID || !$ownerID) {
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

$sql = "INSERT INTO tblpets (PetName, PetDateOfBirth, SpeciesID, BreedID, OwnerID) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $petName, $petDOB, $speciesID, $breedID, $ownerID);

if ($stmt->execute()) {
    echo json_encode(['success' => 'Pet added successfully']);
} else {
    echo json_encode(['error' => 'Failed to add pet']);
}

$stmt->close();
$conn->close();
?>
