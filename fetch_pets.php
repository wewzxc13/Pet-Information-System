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

$sql = "SELECT tblpets.PetID, tblpets.PetName, tblpets.PetDateOfBirth, 
               tblspecies.SpeciesName, tblbreeds.BreedName, tblowners.OwnerName
        FROM tblpets
        JOIN tblspecies ON tblpets.SpeciesID = tblspecies.SpeciesID
        JOIN tblbreeds ON tblpets.BreedID = tblbreeds.BreedID
        JOIN tblowners ON tblpets.OwnerID = tblowners.OwnerID";

$result = $conn->query($sql);

$pets = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $pets[] = $row;
    }
}

echo json_encode($pets);

$conn->close();
?>
