<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "db_pets";

// Create a connection to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check if the connection is successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Retrieve the POST parameters
    $petID = $_POST['petID'] ?? '';
    $petName = $_POST['petName'] ?? '';
    $petDOB = $_POST['petDOB'] ?? '';
    $speciesID = $_POST['speciesID'] ?? '';
    $breedID = $_POST['breedID'] ?? '';

    // Prepare the SQL query to update pet details
    $sql = "UPDATE tblpets SET PetName = ?, PetDateOfBirth = ?, SpeciesID = ?, BreedID = ? WHERE PetID = ?";
    
    // Prepare the statement
    $stmt = $conn->prepare($sql);
    if ($stmt) {
        // Bind the parameters in the correct order (petName, petDOB, speciesID, breedID, petID)
        $stmt->bind_param("ssiii", $petName, $petDOB, $speciesID, $breedID, $petID);
        
        // Execute the query
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Pet updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "SQL Error: " . $conn->error]);
    }

    $conn->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
?>
