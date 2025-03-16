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

error_log(print_r($_POST, true)); // Log the POST data to debug

if (isset($_POST['petId'])) {
    $petId = $_POST['petId'];

    $query = "SELECT 
        tblowners.OwnerName, tblowners.OwnerContactDetails, tblowners.OwnerAddress,
        tblspecies.SpeciesName,
        tblbreeds.BreedName,
        tblpets.PetName, tblpets.PetDateOfBirth
        FROM tblpets
        JOIN tblowners ON tblpets.OwnerID = tblowners.OwnerID
        JOIN tblspecies ON tblpets.SpeciesID = tblspecies.SpeciesID
        JOIN tblbreeds ON tblpets.BreedID = tblbreeds.BreedID
        WHERE tblpets.PetID = ?
    ";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $petId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode($row);
    } else {
        echo json_encode([]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "petId not set"]);
}

$conn->close();
?>
