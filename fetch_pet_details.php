<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "db_pets";

// Create a connection to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check if the connection is successful
if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Check if 'petID' is provided in the request
if (isset($_GET['petID'])) {
    $petID = intval($_GET['petID']); // Ensure petID is treated as an integer

    // Check if petID is a valid number
    if ($petID > 0) {
        // SQL query to fetch pet details
        $sql = "SELECT PetID, PetName, PetDateOfBirth FROM tblpets WHERE PetID = ?";

        // Prepare the statement
        if ($stmt = $conn->prepare($sql)) {
            // Bind the petID parameter
            $stmt->bind_param("i", $petID);
            $stmt->execute();
            $result = $stmt->get_result();
            
            // Check if any pet is found
            if ($result->num_rows > 0) {
                $petDetails = $result->fetch_assoc();
                echo json_encode($petDetails);
            } else {
                // No pet found with this ID
                http_response_code(404); // Not Found
                echo json_encode(["status" => "error", "message" => "No pet found with this ID"]);
            }

            $stmt->close();
        } else {
            // SQL preparation error
            http_response_code(500); // Internal Server Error
            echo json_encode(["status" => "error", "message" => "SQL Error: " . $conn->error]);
        }
    } else {
        // Invalid petID value
        http_response_code(400); // Bad Request
        echo json_encode(["status" => "error", "message" => "Invalid petID provided"]);
    }

    $conn->close();
} else {
    // No petID parameter provided
    http_response_code(400); // Bad Request
    echo json_encode(["status" => "error", "message" => "No petID parameter provided"]);
}
?>
