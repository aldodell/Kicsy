<?php

class KUserMySql
{
    public $db;
    public $login;
    public $password;
    public $application;

    const USER_ALREADY_EXISTS = "user_already_exists";
    const USER_NOT_EXISTS = "user_not_exists";
    const USER_ACCESS_GRANTED = "user_access_granted";
    const USER_NOT_ACCESS_GRANTED = "user_access_not_granted";


    public function __construct($db, $login, $password, $application)
    {
        $this->db = $db;
        $this->login = $login;
        $this->password = $password;
        $this->application = $application;
    }

    /**
     * Method to create a user.
     */
    function create()
    {

        $sql = "select count(*) from user where login = ? and application = ?";
        $statement = $this->db->prepare($sql);
        $data = $statement->execute(array($this->login, $this->application));
        $data = $data->fetchColumn();

        if ($data > 0) {
            throw new Exception(self::USER_ALREADY_EXISTS, $this->login);
        }

        $hashPassword = password_hash($this->password, PASSWORD_BCRYPT);

        $sql = "insert into user (login, password, application) values (?, ?, ?)";
        $statement = $this->db->prepare($sql);
        $data = $statement->execute(array($this->login, $hashPassword, $this->application));
        return true;

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
            $statement = $this->db->prepare($sql);
            $data = $statement->execute(array($this->login, $password, $this->application));
            $data = $data->fetchColumn();
            if ($data > 0) {
                return self::USER_ACCESS_GRANTED;
            } else {
                return self::USER_NOT_ACCESS_GRANTED;
            }
        }
    }

}


