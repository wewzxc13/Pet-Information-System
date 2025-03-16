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

$orderBy = 'tblpets.PetID'; 

if (isset($_GET['filter'])) {
    switch ($_GET['filter']) {
        case 'owner':
            $orderBy = 'tblowners.OwnerName';
            break;
        case 'species':
            $orderBy = 'tblspecies.SpeciesName';
            break;
        case 'breed':
            $orderBy = 'tblbreeds.BreedName';
            break;
        case 'dob':
            $orderBy = 'tblpets.PetDateOfBirth';
            break;
    }
}

$sql = "SELECT tblpets.PetID, tblpets.PetName, tblpets.PetDateOfBirth, 
               tblspecies.SpeciesName, tblbreeds.BreedName, tblowners.OwnerName
        FROM tblpets
        JOIN tblspecies ON tblpets.SpeciesID = tblspecies.SpeciesID
        JOIN tblbreeds ON tblpets.BreedID = tblbreeds.BreedID
        JOIN tblowners ON tblpets.OwnerID = tblowners.OwnerID
        ORDER BY $orderBy";

$result = $conn->query($sql);

$pets = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $pets[] = $row;
    }
}

$conn->close();

echo json_encode($pets);
?>
