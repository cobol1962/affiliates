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
  function getAffiliates($data, $params, $url, $mysqli) {
    $where = "";
    if (isset($data["id"])) {
      $where = " WHERE id='" . $data["id"] . "'";
    }
    $sql = "select * from affiliates " . $where . " order by id desc ";

    $res = [];
    $res["data"] = [];
    if (!mysqli_query($mysqli,$sql)) {
      $res["status"] = "fail";
      $res["type"] = "Mysql error";
      $res["title"] = mysqli_error($mysqli);
      $res["sql"] = $sql;
    } else {
      $rez = $mysqli->query($sql);
      $res["status"] = "ok";
      while ($row = mysqli_fetch_assoc($rez)) {
        $res["data"][] = $row;
      }
    }
    return $res;
  }
  function insertUpdateAffiliate($data, $params, $url, $mysqli) {
    foreach (array_keys($data) as $w) {
      $$w = $data[$w];
    }
  
    if ($id == "-1") {
      $sql = "INSERT INTO `affiliates`(`name`, `address`, `telephone`, `contactperson`, `contactemail`, `generalcomission`)
      values ('$name', '$address', '$telephone', '$contactperson', '$contactemail', '$generalcomission')";
    } else {
      $sql = "update `affiliates`
        set `name`='$name', `address`='$address', `telephone`='$telephone', `contactperson`='$contactperson',
         `contactemail`='$contactemail', `generalcomission`='$generalcomission'
       where `id`=$id";
    }
    if (!mysqli_query($mysqli,$sql)) {
      $res["status"] = "fail";
      $res["type"] = "Mysql error";
      $res["title"] = mysqli_error($mysqli);
      $res["sql"] = $sql;
    } else {
      $res["status"] = "ok";
    }
    return $res;
  }
  ?>
