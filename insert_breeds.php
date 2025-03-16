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

// Get POST data
$breedName = $_POST['breedName'] ?? ''; // Added default empty string
$speciesID = $_POST['speciesID'] ?? ''; // Added default empty string

// SQL query to insert new breed with species ID
$sql = "INSERT INTO tblbreeds (BreedName, SpeciesID) VALUES (?, ?)";

$stmt = $conn->prepare($sql); // Changed $connection to $conn
$stmt->bind_param("si", $breedName, $speciesID);

if ($stmt->execute()) {
    echo "Breed added successfully";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
