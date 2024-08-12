<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<?php

class KCryptoUtils
{


    static function hash($text, $size = 8)
    {
        $result = array_fill(0, $size, 0);
        $primes = array(2);

        for ($i = 3; $i < 1000; $i += 2) {
            if (!self::isDivisibleByPrimes($i, $primes)) {
                $primes[] = $i;
            }
        }

        $k = 0;
        $t = 0;

        for ($i = 0; $i < strlen($text); $i++) {
            for ($j = 0; $j < $size; $j++) {
                $t = ($result[$j] + $t + ($primes[$k] * ord($text[$i]))) % 255;
                $result[$j] = $t;
            }

            $k = ($k + 1) % count($primes);
        }

        return $result;
    }

    private static function isDivisibleByPrimes($number, $primes)
    {
        foreach ($primes as $prime) {
            if ($number % $prime === 0) {
                return true;
            }
        }

        return false;
    }

    static function hashToString($hashArray)
    {
        $hashString = '';
        foreach ($hashArray as $hashValue) {
            $hashString .= str_pad(dechex($hashValue), 2, '0', STR_PAD_LEFT);
        }
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

$k = new KCryptoUtils();
$key = $k->hash("abc");
$c = $k->encrypt("Jesús es El Señor. Vamos a Güigüe.", $key);
$r = $k->decrypt($c, $key);
echo $r;
