<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>KICSY</title>
</head>

<?php
/**
 * INCLUDE CLASSES AND INITIAL VALUES
 */
include("kicsyINI.php");
include("KCryptoTools.php");
include("KMessageClass.php");
include("KUserClass.php");



$message =  KMessageClass::fromPostRequest(KICSY_MASTER_KEY);
if ($message == null) {
    die("NOT_MESSAGE");
}

switch ($message->action) {
    case "login":
        break;

    case "createUser":
        $user = KUserClass::createFromMessage($message);
        break;
}
