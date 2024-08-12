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

    public function __construct($name = "anonymous", $environments = ["base"])
    {
        $this->name = $name;
        $this->environments = $environments;
        $this->fingerprint = $name . "-" . implode("-", $environments); // TODO: generate fingerprint
    }

    public static function createFromCredentials($name, $password)
    {
        $concatenated = $name . $password;
        $hash = KCryptoUtils::hash($concatenated);
        $fingerprint = KCryptoUtils::hashToString($hash);
        return new self($name, ["base"], $fingerprint);
    }

    public function saveToLocalDrive()
    {
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
    }


    /**
     * Creates a KUserClass instance from a user stored in the local drive.
     *
     * @param string $name The name of the user.
     * @return KUserClass|null The KUserClass instance if the user exists, null otherwise.
     */
    public static function createFromLocalDrive($name)
    {
        // Construct the file path for the user data.
        $filePath = 'users/' . $name . '.json';

        // Check if the file exists.
        if (file_exists($filePath)) {
            // Read the user data from the file.
            $userDataJson = file_get_contents($filePath);
            $userData = json_decode($userDataJson, true);

            // Create a new KUserClass instance with the user data and return it.
            return new self($userData['name'], $userData['environments']);
        }

        // Return null if the user does not exist.
        return null;
    }


    /**
     * Read a KMessageClass instance which has action property equel to "createUser" and KUserClass properties on payload KMessageClass property.
     *
     * @param KMessageClass $message The KMessageClass instance to read.
     * @return KUserClass|null The KUserClass instance if the message properties are valid, null otherwise.
     */
    public static function createFromMessage(KMessageClass $message)
    {
        if ($message->action != "createUser") {
            return null;
        }

        if (!isset($message->payload['name']) || !isset($message->payload['environments'])) {
            return null;
        }

        return new self($message->payload['name'], $message->payload['environments']);
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
}

