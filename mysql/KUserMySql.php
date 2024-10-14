<?php

include "KAnswer.php";


class KUserMySql
{
    public $database;
    public $login;
    public $password;
    public $application;
    public $names;
    public $surnames;
    public $cedula;
    public $cellphone;
    public $email;
    public $birthDate;

    const USER_ALREADY_EXISTS = "user_already_exists";
    const USER_NOT_EXISTS = "user_not_exists";
    const USER_ACCESS_GRANTED = "user_access_granted";
    const USER_NOT_ACCESS_GRANTED = "user_access_not_granted";




    public function __construct($database, $login, $password, $application)
    {
        $this->database = $database;
        $this->login = $login;
        $this->password = $password;
        $this->application = $application;
    }


    public static function create($database, $login = "", $password = "", $application = "", $name = "", $surname = "", $cedula = "", $cellphone = "", $email, $birthDate)
    {

        $user = new KUserMySql($database, $login, $password, $application);
        $sql = "select count(*) from user where login = ? and application = ?";
        $statement = $database->prepare($sql);
        $statement->execute(array($user->login, $user->application));
        $data = $statement->fetchColumn(0);

        if ($data > 0) {
            throw new Exception(self::USER_ALREADY_EXISTS, $user->login);
        }

        $hashPassword = password_hash($user->password, PASSWORD_BCRYPT);

        $sql = "INSERT INTO user (login,password, application,name,surname,cedula,cellphone,email,birthDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";


        try {
            $statement = $database->prepare($sql);

            $statement->bindValue(1, $login);
            $statement->bindValue(2, $hashPassword);
            $statement->bindValue(3, $application);
            $statement->bindValue(4, $name);
            $statement->bindValue(5, $surname);
            $statement->bindValue(6, $cedula);
            $statement->bindValue(7, $cellphone);
            $statement->bindValue(8, $email);
            $statement->bindValue(9, $birthDate);

            $r = $statement->execute();

        } catch (PDOException $e) {
            die($e->getMessage());
        }


        return new KAnswer("USER_CREATED");

    }



    function update($newPassword)
    {
        try {

            $hashPassword = password_hash($this->password, PASSWORD_BCRYPT);
            $sql = "select count(*) from user where login = ? and password = ? and application = ?";
            $statement = $this->db->prepare($sql);
            $data = $statement->execute(array($this->login, $hashPassword, $this->application));
            $data = $data->fetchColumn();

            if ($data == 0) {
                throw new Exception(self::USER_NOT_EXISTS, $this->login);
            }

            $sql = "update user set password = ? where login = ? and application = ?";
            $statement = $this->db->prepare($sql);
            $newHashPassword = password_hash($newPassword, PASSWORD_BCRYPT);
            $data = $statement->execute(array($newHashPassword, $this->login), $this->application);
            return true;
        } catch (Exception $e) {
            return false;
        }
    }


    function verify()
    {
        try {

            $password = password_hash($this->password, PASSWORD_BCRYPT);
            $sql = "select count(*) from user where login = ? and password = ? and application = ?";
            $statement = $this->database->prepare($sql);
            $statement->execute(array($this->login, $password, $this->application));
            $data = (int) $statement->fetchColumn();

            if ($data > 0) {
                return self::USER_ACCESS_GRANTED;
            } else {
                return self::USER_NOT_ACCESS_GRANTED;
            }
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public static function load($database, $login, $password): KUserMySql
    {
        try {
            $hashPassword = password_hash($password, PASSWORD_BCRYPT);
            $sql = "SELECT * FROM user WHERE login = ? AND password = ? ";
            $statement = $database->prepare($sql);
            $statement->execute(array($login, $hashPassword));
            $data = $statement->fetch(PDO::FETCH_ASSOC);
            $user = new KUserMySql($database, $data["login"], $data["password"], $data["application"]);
            $user->name = $data["name"];
            $user->surname = $data["surname"];
            $user->cedula = $data["cedula"];
            $user->cellphone = $data["cellphone"];
            $user->email = $data["email"];
            $user->birthDate = $data["birthDate"];

            return $user;
        } catch (Exception $e) {
            return self::USER_NOT_ACCESS_DENIED;
        }

    }

}
