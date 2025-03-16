<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "db_passenger";  // Replace with your actual database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to fetch passenger data along with destination and gender names
$sql = "SELECT 
        p.pas_id, 
        p.pas_name, 
        p.pas_price, 
        d.dest_name AS destination_name, 
        g.gender_name AS gender_name
    FROM 
        tblpassengers p
    INNER JOIN 
        tbldestination d ON p.pas_destinationId = d.dest_id
    INNER JOIN 
        tblgender g ON p.pas_genderId = g.gender_id
";

$result = $conn->query($sql);

$passengers = [];
if ($result->num_rows > 0) {
    // Output data of each row
    while($row = $result->fetch_assoc()) {
        $passengers[] = $row;
    }
}

// Return the fetched data as JSON
echo json_encode($passengers);

$conn->close();
?>
