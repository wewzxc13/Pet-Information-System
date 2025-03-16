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

// Retrieve search key from query parameters
$searchKey = isset($_GET['searchKey']) ? $_GET['searchKey'] : '';

// Prepare the SQL statement
$sql = "
    SELECT p.*, o.OwnerName, s.SpeciesName, b.BreedName
    FROM tblpets p
    JOIN tblowners o ON p.OwnerID = o.OwnerID
    JOIN tblspecies s ON p.SpeciesID = s.SpeciesID
    JOIN tblbreeds b ON p.BreedID = b.BreedID
    WHERE o.OwnerName LIKE ?
    ORDER BY p.PetName
";

// Prepare and execute the statement
$stmt = $conn->prepare($sql);
$searchKey = "%$searchKey%";
$stmt->bind_param('s', $searchKey); // Use 's' for string type
$stmt->execute();

// Fetch results
$result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// Clean up
$stmt->close();
$conn->close();

// Return the results as JSON
echo json_encode($result);
?>
