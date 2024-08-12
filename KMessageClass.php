<?php

/**
 * Class for the KMessageClass object.
 * 
 */
class KMessageClass
{
    /** @var string App wich generates the message */
    public $source = "";
    /** @var string App wich receives the message */
    public $target = "";
    /** @var string User wich generated the message */
    public $author = "";
    /** @var string User wich receives the message */
    public $destinatary = "";
    /** @var string Action wich the message contains */
    public $action = "";
    /** @var object Content of the message */
    public $payload = [];

    /**
     * Constructor for the KMessageClass object.
     * 
     * @param string $source The source app of the message.
     * @param string $target The target app of the message.
     * @param string $author The author of the message.
     * @param string $recipient The recipient of the message.
     * @param string $action The action of the message.
     * @param array $payload The payload of the message.
     */
    public function __construct(
        $source = "",
        $target = "",
        $author = "",
        $destinatary = "",
        $action = "",
        $payload = []
    ) {
        // Set the source of the message
        $this->source = $source;

        // Set the target of the message
        $this->target = $target;

        // Set the author of the message
        $this->author = $author;

        // Set the recipient of the message
        $this->destinatary = $destinatary;

        // Set the action of the message
        $this->action = $action;

        // Set the payload of the message
        $this->payload = $payload;
    }

    /**
     * This function converts the current KMessageClass object into an encrypted string.
     * 
     * @param string $key The key used to encrypt the message. Defaults to "1234".
     * @return string The encrypted string representation of the KMessageClass object.
     */
    function toEncryptedString($key = "1234")
    {
        // Convert the current KMessageClass object into a JSON string.
        $json = json_encode($this);

        // Create a new instance of the KCryptoUtils class.
        $krypto = new KCryptoTools();

        // Generate a hash using the provided key.
        $hash = $krypto->hash($key);

        // Encrypt the JSON string using the hash.
        $encrypted = $krypto->encrypt($json, $hash);

        // Return the encrypted string.
        return $encrypted;
    }

    /**
     * This function creates a new instance of the KMessageClass class using the
     * provided JSON string.
     * 
     * @param string $json The JSON string containing the data to populate the
     *                    new instance.
     * @return KMessageClass The new instance of the KMessageClass class.
     */
    static function fromJson($json)
    {
        // Decode the JSON string into an associative array.
        $data = json_decode($json);

        // Create a new instance of the KMessageClass class using the values from
        // the associative array.
        return new self(
            $data->source,    // The source of the message.
            $data->target,    // The target of the message.
            $data->author,    // The author of the message.
            $data->destinatary, // The destinatary of the message.
            $data->action,    // The action of the message.
            $data->payload    // The payload of the message.
        );
    }

    /**
     * This function creates a new instance of the KMessageClass class using the
     * decrypted data from an encrypted string.
     *
     * @param string $encrypted The encrypted string containing the data to populate the
     *                          new instance.
     * @param string $key The key used to decrypt the message. Defaults to "1234".
     * @return KMessageClass The new instance of the KMessageClass class.
     */
    static function fromEncryptedString($encrypted, $key = "1234")
    {
        // Create a new instance of the KCryptoUtils class.
        $krypto = new KCryptoTools();

        // Generate a hash using the provided key.
        $hash = $krypto->hash($key);

        // Decrypt the encrypted string using the hash.
        $data = $krypto->decrypt($encrypted, $hash);

        // Create a new instance of the KMessageClass class using the decrypted data.
        $m = KMessageClass::fromJson($data);

        // Return the new instance of the KMessageClass class.
        return $m;
    }


    /**
     * This function creates a new instance of the KMessageClass class using
     * data received via a POST request.
     *
     * @param string $key The key used to decrypt the message. If not provided,
     *                   the message is assumed to be plaintext.
     * @return KMessageClass The newly created instance of KMessageClass.
     */
    static function fromPostRequest($key = null)
    {
        // Check if the 'message' key is set in the $_POST array.
        // If it is set, proceed with creating a new instance of KMessageClass.
        // If it is not set, return null.
        if(isset($_POST['message'])) {

            // Retrieve the encrypted message from the POST request.
            $message = $_POST['message'];

            // Check if a key was provided.
            // If a key was provided, decrypt the message using the key.
            // If a key was not provided, the message is assumed to be plaintext.
            if ($key != null) {
                // Create a new instance of the KCryptoUtils class.
                $krypto = new KCryptoTools();

                // Generate a hash using the provided key.
                $hash = $krypto->hash($key);

                // Decrypt the encrypted message using the hash.
                // The decrypted message is stored in the $decryptedMessage variable.
                $decryptedMessage = $krypto->decrypt($message, $hash);

                // Update the message with the decrypted version.
                // The decrypted message will be used to create a new instance of KMessageClass.
                $message = $decryptedMessage;
            }

            // Create a new instance of the KMessageClass class using the decrypted data.
            // The decrypted data is passed as an argument to the fromJson method.
            // The fromJson method returns a new instance of KMessageClass with the decrypted data.
            $kMessage = self::fromJson($message);

            // Return the new instance of the KMessageClass class.
            return $kMessage;
        } else {
            // If the 'message' key is not set in the $_POST array, return null.
            return null;
        }
    }
}
