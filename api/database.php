<?php
define('DB_SERVER','localhost');
define('DB_USER','cobol1962');
define('DB_PASS' ,'Rm#150620071010');
define('DB_NAME', 'affiliates');

$mysqli = mysqli_connect(DB_SERVER,DB_USER,DB_PASS,DB_NAME);
$mysqli->query("SET NAMES 'utf8'");

mysqli_options($mysqli, MYSQLI_OPT_LOCAL_INFILE, "1");
mysqli_real_connect($mysqli,DB_SERVER,DB_USER,DB_PASS,DB_NAME);

$sql_details = array(
    'user' => "cobol1962",
    'pass' => "Rm#150620071010",
    'db'   => "affiliates",
    'host' => 'localhost'
);
echo " ";

if (mysqli_connect_errno())
{
echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

?>
