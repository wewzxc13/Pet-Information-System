<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "db_pets";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Log incoming POST data for debugging
file_put_contents('php://stderr', print_r($_POST, TRUE));

// Retrieve petID from POST data
$petID = $_POST['petID'] ?? '';

if ($petID) {
    // SQL query to delete the pet record
    $sql = "DELETE FROM tblpets WHERE PetID='$petID'";

    // Execute the query
    if ($conn->query($sql) === TRUE) {
        echo "Pet deleted successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
} else {
    echo "No petID provided";
}

// Close the connection
$conn->close();
?>
