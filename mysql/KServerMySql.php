<?php
include "KUserMySql.php";


/**
 * @var mixed $message  The message object. Has the following properties:
 * @var string $action The action of the message. 
 * @var mixed $payload The payload of the message.
 * @var string $application The application wich the message belongs to.
 */


$message = json_decode(file_get_contents('php://input'), true);

$action = $message["action"];
$payload = $message["payload"];
$application = $message["application"];
$login = $payload["login"];
$password = $payload["password"];
$name = $payload["name"];
$surname = $payload["surname"];
$cedula = $payload["cedula"];
$cellphone = $payload["cellphone"];
$email = $payload["email"];
$birthDate = $payload["birthDate"];

$database = new PDO('mysql:host=localhost;dbname=aasxwjte_selva', 'aasxwjte_selva', 'Selva2024.');


$user = new KUserMySql($database, $login, $password, $application);

switch ($action) {
    case "user_create":
        echo $user->create($database, $login, $password, $application, $name, $surname, $cedula, $cellphone, $email, $birthDate);
        break;

    case "user_verify":
        echo $user->verify();
        break;


    case "user_update":
        echo $user->update($payload->password);
        break;



}