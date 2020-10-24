<?php
//error_reporting(E_ALL);
//  ini_set('display_errors', 1);
  session_start();
  include 'database.php';
  header('Content-Type: application/json');
  header("Access-Control-Allow-Origin: *");
  $actions = explode("/", $_GET["request"]);
  $action = str_replace("-", "_" ,$actions[0]);
  $data = [];
  $updated = 0;
  $itemsupdated = 0;

  $url = "https://24670e1cc5e49cc0a6a5483607c2fe8b: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@costerdiamonds.myshopify.com/admin/api/2020-07/";

  $r = $action($_POST, [], $url, $mysqli);
  echo json_encode($r);
  exit;
  function voided($data, $params, $url, $mysqli) {
    echo "blah";
  }
