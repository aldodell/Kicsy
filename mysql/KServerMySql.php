<?php
include("KUserMySql.php");

if (!isset($_POST["message"])) {
    die("Data not found");
}




/**
 * @var mixed $message  The message object. Has the following properties:
 * @var string $action The action of the message. 
 * @var mixed $payload The payload of the message.
 * @var string $application The application wich the message belongs to.
 */
$message = $_POST["message"];
$message = json_decode($payload);
$action = $message->action;
$payload = $message->payload;
$application = $message->application;


$database = new PDO('mysql:host=localhost;dbname=aasxwjte_selva', 'aasxwjte_selva', 'Selva2024.');


switch ($action) {
    case "user_create":
        $user = new KUserMySql($database, $payload->name, $payload->password, $application);
        echo $user->create();
        break;

    case "user_update":
        $user = new KUserMySql($database, $payload->name, $payload->password, $application);
        echo $user->update($payload->password);
        break;

    case "user_verify":
        $user = new KUserMySql($database, $payload->name, $payload->password, $application);
        echo $user->verify();
        break;


}