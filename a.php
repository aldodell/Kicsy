<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json; charset=UTF-8");

print_r(json_encode($_POST));
die();