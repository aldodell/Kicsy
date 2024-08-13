<?php

/**
 * This class represents a user in the Kicsy system.
 * 
 * The KUserClass has several properties:
 * - $name: the name of the user. It is a string and has a default value of "anonymous".
 * - $fingerprint: a unique fingerprint generated from the user's name and environments. It is a string.
 * - $environments: an array of strings representing the environments that the user belongs to. It has a default value of ["base"].
 *
 * The KUserClass has a constructor that takes two parameters:
 * - $name: the name of the user. It is a string and has a default value of "anonymous".
 * - $environments: an array of strings representing the environments that the user belongs to. It has a default value of ["base"].
 *
 * In the constructor, the $name and $environments parameters are assigned to the corresponding properties of the class instance.
 * Then, the $fingerprint property is set to a string generated from the $name and $environments parameters, joined together with hyphens.
 *
 * TODO: Generate a more robust fingerprint for the user.
 */
class KUserClass
{
    public $name;
    public $fingerprint;
    public $environments = [];


    public function __construct($name = "anonymous", $password = null, $environments = ["base"])
    {
        $this->name = $name;
        $this->environments = $environments;
        if (isset($password)) {
            $this->fingerprint = KCryptoTools::hashToString(KCryptoTools::hash($password));
        } else {
            $this->fingerprint = $name . "-" . $environments;
        }
    }


    public function save()
    {
        //die( getcwd());
        $userData = [
            'name' => $this->name,
            'fingerprint' => $this->fingerprint,
            'environments' => $this->environments
        ];

        $userDataJson = json_encode($userData);

        $filePath = 'users/' . $this->name . '.json';

        if (!is_dir('users')) {
            mkdir('users', 0777, true);
        }

        file_put_contents($filePath, $userDataJson);

        return $this;
    }


    /**
     * Creates a KUserClass instance from a user stored in the local drive.
     *
     * @param string $name The name of the user.
     * @return KUserClass|null The KUserClass instance if the user exists, null otherwise.
     */
    public static function load($name)
    {
        // Construct the file path for the user data.
        $filePath = 'users/' . $name . '.json';

        // Check if the file exists.
        if (file_exists($filePath)) {
            // Read the user data from the file.
            $userDataJson = file_get_contents($filePath);
            $userData = json_decode($userDataJson, true);
            $user = new self($name, null, null);

            foreach ($userData as $key => $value) {
                $user->{$key} = $value;
            }

            // Create a new KUserClass instance with the user data and return it.
            return $user;
        }

        // Return null if the user does not exist.
        return null;
    }


    /**
     * Delete an user from its name.
     *
     * @param string $name The name of the user.
     * @return bool True if the user was deleted, false otherwise.
     */
    public static function delete($name)
    {
        $filePath = 'users/' . $name . '.json';

        if (file_exists($filePath)) {
            return unlink($filePath);
        }

        return false;
    }


    /**
     * Returns a string representation of the KUserClass object.
     *
     * The string representation is in JSON format.
     *
     * @return string The JSON string representation of the KUserClass object.
     */
    public function __toString()
    {
        // Convert the KUserClass object to a JSON string and return it.
        return json_encode($this);
    }


    /**
     * Read a KMessageClass instance which has action property equel to "createUser" and KUserClass properties on payload KMessageClass property.
     *
     * @param KMessageClass $message The KMessageClass instance to read.
     * @return KUserClass|null The KUserClass instance if the message properties are valid, null otherwise.
     */
    public static function createFromMessage(KMessageClass $message)
    {
        if ($message->action != "user_create") {
            return null;
        }

        if (!isset($message->payload->name) || !isset($message->payload->environments) || !isset($message->payload->password)) {
            return null;
        }

        return new self($message->payload->name, $message->payload->password, $message->payload->environments);
    }


    /**
     * Change the fingerprint of the user, both in memory and on disk.
     *
     * @param string $newFingerprint The new fingerprint to set.
     * @return void
     */
    public function changeFingerprint($newFingerprint)
    {
        // Change the fingerprint property in memory.
        $this->fingerprint = $newFingerprint;

        // Change the fingerprint property on disk.
        $userData = [
            'name' => $this->name,
            'environments' => $this->environments,
            'fingerprint' => $newFingerprint,
        ];

        $userDataJson = json_encode($userData);
        file_put_contents('users/' . $this->name . '.json', $userDataJson);
    }


    /**
     * Authenticates a user by checking if the provided name and password match the stored fingerprint.
     *
     * @param string $username The username of the user.
     * @param string $password The password of the user.
     * @return KUserClass|bool The authenticated user instance if the credentials match, false otherwise.
     */
    public static function authenticate($username, $password)
    {
        $filePath = 'users/' . $username . '.json';

        if (!file_exists($filePath)) {
            return new KMessageClass("system", "system", "system", "system", "user_not_found",  $username);
        }

        $hash = KCryptoTools::hash($password);

        $fingerprint = KCryptoTools::hashToString($hash);



        $user = KUserClass::load($username);
        if ($user->fingerprint == $fingerprint) {
            return new KMessageClass("system", "system", "system", "system", "user_authenticated", $user->__toString());
        } else {
            return new KMessageClass("system", "system", "system", "system", "user_authentication_failed",  $username);
        }
    }


    /**
     * This static method returns a list of users.
     *
     * @return array An array of user names.
     */
    public static function getUsers()
    {
        $usersPath = 'users/';
        $dir = new \DirectoryIterator($usersPath);
        $users = [];
        foreach ($dir as $fileinfo) {
            if (!$fileinfo->isDot()) {
                $users[] = $fileinfo->getBasename(".json");
            }
        }
        return $users;
    }
}
