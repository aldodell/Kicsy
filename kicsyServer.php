<?php

/**
 * INCLUDE CLASSES AND INITIAL VALUES
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json; charset=UTF-8");

include("kicsyINI.php");
include("KCryptoTools.php");
include("KMessageClass.php");
include("KUserClass.php");


$message =  KMessageClass::fromPostRequest(null); //KICSY_MASTER_KEY

if ($message == null) {
    die("NOT_MESSAGE");
}

switch ($message->action) {

    case "user_login":
        $credentials = $message->payload;
        $user = KUserClass::authenticate($credentials->name, $credentials->password);
        if($user) { echo $user->__toString(); } else  { echo "ERROR: User not found"; }
        break;

    case "user_create":
        $user = KUserClass::createFromMessage($message);
        $user->save();
        echo "User $user->name create successfully!";
        break;

    case "user_delete":
        $name = $message->payload->name;
        if (KUserClass::delete($name)) {
            echo "User $name delete successfully!";
        } else {
            echo "User $name not found!";
        }

        break;

    case "user_list":
        $users = KUserClass::getUsers();
        echo json_encode($users);
        break;
}
