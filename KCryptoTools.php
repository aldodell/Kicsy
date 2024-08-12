<?php

/**
 *  This class provides utility functions for encrypting and decrypting text using
 *   cryptographic algorithms.
 *  @author KICSY
 *  @version 1.0
 *  @since 1.0
 *  @access public
 *  @package KCryptoUtils
 */
class KCryptoTools
{

    /**
     * This function generates a hash of the input text using a given size.
     * The hash is an array of integers that represents the input text.
     * The size parameter determines the length of the hash array.
     *
     * @param string $text The input text to be hashed.
     * @param int $size The size of the hash array. Default is 8.
     * @return array The hash array.
     */
    static function hash($text, $size = 8)
    {
        // Initialize the hash array with zeros.
        $result = array_fill(0, $size, 0);

        // Initialize an array of prime numbers.
        $primes = [2];

        // Find prime numbers from 3 to 1000.
        for ($i = 3; $i < 1000; $i += 2) {
            // Check if the current number is divisible by any of the primes in the array.
            // If it is not divisible by any of the primes, add it to the primes array.
            if (!self::isDivisibleByPrimes($i, $primes)) {
                $primes[] = $i;
            }
        }

        // Initialize variables for the loop.
        $k = 0;  // index for the primes array
        $t = 0;  // temporary variable for calculations

        // Loop through each character in the input text.
        for ($i = 0; $i < strlen($text); $i++) {
            // Loop through each element in the hash array.
            for ($j = 0; $j < $size; $j++) {
                // Calculate the new value for the current element in the hash array.
                // Multiply the current element by the prime number at the current index in the primes array.
                // Add the ASCII value of the current character.
                // Take the remainder when dividing by 255.
                $t = ($result[$j] + $t + ($primes[$k] * ord($text[$i]))) % 255;
                $result[$j] = $t;
            }

            // Increment the index for the primes array.
            // If the index is equal to the length of the primes array, reset it to 0.
            $k = ($k + 1) % count($primes);
        }

        return $result;
    }

    /**
     * Checks if a number is divisible by any of the prime numbers in the array.
     *
     * @param int $number The number to check.
     * @param array $primes The array of prime numbers.
     * @return bool Returns true if the number is divisible by any of the prime numbers, false otherwise.
     */
    private static function isDivisibleByPrimes($number, $primes)
    {
        // Iterate through each prime number in the array.
        foreach ($primes as $prime) {
            // Check if the number is divisible by the current prime number.
            if ($number % $prime === 0) {
                // If it is divisible, return true.
                return true;
            }
        }

        // If none of the prime numbers divide the number, return false.
        return false;
    }

    /**
     * Converts an array of hash values to a string representation.
     *
     * @param array $hashArray The array of hash values to convert.
     * @return string The string representation of the hash values.
     */
    static function hashToString($hashArray)
    {
        // Initialize an empty string to hold the hash string.
        $hashString = '';

        // Iterate through each hash value in the array.
        foreach ($hashArray as $hashValue) {
            // Convert the hash value to a hexadecimal string representation and pad it with leading zeros if necessary.
            // The hexadecimal string is then appended to the hash string.
            $hashString .= str_pad(dechex($hashValue), 2, '0', STR_PAD_LEFT);
        }

        // Return the hash string.
        return $hashString;
    }

    /**
     * This function encrypts a given text using a given hash.
     *
     * @param string $text The text to be encrypted.
     * @param array $hash The hash to be used for encryption.
     * @return array The encrypted array.
     */
    static function encrypt($text, $hash)
    {
        // Calculate the output size of the encrypted array.
        // The output size is determined by multiplying the number of elements in the hash
        // array with the number of characters in the text divided by the number of elements
        // in the hash array, and adding 1.
        $outputSize = count($hash) * (1 + intdiv(strlen($text), count($hash)));

        // Split the text into individual characters and convert each character to its corresponding
        // Unicode code point.
        $textArray = array_map('mb_ord', preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY));

        // Create an array of positions, ranging from 0 to the output size minus 1.
        $positions = range(0, $outputSize - 1);

        // Create a vector array filled with zeros, with a length equal to the output size.
        $vector = array_fill(0, $outputSize, 0);

        // Assign elements from the hash array to the vector array. The elements are assigned
        // to positions in the vector array, with each element assigned to a position that is
        // the remainder of the index divided by the number of elements in the hash array.
        foreach ($positions as $index => $position) {
            $vector[$position] = $hash[$index % count($hash)];
        }

        // Sort the positions array using a custom comparison function. The comparison function
        // compares the elements in the vector array at the positions in the positions array.
        usort($positions, function ($a, $b) use ($vector) {
            return $vector[$a] - $vector[$b];
        });

        // Assign elements from the text array to the vector array. The elements are assigned
        // to positions in the vector array, in the order they appear in the sorted positions array.
        foreach ($positions as $index => $position) {
            if ($index < count($textArray)) {
                $vector[$position] = $textArray[$index] ^ $vector[$position];
            }
        }

        // Convert the vector array to a string of hexadecimal characters.
        $ciphertext = '';
        foreach ($vector as $value) {
            $ciphertext .= str_pad(dechex($value), 2, '0', STR_PAD_LEFT);
        }

        // Return the encrypted array.
        return $ciphertext;
    }

    /**
     * Decrypts the given ciphertext using the provided hash.
     *
     * @param string $ciphertext The ciphertext to be decrypted.
     * @param array  $hash       The hash to be used for decryption.
     *
     * @return string The decrypted plaintext.
     */
    static function decrypt($ciphertext, $hash)
    {
        // Convert the ciphertext from a string of hexadecimal characters to an array of integers.
        $decodedCiphertext = array_map('hexdec', str_split($ciphertext, 2));

        // Calculate the size of the vector array.
        // The size is determined by multiplying the number of elements in the hash array
        // with the ceiling of the division of the length of the decoded ciphertext array
        // by the number of elements in the hash array.
        $vectorSize = count($hash) * ceil(count($decodedCiphertext) / count($hash));

        // Create a vector array filled with the hash values.
        // The vector array is created by merging the hash array into itself repeatedly
        // until it has the desired size.
        $vector = array_merge(...array_fill(0, $vectorSize / count($hash), $hash));

        // Create an array of position indexes.
        // The length of the positions array is equal to the length of the vector array.
        $indexes = range(0, $vectorSize - 1);

        // Sort the positions array using a custom comparison function.
        // The comparison function compares the elements in the vector array at the positions in the positions array.
        usort($indexes, function ($a, $b) use ($vector) {
            return $vector[$a] - $vector[$b];
        });

        // Decrypt the ciphertext using the vector array.
        // The decrypted value is obtained by XORing the value in the decoded ciphertext array
        // with the corresponding value in the vector array.
        // The decrypted values are obtained by accessing the decoded ciphertext array using the positions array.
        $decrypted = array_map(function ($index) use ($decodedCiphertext, $vector) {
            return $decodedCiphertext[$index] ^ $vector[$index];
        }, $indexes);

        // Convert the decrypted values from integers to characters and join them into a string.
        $decrypted = implode(array_map('mb_chr', $decrypted));

        $decrypted = rtrim($decrypted, "\0");

        return $decrypted;
    }
}
