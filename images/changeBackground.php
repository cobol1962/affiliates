<?php
 error_reporting(0);
/***************************************************************************************
                            Main Using Class DetectImageColor
***************************************************************************************/
 require('detectImageColor.php');
 header('Content-Type: application/json');
  header("Access-Control-Allow-Origin: *");
 $path = $_GET["path"];
 $mainDetectImageColor = new DetectImageColor($path);
 echo $mainDetectImageColor->getHexa($path);

?>
