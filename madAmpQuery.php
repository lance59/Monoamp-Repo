<?php
//
// hostname, username, password - set them according to your setup
//

// query command from javascript ajax call
// $command = $_POST['queryDb']

$link = mysql_connect("localhost", "root", "udooer");

// select database
mysql_select_db("madAmp", $link);

// Formulate Query
$query = sprintf("SELECT * FROM `zones`");
// $command WHERE $command ='%s'",
//   mysql_real_escape_string($command));
    
// Perform Query
$result = mysql_query($query);

// read result into array
$data = array();

while(($row = mysql_fetch_assoc($result))) {
	$data[] = $row;
}

// close mysql connection
mysql_close($link);

// Free the resources associated with the result set
// This is done automatically at the end of the script
mysql_free_result($result);

echo json_encode($data);

?>
